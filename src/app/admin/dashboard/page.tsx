"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, MessageSquare, Quote, Trophy } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import type { Tab } from "./_components/shared";

const BlogTab = dynamic(
  () => import("./_components/blog-tab").then((m) => m.BlogTab),
  { loading: () => <DashboardPanelFallback label="Loading blog tools..." /> }
);

const VerseTab = dynamic(
  () => import("./_components/verse-tab").then((m) => m.VerseTab),
  { loading: () => <DashboardPanelFallback label="Loading verses..." /> }
);

const TestimonialsTab = dynamic(
  () => import("./_components/testimonials-tab").then((m) => m.TestimonialsTab),
  { loading: () => <DashboardPanelFallback label="Loading testimonials..." /> }
);

const CompetitionsTab = dynamic(
  () => import("./_components/competitions-tab").then((m) => m.CompetitionsTab),
  { loading: () => <DashboardPanelFallback label="Loading competitions..." /> }
);

const MessagesTab = dynamic(
  () => import("./_components/messages-tab").then((m) => m.MessagesTab),
  { loading: () => <DashboardPanelFallback label="Loading messages..." /> }
);

function DashboardPanelFallback({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 p-6 text-sm text-white/70">
      {label}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("admin_access_token") ?? "";
  });
  const [activeTab, setActiveTab] = useState<Tab>("blog");
  const [status, setStatus] = useState("Dashboard ready.");

  // ✅ FIX: stable tabs config
  const tabs = useMemo(
    () => [
      { id: "blog" as Tab, label: "Blog", icon: FileText },
      { id: "verse" as Tab, label: "Verse of Week", icon: BookOpen },
      { id: "testimonials" as Tab, label: "Testimonials", icon: Quote },
      { id: "competitions" as Tab, label: "Competitions", icon: Trophy },
      { id: "messages" as Tab, label: "Messages", icon: MessageSquare },
    ],
    []
  );

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
    }
  }, [router, token]);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("admin_access_token");
    document.cookie = "admin_session=; path=/; max-age=0; samesite=lax";
    setToken("");
    router.replace("/admin");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_access_token");
    document.cookie = "admin_session=; path=/; max-age=0; samesite=lax";
    setToken("");
    router.push("/admin");
  }, [router]);

  if (!token) {
    return (
      <main className="p-10 text-sm text-white/70">
        Loading dashboard…
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#001946] text-white antialiased relative">
      {/* ATMOSPHERIC GLOWS */}
      <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#980140]/8 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E19508]/5 blur-[150px] pointer-events-none z-0" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#E19508]/12 bg-[#001233]/90 backdrop-blur-md shadow-sm relative z-50">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-6">
          <div className="flex items-center gap-3">
            <SiteLogo compact />
            <span className="hidden text-xs font-bold uppercase tracking-[0.22em] text-[#E19508] sm:block">
              Admin
            </span>
          </div>

          {/* TABS */}
          <nav className="order-3 flex w-full items-center justify-center gap-1 sm:order-2 sm:w-auto sm:justify-start">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 sm:px-4 sm:text-sm ${
                  activeTab === id
                    ? "bg-[#980140] text-white shadow-[0_4px_14px_-6px_rgba(152,1,64,0.5)]"
                    : "border border-[#E19508]/10 text-white/70 hover:border-[#E19508]/30 hover:bg-[#E19508]/8 hover:text-[#E19508]"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>

          <div className="order-2 flex items-center gap-2 sm:order-3">
            <Link
              href="/"
              className="rounded-full border border-[#E19508]/20 bg-[#001233]/60 px-3 py-1.5 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-[#E19508]/40 hover:text-[#E19508]"
            >
              View Site
            </Link>

            <button
              onClick={logout}
              className="rounded-full bg-[#980140] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#7c0134] hover:shadow-[0_4px_14px_-6px_rgba(152,1,64,0.5)]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* STATUS */}
      <div className="relative z-10 border-b border-[#E19508]/8 bg-[#980140]/10 px-4 py-2 text-center text-xs font-semibold text-[#E19508]">
        {status}
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === "blog" && (
          <BlogTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}

        {activeTab === "verse" && (
          <VerseTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}

        {activeTab === "testimonials" && (
          <TestimonialsTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}

        {activeTab === "competitions" && (
          <CompetitionsTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}

        {activeTab === "messages" && (
          <MessagesTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}
      </main>
    </div>
  );
}