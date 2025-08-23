
import { Syne } from "next/font/google";
import localFont from "next/font/local";
import "@workspace/ui/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@workspace/config/console/metadata";
import { DesignSystemProvider } from "@/components/provider";
import { Arapey, Manrope, Karla } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700"],
});

const clash = localFont({
  src: "./font/clash.otf",
  variable: "--font-clash",
});

const primary = Karla({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-primary",
});
const secondary = Arapey({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-secondary",
});
const tertiary = Manrope({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tertiary",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${primary.variable}
        ${clash.variable} ${syne.variable} ${secondary.variable} ${tertiary.variable} antialiased overflow-x-hidden min-h-screen relative`}
        suppressHydrationWarning
      >
        <NextTopLoader color="#ffffff" showSpinner={false} />
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </body>
    </html>
  );
}
