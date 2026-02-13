import type { Metadata, Viewport } from "next";
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

// 1. PWA & Mobile Settings
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming on inputs (app-like feel)
};

// 2. SEO & OpenGraph
export const metadata: Metadata = {
  metadataBase: new URL("https://audit.jetnoir.systems"),
  title: {
    default: "Design Vision AI | Jet Noir Systems",
    template: "%s | Design Vision AI",
  },
  description: "Multimodal design and video analysis engine. Instant, objective scoring for UI layouts and kinetic motion.",
  applicationName: "Design Vision AI",
  authors: [{ name: "Jet Noir Systems", url: "https://jetnoir.systems" }],
  keywords: ["Design Audit", "AI Grading", "UX Review", "Motion Design", "Education Technology"],
  
  // OpenGraph (Social Sharing)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://audit.jetnoir.systems",
    title: "Design Vision AI",
    description: "Automated 'Senior Art Director' for your design workflow. Upload images or video for instant technical grading.",
    siteName: "Jet Noir Academy",
    images: [
      {
        url: "/og-image.png", // We will need to add this file
        width: 1200,
        height: 630,
        alt: "Design Vision AI Interface",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Design Vision AI",
    description: "Multimodal design scoring for the modern web.",
    images: ["/og-image.png"],
    creator: "@jetnoirsystems",
  },

  // PWA Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  
  // Apple Specific
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Design Vision",
  },
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