"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, MessageSquare, Quote } from "lucide-react";
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

const MessagesTab = dynamic(
  () => import("./_components/messages-tab").then((m) => m.MessagesTab),
  { loading: () => <DashboardPanelFallback label="Loading messages..." /> }
);

function DashboardPanelFallback({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-(--ash) bg-white p-6 text-sm text-(--stone)">
      {label}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("blog");
  const [status, setStatus] = useState("Dashboard ready.");

  // ✅ FIX: stable tabs config
  const tabs = useMemo(
    () => [
      { id: "blog" as Tab, label: "Blog", icon: FileText },
      { id: "verse" as Tab, label: "Verse of Week", icon: BookOpen },
      { id: "testimonials" as Tab, label: "Testimonials", icon: Quote },
      { id: "messages" as Tab, label: "Messages", icon: MessageSquare },
    ],
    []
  );

  // ✅ FIX: no unnecessary dependency on router object
  useEffect(() => {
    const stored = localStorage.getItem("admin_access_token");

    if (!stored) {
      router.replace("/admin");
      return;
    }

    setToken(stored);
    setIsReady(true);
  }, []);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("admin_access_token");
    document.cookie = "admin_session=; path=/; max-age=0; samesite=lax";
    router.replace("/admin");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_access_token");
    document.cookie = "admin_session=; path=/; max-age=0; samesite=lax";
    router.push("/admin");
  }, [router]);

  if (!isReady) {
    return (
      <main className="p-10 text-sm text-(--stone)">
        Loading dashboard…
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-(--background) text-(--ink)">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-(--ash) bg-(--background)/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-6">
          <div className="flex items-center gap-3">
            <SiteLogo compact />
            <span className="hidden text-xs font-bold uppercase tracking-[0.22em] text-(--rose) sm:block">
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
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all sm:px-4 sm:text-sm ${
                  activeTab === id
                    ? "bg-(--rose) text-white shadow-sm"
                    : "border border-transparent text-(--stone) hover:border-(--rose)/30 hover:bg-(--blush) hover:text-(--rose)"
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
              className="rounded-full border border-(--ash) bg-white px-3 py-1.5 text-xs font-semibold hover:text-(--rose)"
            >
              View Site
            </Link>

            <button
              onClick={logout}
              className="rounded-full bg-(--rose) px-3 py-1.5 text-xs font-semibold text-white hover:bg-(--rose-dark)"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* STATUS */}
      <div className="border-b border-(--ash) bg-(--blush) px-4 py-2 text-center text-xs font-semibold text-(--rose)">
        {status}
      </div>

      {/* MAIN CONTENT */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">

        {/* ✅ FIX: KEEP ALL TABS MOUNTED (prevents memory leaks from remounting) */}
        <div style={{ display: activeTab === "blog" ? "block" : "none" }}>
          <BlogTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        </div>

        <div style={{ display: activeTab === "verse" ? "block" : "none" }}>
          <VerseTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        </div>

        <div style={{ display: activeTab === "testimonials" ? "block" : "none" }}>
          <TestimonialsTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        </div>

        <div style={{ display: activeTab === "messages" ? "block" : "none" }}>
          <MessagesTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        </div>

      </main>
    </div>
  );
}