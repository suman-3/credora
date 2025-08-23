import { Geist, Geist_Mono } from "next/font/google";
import { Syne } from "next/font/google";
import localFont from "next/font/local";
import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";
import { Metadata } from "next";
import { siteConfig } from "@workspace/config/web/metadata";
import { Provider } from "@/components/provider";
import { Navbar } from "../components/shared/navbar";


const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700"],
});

const clash = localFont({
  src: "./font/clash.otf",
  variable: "--font-clash",
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
        className={cn(
          syne.variable,
          clash.variable,
          "antialiased overflow-x-hidden min-w-screen bg-[#070E02]"
        )}
        suppressHydrationWarning
      >
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
