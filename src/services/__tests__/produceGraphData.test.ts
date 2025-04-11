import produceGraphData from "@services/charts/produceGraphData";
import {beforeAll, describe, expect, it} from "@jest/globals";
import {createConversation} from "./testHelpers";
import {GraphData} from "@models/graphData";
import {getEpochSeconds} from "@services/charts/timeAggregates";

describe("produceGraphData", () => {
    const donorId = "donor";

    const testCases = [
        {
            name: "Single conversation with text messages only",
            socialData: {
                donorId,
                conversations: [
                    createConversation("Facebook", [
                        [2023, 12, 1, donorId],
                        [2023, 12, 2, "participant1"],
                        [2023, 12, 3, donorId],
                    ], [], true),
                ],
            },
            expectedGraph: {
                Facebook: {
                    monthlySentReceivedPerConversation: [
                        [
                            { year: 2023, month: 12, sentCount: 30, receivedCount: 15 },
                        ],
                    ],
                    dailyWords: [
                        { year: 2023, month: 12, date: 1, sentCount: 15, receivedCount: 0, epochSeconds: getEpochSeconds(2023, 12, 1) },
                        { year: 2023, month: 12, date: 2, sentCount: 0, receivedCount: 15, epochSeconds: getEpochSeconds(2023, 12, 2) },
                        { year: 2023, month: 12, date: 3, sentCount: 15, receivedCount: 0, epochSeconds: getEpochSeconds(2023, 12, 3) },
                    ],
                    slidingWindowMeanPerConversation: [
                        [
                            { year: 2023, month: 12, date: 1, sentCount: 10, receivedCount: 5, epochSeconds: getEpochSeconds(2023, 12, 1) },
                            { year: 2023, month: 12, date: 2, sentCount: 10, receivedCount: 5, epochSeconds: getEpochSeconds(2023, 12, 2) },
                            { year: 2023, month: 12, date: 3, sentCount: 10, receivedCount: 5, epochSeconds: getEpochSeconds(2023, 12, 3) },
                        ],
                    ],
                    basicStatistics: {
                        sentMessagesTotal: 2,
                        receivedMessagesTotal: 1,
                        sentWordsTotal: 30,
                        receivedWordsTotal: 15,
                        numberOfActiveMonths: 1,
                        numberOfActiveYears: 1,
                        sentPerActiveMonth: 2,
                        receivedPerActiveMonth: 1,
                    },
                    participantsPerConversation: [["participant1"]],
                },
            },
        },
        {
            name: "Group conversation with audio messages",
            socialData: {
                donorId,
                conversations: [
                    createConversation(
                        "WhatsApp",
                        [
                            [2023, 11, 30, donorId],
                            [2023, 12, 1, "participant1"],
                        ],
                        [
                            [2023, 12, 2, "participant2", 30], // Audio message => ignored in stats, word counts, etc
                        ],
                        true
                    ),
                ],
            },
            expectedGraph: {
                WhatsApp: {
                    monthlySentReceivedPerConversation: [
                        [
                            { year: 2023, month: 11, sentCount: 15, receivedCount: 0 },
                            { year: 2023, month: 12, sentCount: 0, receivedCount: 15 },
                        ],
                    ],
                    dailyWords: [
                        { year: 2023, month: 11, date: 30, sentCount: 15, receivedCount: 0, epochSeconds: getEpochSeconds(2023, 11, 30) },
                        { year: 2023, month: 12, date: 1, sentCount: 0, receivedCount: 15, epochSeconds: getEpochSeconds(2023, 12, 1) },
                    ],
                    slidingWindowMeanPerConversation: [
                        [
                            { year: 2023, month: 11, date: 30, sentCount: 8, receivedCount: 8, epochSeconds: getEpochSeconds(2023, 11, 30) },
                            { year: 2023, month: 12, date: 1, sentCount: 8, receivedCount: 8, epochSeconds: getEpochSeconds(2023, 12, 1) },
                        ],
                    ],
                    basicStatistics: {
                        sentMessagesTotal: 1,
                        receivedMessagesTotal: 1,
                        sentWordsTotal: 15,
                        receivedWordsTotal: 15,
                        numberOfActiveMonths: 2,
                        numberOfActiveYears: 1,
                        sentPerActiveMonth: 1,
                        receivedPerActiveMonth: 1,
                    },
                    participantsPerConversation: [["participant1", "participant2"]],
                },
            },
        },
        {
            name: "Conversation excluded from feedback",
            socialData: {
                donorId,
                conversations: [
                    createConversation("Facebook", [
                        [2023, 12, 1, donorId],
                        [2023, 12, 2, "participant1"],
                        [2023, 12, 3, donorId],
                    ], [], false),
                ],
            },
            expectedGraph: {},
        },
    ];

    testCases.forEach(({ name, socialData, expectedGraph }) => {
        describe(name, () => {
            let result: Record<string, GraphData>;

            beforeAll(() => {
                result = produceGraphData(socialData.donorId, socialData.conversations);
            });

            it("should produce the correct data sources", () => {
                expect(Object.keys(result)).toEqual(Object.keys(expectedGraph));
            });

            Object.entries(expectedGraph).forEach(([key, expectedData]) => {
                it(`should produce the expected graph data for dataSource: ${key}`, () => {
                    expect(result[key].monthlyWordsPerConversation).toEqual(
                        expectedData.monthlySentReceivedPerConversation
                    );
                    expect(result[key].dailyWords).toEqual(expectedData.dailyWords);
                    expect(result[key].slidingWindowMeanPerConversation).toEqual(
                        expectedData.slidingWindowMeanPerConversation
                    );
                    expect(result[key].basicStatistics).toEqual(expectedData.basicStatistics);
                    expect(result[key].participantsPerConversation).toEqual(expectedData.participantsPerConversation);
                });
            });
        });
    });
});

