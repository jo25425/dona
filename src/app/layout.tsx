import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Buffer } from "buffer";
import "@/styles/globals.css";
import { Locale } from "@/config";
import Box from "@mui/material/Box";
import { DonationProvider } from "@/context/DonationContext";

if (typeof window !== "undefined" && !window.Buffer) {
    window.Buffer = Buffer;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dona",
    description: "Social Gathering Platform",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = (await getLocale()) as Locale;
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body className={inter.className} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <NextIntlClientProvider messages={messages}>
            <DonationProvider>
                <CssBaseline />
                <Header locale={locale} />
                <Box sx={{ flex: "1 0 auto" }}> {/* Pushes footer down if content is short */}
                    {children}
                </Box>
                <Footer />
            </DonationProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
