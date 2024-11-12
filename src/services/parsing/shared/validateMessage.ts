export default function validateMessage(message: Record<string, any>): boolean {
    const messageKeys = Object.keys(message);
    return (
        messageKeys.includes("sender_name") &&
        messageKeys.includes("content") &&
        messageKeys.includes("timestamp_ms")
    );
}