function isVoiceMessage(message: Record<string, any>): boolean {
    const messageKeys = Object.keys(message);
    return (
        messageKeys.includes("sender_name") &&
        messageKeys.includes("audio_files") &&
        messageKeys.includes("timestamp_ms")
    );
}

function isTextMessage(message: Record<string, any>): boolean {
    const messageKeys = Object.keys(message);
    return (
        messageKeys.includes("sender_name") &&
        messageKeys.includes("content") &&
        messageKeys.includes("timestamp_ms")
    );
}

export { isTextMessage, isVoiceMessage };