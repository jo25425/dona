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
    monthlySentReceivedPerConversation: SentReceivedPoint[][];
    dailyWords: DailySentReceivedPoint[];
    dailyWordsPerConversation: DailySentReceivedPoint[][];
    slidingWindowMeanPerConversation: DailySentReceivedPoint[][];
    dailySentHoursPerConversation: DailyHourPoint[][];
    dailyReceivedHoursPerConversation: DailyHourPoint[][];
    answerTimes: AnswerTimePoint[];
    basicStatistics: BasicStatistics;
    participantsPerConversation: string[][];
}
