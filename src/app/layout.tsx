import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/context/UserContext";
import BackgroundVideo from "./components/BackgroundVideo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "감정 일기",
  description: "당신의 감정을 기록하고 공유하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* 배경 영상 컴포넌트 */}
        <BackgroundVideo />
        
        {/* 메인 콘텐츠 */}
        <div className="relative z-10">
          <UserProvider>
            {children}
          </UserProvider>
        </div>
      </body>
    </html>
  );
}