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
    description: "Pittsburgh-based software development company specializing in GIS, web applications, and custom technology solutions. We solve problems with innovative, efficient, and collaborative approaches.",
    keywords: [
        "software development",
        "developers",
        "software engineers",
        "web development",
        "custom software",
        "GIS development",
        "GIS",
        "geographic information systems",
        "web applications",
        "technology solutions",
        "software consulting",
        "Pittsburgh developers",
        "full stack development",
        "frontend development",
        "backend development",
        "cloud solutions",
        "API development",
        "mobile development",
        "software engineering",
        "tech company",
        "Pittsburgh",
        "Pittsburgh software",
        "pitt",
        "Pitt",
        "code development",
        "programming services",
        "application development",
        "digital solutions",
        "software architecture",
        "agile development",
        "geospatial",
        "spatial",
        "mapping",
        "location-based services",
        "microservices",
        "GIS engineering",
        "data visualization",
        "database management",
        "spatial analysis"
    ],
    authors: [{ name: "Code Cat Developers" }],
    creator: "Code Cat Developers",
    publisher: "Code Cat Developers",
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://codecatdevs.com",
        title: "Code Cat Developers",
        description: "Pittsburgh-based software development company specializing in GIS, web applications, and custom technology solutions.",
        siteName: "Code Cat Developers",
    },
    twitter: {
        card: "summary_large_image",
        title: "Code Cat Developers",
        description: "Pittsburgh-based software development company specializing in GIS, web applications, and custom technology solutions.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
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
            accentColor="orange"
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