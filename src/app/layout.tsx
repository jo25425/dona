import type {Metadata} from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {Inter} from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";
import {Locale} from "@/config";
import Box from "@mui/material/Box";
import {DonationProvider} from "@/context/DonationContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Dona",
    description: "Social Gathering Platform",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale() as Locale;

    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
            <DonationProvider>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}>
                    <CssBaseline />
                    <Header locale={locale} />
                    {children}
                    <Footer />
                </Box>
            </DonationProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
