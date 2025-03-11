import {addDonation} from "../data-donation/actions";
import {describe, test} from '@jest/globals';

const testData = {
    "donorAlias": "Donor",
    "conversations": [
        {
            "isGroupConversation": false,
            "conversationId": "FooBar",
            "participants": ["Donor", "Contact 1"],
            "messages": [
                {
                    "wordCount": 40,
                    "timestamp": 1528101324250,
                    "sender": "Donor"
                }
            ],
            "messagesAudio": [
                {
                    "lengthSeconds": 20,
                    "timestamp": 1528101324250,
                    "sender": "Donor"
                }
            ],
            "dataSource": "WhatsApp",
            "conversationPseudonym": "Chat W1"
        }
    ]
}

describe("addDonation", () => {

    test("adds a new donation to the database", async () => {
        await addDonation(testData.conversations, testData.donorAlias)
    })
})