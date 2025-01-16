"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { GraphData } from "@models/graphData";
import { DataSourceValue } from "@models/processed";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { DONATION_ID_COOKIE } from "@/middleware";

interface DonationContextType {
    donationId?: string;
    feedbackData?: Record<DataSourceValue, GraphData>;
    externalDonorId?: string;
    setDonationData: (donationId: string, graphDataRecord: Record<DataSourceValue, GraphData>) => void;
    setExternalDonorId: (id: string) => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: ReactNode }) {
    const [donationId, setDonationId] = useState<string | undefined>();
    const [feedbackData, setFeedbackData] = useState<Record<DataSourceValue, GraphData> | undefined>();
    const [externalDonorId, setExternalDonorIdState] = useState<string | undefined>();

    const setCookie = (name: string, value: string) => {
        Cookies.set(name, value, {
            secure: process.env.NODE_ENV === "production",
            path: "/",
        });
    };

    const setDonationData = (id: string, record: Record<DataSourceValue, GraphData>) => {
        setDonationId(id);
        setFeedbackData(record);
        setCookie(DONATION_ID_COOKIE, id);
    };

    const setExternalDonorId = (id: string) => {
        setExternalDonorIdState(id);
        setCookie("externalDonorId", id);
    };

    return (
        <DonationContext.Provider value={{ donationId, feedbackData, externalDonorId, setDonationData, setExternalDonorId }}>
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

export function generateExternalDonorId(): string {
    return Math.random().toString(36).substring(2, 8);
}
