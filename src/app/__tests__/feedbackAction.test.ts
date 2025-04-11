
import {fetchGraphDataByDonationId, getDonationId} from "@/app/donation-feedback/actions";
import {db} from "@/db/drizzle";
import headers from "next/headers";
import {describe, expect, it, jest} from "@jest/globals";
import {GraphData} from "@models/graphData";

jest.mock("@/db/drizzle");
jest.mock("next/headers");

const mockGraphData: Record<string, GraphData> = {
    Facebook: {
        monthlyWordsPerConversation: [],
        dailyWords: [],
        dailyWordsPerConversation: [],
        slidingWindowMeanPerConversation: [],
        dailySentHoursPerConversation: [],
        dailyReceivedHoursPerConversation: [],
        answerTimes: [],
        basicStatistics: {
            sentMessagesTotal: 0,
            receivedMessagesTotal: 0,
            sentWordsTotal: 0,
            receivedWordsTotal: 0,
            numberOfActiveMonths: 0,
            numberOfActiveYears: 0,
            sentPerActiveMonth: 0,
            receivedPerActiveMonth: 0,
        },
        participantsPerConversation: [],
    },
};

describe("fetchGraphDataByDonationId", () => {

    it("should return graph data for a valid donation ID", async () => {
        // @ts-ignore
        db.query.graphData.findFirst = jest.fn().mockResolvedValue({data: mockGraphData});

        const result = await fetchGraphDataByDonationId("test-donation-id");
        expect(result).toEqual(mockGraphData);
        expect(db.query.graphData.findFirst).toHaveBeenCalledWith({
            where: expect.any(Object),
            columns: { data: true },
        });
    });

    it("should throw an error if no graph data is found", async () => {
        // @ts-ignore
        db.query.graphData.findFirst = jest.fn().mockResolvedValue(null);

        await expect(fetchGraphDataByDonationId("test-donation-id")).rejects.toThrow(
            "Graph data not found for the given donation ID."
        );
    });
});

describe("getDonationId", () => {
    it("should return the donation ID from cookies", async () => {
        const getMock = jest.fn().mockReturnValue({value: "test-donation-id"});
        // @ts-ignore
        headers.cookies = jest.fn().mockResolvedValue({get: getMock});

        const result = await getDonationId();
        expect(result).toBe("test-donation-id");
        expect(getMock).toHaveBeenCalled();
    });

    it("should return undefined if the donation ID cookie is not set", async () => {
        const getMock = jest.fn().mockReturnValue(undefined);
        // @ts-ignore
        headers.cookies = jest.fn().mockResolvedValue({get: getMock});

        const result = await getDonationId();
        expect(result).toBeUndefined();
        expect(getMock).toHaveBeenCalled();
    });
});
