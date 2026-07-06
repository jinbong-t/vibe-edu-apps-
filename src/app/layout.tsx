import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바이브 웹앱 모음",
  description: "선생님들을 위한 유용한 웹앱 모음 포털입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
