"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import {Conversation} from "@models/processed";

interface DonationContextType {
    donationData: Conversation[] | null;
    setDonationData: (result: Conversation[] | null) => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

// Provider component
export const DonationProvider = ({ children }: { children: ReactNode }) => {
    const [donationData, setDonationData] = useState<Conversation[] | null>(null);

    return (
        <DonationContext.Provider value={{ donationData, setDonationData }}>
            {children}
        </DonationContext.Provider>
    );
};

// Hook to use the context
export const useDonation = () => {
    const context = useContext(DonationContext);
    if (!context) {
        throw new Error('useDonation must be used within a DonationProvider');
    }
    return context;
};
