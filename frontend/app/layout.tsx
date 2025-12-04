"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { ReactQueryProvider } from "../components/ReactQueryProvider";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  return (
    <html lang="en" suppressHydrationWarning className="bg-slate-950">
      <body className="min-h-screen bg-slate-950 text-slate-50" suppressHydrationWarning>
        <ReactQueryProvider>
          {/* Hide navbar on auth pages */}
          {!isAuthPage && <MainNavbar />}

          <div className={isAuthPage ? "" : "pt-14"}>
            <div className="min-h-screen bg-gradient-to-br from-[#05081a] via-[#05081a] to-[#25144a]">
              {/* ---- CONTAINER LOGIC ---- */}
              {/* All pages: 1280px centered */}
                <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:py-8">
                  {children}
                </div>
            </div>
          </div>
          {/* Footer */}
          {!isAuthPage && <Footer />}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
