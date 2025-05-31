import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import PageTransition from "@/components/page-transition";
import { getMe, getCategories } from "@/utils/api";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LikeSubViet - Dịch vụ mạng xã hội hàng đầu",
  description: "Dịch vụ mạng xã hội hàng đầu Việt Nam",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const categories = await getCategories(token);
  const user = await getMe(token);

  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/app.css" />
        <link rel="stylesheet" href="/assets/css/uikit.css" />
        <link rel="stylesheet" href="/assets/css/style-preset.css" />
        <link rel="stylesheet" href="/assets/fonts/inter/inter.css" id="main-font-link" />
        <link rel="stylesheet" href="/assets/fonts/tabler-icons.min.css" />
        <link rel="stylesheet" href="/assets/fonts/feather.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome.css" />
        <link rel="stylesheet" href="/assets/fonts/material.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout categories={categories.data} user={user}>
          <PageTransition>{children}</PageTransition>
        </ClientLayout>
      </body>
    </html>
  );
}
