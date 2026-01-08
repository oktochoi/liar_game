import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "라이어 게임 - 친구들과 함께 즐기는 추리 파티 게임",
  description: "라이어, 스파이, 하이브리드 모드를 지원하는 온라인 라이어 게임. 친구들과 함께 즐기는 추리 파티 게임으로 단어를 맞추고 라이어를 찾아내세요!",
  keywords: "라이어 게임, 추리 게임, 파티 게임, 라이어 찾기, 스파이 게임, 하이브리드 모드, 온라인 게임",
  openGraph: {
    title: "라이어 게임 - 친구들과 함께 즐기는 추리 파티 게임",
    description: "라이어, 스파이, 하이브리드 모드를 지원하는 온라인 라이어 게임",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
