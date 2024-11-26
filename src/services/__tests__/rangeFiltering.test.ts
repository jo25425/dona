import { calculateMinMaxDates, filterDataByRange, NullableRange } from "@services/rangeFiltering";
import { Conversation } from "@models/processed";
import {describe, expect, it} from '@jest/globals';

const mockConversations: Conversation[] = [
    {
        id: "1",
        isGroupConversation: true,
        dataSource: "sourceA",
        messages: [
            { timestamp: new Date("2024-01-01").getTime(), wordCount: 5, sender: "Alice" },
            { timestamp: new Date("2024-02-15").getTime(), wordCount: 10, sender: "Bob" },
        ],
        messagesAudio: [
            { timestamp: new Date("2024-02-20").getTime(), lengthSeconds: 30, sender: "Alice" },
            { timestamp: new Date("2024-03-10").getTime(), lengthSeconds: 45, sender: "Bob" },
        ],
        participants: ["Alice", "Bob"],
        conversationPseudonym: "Group1",
    },
    {
        id: "2",
        isGroupConversation: false,
        dataSource: "sourceB",
        messages: [
            { timestamp: new Date("2023-12-25").getTime(), wordCount: 15, sender: "Charlie" },
            { timestamp: new Date("2024-01-10").getTime(), wordCount: 20, sender: "Charlie" },
        ],
        messagesAudio: [],
        participants: ["Charlie"],
        conversationPseudonym: "Chat2",
    },
];

describe("calculateMinMaxDates", () => {
    it("calculates the correct min and max dates", () => {
        const result = calculateMinMaxDates(mockConversations);
        expect(result).toEqual({
            minDate: new Date("2023-12-25"),
            maxDate: new Date("2024-03-10"),
        });
    });

    it("returns null for minDate and maxDate if there are no conversations", () => {
        const result = calculateMinMaxDates([]);
        expect(result).toEqual({ minDate: null, maxDate: null });
    });

    it("handles conversations with no messages or messagesAudio", () => {
        const result = calculateMinMaxDates([
            {
                id: "3",
                isGroupConversation: true,
                dataSource: "sourceC",
                messages: [],
                messagesAudio: [],
                participants: ["Dave"],
                conversationPseudonym: "EmptyGroup",
            },
        ]);

        expect(result).toEqual({ minDate: null, maxDate: null });
    });
});

describe("filterDataByRange", () => {
    it("filters conversations based on a valid date range", () => {
        const range: NullableRange = [new Date("2024-01-01"), new Date("2024-02-28")];
        const filtered = filterDataByRange(mockConversations, range);
        expect(filtered).toEqual([
            {
                id: "1",
                isGroupConversation: true,
                dataSource: "sourceA",
                messages: [
                    { timestamp: new Date("2024-01-01").getTime(), wordCount: 5, sender: "Alice" },
                    { timestamp: new Date("2024-02-15").getTime(), wordCount: 10, sender: "Bob" },
                ],
                messagesAudio: [
                    { timestamp: new Date("2024-02-20").getTime(), lengthSeconds: 30, sender: "Alice" },
                ],
                participants: ["Alice", "Bob"],
                conversationPseudonym: "Group1",
            },
            {
                id: "2",
                isGroupConversation: false,
                dataSource: "sourceB",
                messages: [
                    { timestamp: new Date("2024-01-10").getTime(), wordCount: 20, sender: "Charlie" },
                ],
                messagesAudio: [],
                participants: ["Charlie"],
                conversationPseudonym: "Chat2",
            },
        ]);
    });

    it("returns all conversations if the range is null", () => {
        const filtered = filterDataByRange(mockConversations, [null, null]);
        expect(filtered).toEqual(mockConversations);
    });

    it("filters out all conversations if no messages fall within the range", () => {
        const range: NullableRange = [new Date("2025-01-01"), new Date("2025-12-31")];
        const filtered = filterDataByRange(mockConversations, range);
        expect(filtered).toEqual([]);
    });

    it("filters conversations with partial matches in messages and messagesAudio", () => {
        const range: NullableRange = [new Date("2024-02-01"), new Date("2024-02-28")];
        const filtered = filterDataByRange(mockConversations, range);
        expect(filtered).toEqual([
            {
                id: "1",
                isGroupConversation: true,
                dataSource: "sourceA",
                messages: [
                    { timestamp: new Date("2024-02-15").getTime(), wordCount: 10, sender: "Bob" },
                ],
                messagesAudio: [
                    { timestamp: new Date("2024-02-20").getTime(), lengthSeconds: 30, sender: "Alice" },
                ],
                participants: ["Alice", "Bob"],
                conversationPseudonym: "Group1",
            },
        ]);
    });

    it("handles conversations with no messages or messagesAudio", () => {
        const filtered = filterDataByRange([
            {
                id: "3",
                isGroupConversation: true,
                dataSource: "sourceC",
                messages: [],
                messagesAudio: [],
                participants: ["Dave"],
                conversationPseudonym: "EmptyGroup",
            },
        ], [new Date("2024-01-01"), new Date("2024-12-31")]);
        expect(filtered).toEqual([]);
    });
});