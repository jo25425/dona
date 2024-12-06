"use server";

import {cookies} from 'next/headers';
import {db} from "@/db/drizzle";
import {graphData} from "@/db/schema";
import {GraphData} from "@models/graphData";
import {eq} from "drizzle-orm";
import {DONATION_ID_COOKIE} from "@/middleware";

export async function fetchGraphDataByDonationId(donationId: string): Promise<Record<string, GraphData>> {
    const result = await db.query.graphData.findFirst({
        where: eq(graphData.donationId, donationId),
        columns: { data: true },
    });

    if (!result) {
        throw new Error("Graph data not found for the given donation ID.");
    }

    return result.data as Record<string, GraphData>;
}


export async function getDonationId() {
    return (await cookies()).get(DONATION_ID_COOKIE)?.value;
}