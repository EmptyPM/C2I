"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function MainNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const handleLogout = useCallback(() => {
    // same logic you had earlier for logout
    localStorage.removeItem("accessToken");
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  const isAdmin = user?.role === "ADMIN";

  const displayName =
    user?.firstName && user.firstName.trim().length > 0
      ? `${user.firstName}${user.lastName && user.lastName.trim().length > 0 ? ` ${user.lastName}` : ""}`
      : user?.email?.split("@")[0] || "User";

  return (
    <header className="fixed inset-x-0 top-2 z-40">
      <div className="mx-auto flex h-14 items-center justify-between px-4 rounded-2xl border border-slate-800/70 bg-slate-950/90 backdrop-blur shadow-lg" style={{ maxWidth: '1280px' }}>
        {/* LEFT: logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* Logo */}
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-100">
            Crypto Invest
          </span>
        </Link>

        {/* RIGHT: nav items + auth area */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* nav items */}
          <nav className="hidden gap-3 text-xs text-slate-400 md:flex">
            <Link
              href="/dashboard"
              className={
                pathname?.startsWith("/dashboard")
                  ? "text-sky-300"
                  : "hover:text-slate-100"
              }
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={
                  pathname?.startsWith("/admin")
                    ? "text-sky-300"
                    : "hover:text-slate-100"
                }
              >
                Admin
              </Link>
            )}
          </nav>
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-xs text-slate-300 hover:text-slate-50"
              >
                Login
              </Link>
              <Link href="/register">
                <Button
                  className="h-7 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950 px-3"
                >
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* CLICK AREA: avatar + name + role */}
                <button className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-left text-xs text-slate-100 shadow-sm hover:border-sky-500/70 hover:bg-slate-900 transition">
                  {/* AVATAR (keep this) */}
                  <Avatar className="h-8 w-8 border border-slate-700 shadow-[0_0_12px_rgba(56,189,248,0.45)]">
                    <AvatarImage src="" alt={user.firstName || user.email} />
                    <AvatarFallback className="text-xs font-semibold text-sky-300 bg-slate-900">
                      {(user.firstName?.[0] ||
                        user.email?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* NAME AND ROLE STACKED */}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-50 leading-tight">
                      {user.firstName && user.firstName.trim().length > 0
                        ? `${user.firstName}${user.lastName && user.lastName.trim().length > 0 ? ` ${user.lastName}` : ""}`
                        : user.email?.split("@")[0] || "User"}
                    </span>
                    {/* ROLE PILL UNDER NAME */}
                    <span
                      className={`mt-0.5 inline-block w-fit rounded-full px-1.5 py-[1px] text-[7px] uppercase tracking-wide ${
                        user.role === "ADMIN"
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/50"
                          : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/50"
                      }`}
                    >
                      {user.role || "USER"}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="min-w-[180px] bg-slate-900 border-slate-700 text-xs"
              >
                <DropdownMenuLabel className="text-[11px] text-slate-400">
                  {user.firstName && user.firstName.trim().length > 0
                    ? `${user.firstName}${user.lastName && user.lastName.trim().length > 0 ? ` ${user.lastName}` : ""}`
                    : user.email?.split("@")[0] || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-xs"
                  onClick={() => router.push("/account")}
                >
                  Account
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-xs text-rose-400 focus:text-rose-400"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

