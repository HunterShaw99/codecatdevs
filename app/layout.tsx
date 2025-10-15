import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import AppLayout from "./components/sidebar/AppLayout";
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

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
    icons: {
        icon: "/code_cat_white.svg",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Theme
            appearance="dark"
            accentColor="blue"
            grayColor="slate"
            panelBackground="solid"
            scaling="100%"
            radius="medium"
        >
            <AppLayout>
                {children}
            </AppLayout>
        </Theme>
        </body>
        </html>
    );
}