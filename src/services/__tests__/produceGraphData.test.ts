import { produceGraphData } from "@/services/charts/produceGraphData";
import {beforeAll, describe, expect, it} from "@jest/globals";
import {createConversation, getEpochSeconds} from "./testHelpers";
import {GraphData} from "@models/graphData";

describe("produceGraphData", () => {
    const donorId = "donor";

    const singleConvoSingleMonth = {
        name: "One conversation with three messages in a single month",
        socialData: {
            donorId,
            conversations: [
                createConversation("Facebook", [
                    [2017, 1, donorId],
                    [2017, 1, "participant1"],
                    [2017, 1, donorId],
                ]),
            ],
        },
        expectedGraph: {
            Facebook: {
                monthlySentReceivedPerConversation: [
                    [
                        { year: 2017, month: 1, sentCount: 30, receivedCount: 15 },
                    ],
                ],
                dailyWords: [
                    {
                        year: 2017,
                        month: 1,
                        date: 1,
                        sentCount: 30,
                        receivedCount: 15,
                        epochSeconds: getEpochSeconds(2017, 1, 1, 12, 30),
                    },
                ],
                dailyWordsPerConversation: [
                    [
                        {
                            year: 2017,
                            month: 1,
                            date: 1,
                            sentCount: 30,
                            receivedCount: 15,
                            epochSeconds: getEpochSeconds(2017, 1, 1, 12, 30),
                        },
                    ],
                ],
                slidingWindowMeanPerConversation: [
                    [
                        {
                            year: 2017,
                            month: 1,
                            date: 1,
                            sentCount: 30, // Adjust to the expected mean value
                            receivedCount: 15, // Adjust to the expected mean value
                            epochSeconds: getEpochSeconds(2017, 1, 1, 12, 30),
                        },
                    ],
                ],
                dailySentHoursPerConversation: [
                    [
                        {
                            year: 2017,
                            month: 1,
                            date: 1,
                            hour: 12,
                            minute: 0,
                            wordCount: 30,
                            epochSeconds: getEpochSeconds(2017, 1, 1, 12, 0),
                        },
                    ],
                ],
                dailyReceivedHoursPerConversation: [
                    [
                        {
                            year: 2017,
                            month: 1,
                            date: 1,
                            hour: 12,
                            minute: 0,
                            wordCount: 15,
                            epochSeconds: getEpochSeconds(2017, 1, 1, 12, 0),
                        },
                    ],
                ],
                answerTimes: [
                    { responseTimeMs: 0, isFromDonor: false, timestampMs: getEpochSeconds(2017, 1, 1, 12, 0) * 1000 },
                    { responseTimeMs: 0, isFromDonor: true, timestampMs: getEpochSeconds(2017, 1, 1, 12, 0) * 1000 },
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
    };

    const testCases = [singleConvoSingleMonth]; // Add more test cases here

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
                    expect(result[key].monthlySentReceivedPerConversation).toEqual(
                        expectedData.monthlySentReceivedPerConversation
                    );
                    expect(result[key].dailyWords).toEqual(expectedData.dailyWords);
                    expect(result[key].dailyWordsPerConversation).toEqual(expectedData.dailyWordsPerConversation);
                    expect(result[key].slidingWindowMeanPerConversation).toEqual(
                        expectedData.slidingWindowMeanPerConversation
                    );
                    expect(result[key].dailySentHoursPerConversation).toEqual(expectedData.dailySentHoursPerConversation);
                    expect(result[key].dailyReceivedHoursPerConversation).toEqual(
                        expectedData.dailyReceivedHoursPerConversation
                    );
                    expect(result[key].answerTimes).toEqual(expectedData.answerTimes);
                    expect(result[key].basicStatistics).toEqual(expectedData.basicStatistics);
                    expect(result[key].participantsPerConversation).toEqual(expectedData.participantsPerConversation);
                });
            });
        });
    });
});

