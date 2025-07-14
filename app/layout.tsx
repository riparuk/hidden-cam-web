import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hidden Cam Web - Let's Debunk Scammers",
  description:
    "Record and save video evidence secretly through your browser. Ideal for exposing scammers. 100% local and private.",
  keywords: [
    "hidden camera",
    "covert recorder",
    "web cam recorder",
    "discreet video recording",
    "evidence recording",
    "corruption exposure",
    "bribery",
    "whistleblower tool",
    "local video storage",
    "browser camera recording",
  ],
  openGraph: {
    title: "Hidden Cam Web - Let's Debunk Scammers",
    description:
      "Record and save video evidence secretly through your browser. Ideal for exposing scammers.",
    url: "https://hidden-cam-web.vercel.app",
    siteName: "Hidden Cam Web",
    images: [
      {
        url: "https://raw.githubusercontent.com/riparuk/hidden-cam-web/main/assets/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Hidden Cam Web Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {children}
      <Footer />
      </body>
    </html>
  );
}
