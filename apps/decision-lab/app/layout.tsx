import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "纠结终结者 · AI 决策助手",
  description: "别纠结了，让 AI 帮你理清选择。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
