"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { GraphData } from "@models/graphData";
import { DataSourceValue } from "@models/processed";

interface DonationContextType {
    donationId?: string;
    feedbackData?: Record<DataSourceValue, GraphData>;
    setDonationData: (donationId: string, graphDataRecord: Record<DataSourceValue, GraphData>) => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: ReactNode }) {
    const [donationId, setDonationId] = useState<string | undefined>();
    const [feedbackData, setFeedbackData] = useState<Record<DataSourceValue, GraphData> | undefined>();

    const setDonationData = (id: string, record: Record<DataSourceValue, GraphData>) => {
        setDonationId(id);
        setFeedbackData(record);
    };

    return (
        <DonationContext.Provider value={{ donationId, feedbackData, setDonationData }}>
            {children}
        </DonationContext.Provider>
    );
}

export function useDonation() {
    const context = useContext(DonationContext);
    if (!context) {
        throw new Error("useDonation must be used within a DonationProvider");
    }
    return context;
}