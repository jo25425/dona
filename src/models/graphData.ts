export type CountOption =  "words" | "seconds" | "messages";

export interface SentReceivedPoint {
    year: number;
    month: number;
    sentCount: number;
    receivedCount: number;
}

export interface DailySentReceivedPoint {
    year: number;
    month: number;
    date: number;
    sentCount: number;
    receivedCount: number;
    epochSeconds: number;
}

export interface AnswerTimePoint {
    responseTimeMs: number;
    isFromDonor: boolean;
    timestampMs: number;
}

export interface DailyHourPoint {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    wordCount: number;
    epochSeconds: number;
}

export interface BasicStatistics {
    sentMessagesTotal: number;
    receivedMessagesTotal: number;
    sentWordsTotal: number;
    receivedWordsTotal: number;
    numberOfActiveMonths: number;
    numberOfActiveYears: number;
    sentPerActiveMonth: number;
    receivedPerActiveMonth: number;
}

export interface GraphData {
    focusConversations: string[];
    monthlyWordsPerConversation: Record<string, SentReceivedPoint[]>;
    monthlySecondsPerConversation: Record<string, SentReceivedPoint[]>;
    dailyWordsPerConversation: DailySentReceivedPoint[][];
    participantsPerConversation: string[][];

    dailyWords: DailySentReceivedPoint[];
    slidingWindowMeanDailyWords: DailySentReceivedPoint[];
    dailySentHours: DailyHourPoint[];
    dailyReceivedHours: DailyHourPoint[];
    answerTimes: AnswerTimePoint[];
    basicStatistics: BasicStatistics;
}
