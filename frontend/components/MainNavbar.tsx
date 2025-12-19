"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useCallback, useState, useEffect } from "react";
import { api } from "@/lib/api-client";
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

const fetchLogo = async (): Promise<{ logoUrl: string | null }> => {
  const res = await api.get('/settings/logo');
  return res.data;
};

const fetchHomeUrl = async (): Promise<{ homeUrl: string }> => {
  const res = await api.get('/settings/home-url');
  return res.data;
};

export default function MainNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: logoData } = useQuery({
    queryKey: ['platformLogo'],
    queryFn: fetchLogo,
  });
  const { data: homeUrlData } = useQuery({
    queryKey: ['homeUrl'],
    queryFn: fetchHomeUrl,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if homeUrl is external (starts with http:// or https://)
  const isExternalUrl = (url: string | undefined) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const homeUrl = homeUrlData?.homeUrl || '/';
  const isHomeExternal = isExternalUrl(homeUrl);

  const handleLogout = useCallback(() => {
    // same logic you had earlier for logout
    localStorage.removeItem("accessToken");
    queryClient.clear();
    router.push("/login");
    setMobileMenuOpen(false);
  }, [queryClient, router]);

  const isAdmin = user?.role === "ADMIN";

  const displayName =
    user?.firstName && user.firstName.trim().length > 0
      ? `${user.firstName}${user.lastName && user.lastName.trim().length > 0 ? ` ${user.lastName}` : ""}`
      : user?.email?.split("@")[0] || "User";

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-2 z-40">
        <div className="mx-auto flex h-14 items-center justify-between px-4 rounded-2xl border border-slate-800/70 bg-slate-950/90 backdrop-blur shadow-lg" style={{ maxWidth: '1280px' }}>
          {/* LEFT: logo */}
          {isHomeExternal ? (
            <a href={homeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              {/* Logo - Display uploaded logo or fallback to text logo */}
              {logoData?.logoUrl ? (
                <img 
                  src={`http://localhost:4000${logoData.logoUrl}`}
                  alt="Fynex Logo"
                  className="h-8 object-contain"
                />
              ) : (
                <div className="flex items-center">
                  <span className="text-xl font-bold tracking-tight" style={{ 
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    FYNEX
                  </span>
                  {/* Upward arrow accent */}
                  <svg 
                    className="h-4 w-4 text-cyan-400 ml-0.5 -mt-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </a>
          ) : (
            <Link href={homeUrl} className="flex items-center gap-2">
              {/* Logo - Display uploaded logo or fallback to text logo */}
              {logoData?.logoUrl ? (
                <img 
                  src={`http://localhost:4000${logoData.logoUrl}`}
                  alt="Fynex Logo"
                  className="h-8 object-contain"
                />
              ) : (
                <div className="flex items-center">
                  <span className="text-xl font-bold tracking-tight" style={{ 
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    FYNEX
                  </span>
                  {/* Upward arrow accent */}
                  <svg 
                    className="h-4 w-4 text-cyan-400 ml-0.5 -mt-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </Link>
          )}

          {/* RIGHT: nav items + auth area */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Desktop nav items */}
            <nav className="hidden gap-3 text-xs text-slate-400 md:flex">
              {isHomeExternal ? (
                <a
                  href={homeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-100 transition-colors flex items-center gap-1.5 group"
                  title={`External link: ${homeUrl}`}
                >
                  <span>Home</span>
                  <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={homeUrl}
                  className={
                    homeUrl === "/"
                      ? pathname === "/"
                        ? "text-sky-300"
                        : "hover:text-slate-100"
                      : pathname?.startsWith(homeUrl)
                      ? "text-sky-300"
                      : "hover:text-slate-100"
                  }
                >
                  Home
                </Link>
              )}
              {user && (
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
              )}
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

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
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

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="fixed inset-x-0 top-16 z-30 md:hidden">
            <div className="mx-auto max-w-[1280px] px-4">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/95 backdrop-blur shadow-xl overflow-hidden">
                {/* Mobile Nav Links */}
                <nav className="flex flex-col py-2">
                  {isHomeExternal ? (
                    <a
                      href={homeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium transition-colors text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 flex items-center gap-2 group"
                      title={`External link: ${homeUrl}`}
                    >
                      <span>Home</span>
                      <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={homeUrl}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-sm font-medium transition-colors ${
                        homeUrl === "/"
                          ? pathname === "/"
                            ? "text-sky-300 bg-sky-500/10 border-l-2 border-sky-500"
                            : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
                          : pathname?.startsWith(homeUrl)
                          ? "text-sky-300 bg-sky-500/10 border-l-2 border-sky-500"
                          : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
                      }`}
                    >
                      Home
                    </Link>
                  )}
                  {user && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-sm font-medium transition-colors ${
                        pathname?.startsWith("/dashboard")
                          ? "text-sky-300 bg-sky-500/10 border-l-2 border-sky-500"
                          : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
                      }`}
                    >
                      Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 text-sm font-medium transition-colors ${
                        pathname?.startsWith("/admin")
                          ? "text-sky-300 bg-sky-500/10 border-l-2 border-sky-500"
                          : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </nav>

                {/* Mobile Auth Section */}
                <div className="border-t border-slate-800/70 px-4 py-3">
                  {!user ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2.5 text-sm font-medium text-slate-300 hover:text-slate-100 rounded-lg hover:bg-slate-800/50 transition-colors"
                      >
                        Login
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full h-10 rounded-lg bg-sky-500 hover:bg-sky-400 text-sm font-semibold text-slate-950">
                          Register
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-900/50">
                        <Avatar className="h-10 w-10 border border-slate-700 shadow-[0_0_12px_rgba(56,189,248,0.45)]">
                          <AvatarImage src="" alt={user.firstName || user.email} />
                          <AvatarFallback className="text-sm font-semibold text-sky-300 bg-slate-900">
                            {(user.firstName?.[0] ||
                              user.email?.[0] ||
                              "U"
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-50 truncate">
                            {user.firstName && user.firstName.trim().length > 0
                              ? `${user.firstName}${user.lastName && user.lastName.trim().length > 0 ? ` ${user.lastName}` : ""}`
                              : user.email?.split("@")[0] || "User"}
                          </p>
                          <span
                            className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wide ${
                              user.role === "ADMIN"
                                ? "bg-amber-500/10 text-amber-300 border border-amber-500/50"
                                : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/50"
                            }`}
                          >
                            {user.role || "USER"}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Menu Actions */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            router.push("/account");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 rounded-lg transition-colors"
                        >
                          Account
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

