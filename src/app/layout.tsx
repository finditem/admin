import "./globals.css";
import localFont from "next/font/local";
import { Metadata, Viewport } from "next";

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    template: "%s | 찾아줘! 관리자",
    absolute: "관리자 메인 페이지 | 찾아줘! 관리자",
  },
  description: "찾아줘의 관리자만 접근할 수 있어요.",
  icons: {
    icon: "/favicon/default/favicon-32.png",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="mx-auto max-w-[768px] border-x-2 flex-col-center">
        <main className="w-full flex-1">{children}</main>
      </body>
    </html>
  );
}
