import type {Metadata} from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import {Locale} from "@/config";

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
            <Header locale={locale}/>
            {children}
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
