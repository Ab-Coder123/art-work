import type { Metadata } from "next";
import "./globals.css";
import { AdminSidebar } from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Art Work // Studio Control Center",
  description: "Standalone administrative dashboard for Art Work Marketing Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0d0d12] text-[#f3f3f6] antialiased min-h-screen flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
