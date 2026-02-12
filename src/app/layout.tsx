import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// UPDATED METADATA
export const metadata: Metadata = {
  title: "Design Vision AI | Jet Noir Systems",
  description: "Multimodal design and video analysis engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <ConvexClientProvider>
            {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}