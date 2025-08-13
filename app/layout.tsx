import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import AppLayout from "./components/sidebar/AppLayout";
import Head from "next/head";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Code Cat Developers",
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <Head>
            <link rel="icon" href="/code_cat_white.svg" type="image/svg+xml" />
        </Head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AppLayout>
            {children}
        </AppLayout>
        </body>
        </html>
    );
}