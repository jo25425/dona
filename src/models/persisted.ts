import {conversations, messages, messagesAudio} from "@/db/schema";

type NewConversation = typeof conversations.$inferInsert;
// namespace NewConversation {
//     export function create(
//         donationId: string,
//         dataSource: string,
//         dataSourceOptions: { name: string; id: string }[],
//         isGroupConversation?: boolean
//     ): NewConversation {
//         return {
//             donationId,
//             dataSourceId: dataSourceOptions.find(({ name }) => name === dataSource)!.id,
//             isGroupConversation: isGroupConversation || undefined,
//         };
//     }
// }


type NewMessage = typeof messages.$inferInsert;
type NewMessageAudio = typeof messagesAudio.$inferInsert;

export type {NewConversation, NewMessage, NewMessageAudio};
