import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "라이어 게임 플레이 - 게임 시작하기",
  description: "라이어 게임을 플레이하세요. 플레이어를 추가하고 게임 모드를 선택하여 추리 게임을 즐기세요!",
  robots: {
    index: true,
    follow: true,
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

