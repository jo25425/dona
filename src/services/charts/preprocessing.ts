export function createListOfConversations(
    conversationContacts: string[][],
    chat: string,
    chatInitial: string,
    chatWith: string,
    contactInitial: string,
    systemName: string
): string[] {
    const conversationsWithoutSystem = conversationContacts.map((conversation) =>
        conversation.filter((contact) => contact !== systemName)
    );

    return conversationsWithoutSystem.map((contacts, index) => {
        const shortenedContacts = contacts.map((contact) =>
            shortenContactPseudonym(contact, contactInitial, systemName)
        );

        let listItem = `${chatWith} <br> ${shortenedContacts[0]}`;
        for (let i = 1; i < shortenedContacts.length; i++) {
            if (shortenedContacts[i] !== "donor") {
                if (i > 6) {
                    listItem += ", ...";
                    break;
                }

                listItem += ", " + (i % 4 === 0? "<br>":'') + shortenedContacts[i];
            }
        }

        return `${chat} ${chatInitial}${index + 1}`;
    });
}

const shortenContactPseudonym = (contact: string, contactInitial: string, systemName: string): string => {
    if (contact === systemName) {
        return systemName;
    }

    const numberStart = contact.search(/\d+/); // Find where the number starts
    return numberStart !== -1
        ? contactInitial + contact.substring(numberStart)
        : contact;
};
