import { addDonation } from "../data-donation/actions";
import {describe, expect, test} from '@jest/globals';

const testData = {
    "donorId": "c603ab8f-75a7-4e19-a1d7-2ef21db59d78",
    "conversations": [
        {
            "isGroupConversation": false,
            "conversationId": "FooBar",
            "participants": ["c603ab8f-75a7-4e19-a1d7-2ef21db59d78", "435d79be-93a5-4b04-a3aa-37f3df04c89b"],
            "messages": [
                {
                    "wordCount": 40,
                    "timestamp": 1528101324250,
                    "sender": "c603ab8f-75a7-4e19-a1d7-2ef21db59d78"
                }
            ],
            "messagesAudio": [
                {
                    "lengthSeconds": 20,
                    "timestamp": 1528101324250,
                    "sender": "c603ab8f-75a7-4e19-a1d7-2ef21db59d78"
                }
            ],
            "dataSource": "WhatsApp",
        }
    ]
}

describe("addDonation", () => {

    // test('TextEncoder is globally defined in Jest', () => {
    //     expect(global.TextEncoder).toBeDefined();
    //     expect(TextEncoder).toBeDefined();
    // });

    test("adds a new donation to the database", async () => {
        await addDonation(testData)
    })
})