"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";
import { getApiBaseUrl } from "@/lib/api-base-url";

const apiUrl = getApiBaseUrl();

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Sign in to access the admin dashboard.");
  const [loading, setLoading] = useState(false);

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setMessage("Login failed. Please check credentials.");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as { accessToken: string };
      localStorage.setItem("admin_access_token", data.accessToken);
      document.cookie = "admin_session=active; path=/; max-age=28800; samesite=lax";
      router.push("/admin/dashboard");
      router.refresh();
      return;
    } catch {
      setMessage("Unable to connect. Ensure backend is running.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#001946] text-white antialiased relative flex items-center overflow-hidden">
      {/* ATMOSPHERIC GLOWS */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#980140]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E19508]/5 blur-[150px] pointer-events-none z-0" />

      <main className="relative z-10 mx-auto flex min-h-[84vh] w-full max-w-6xl flex-1 items-center px-4 py-12 sm:px-6">
        <section className="grid w-full gap-8 overflow-hidden rounded-3xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-6 sm:p-9 shadow-[0_24px_60px_-24px_rgba(0,25,70,0.4)] lg:grid-cols-2 lg:p-12">
          <div className="flex flex-col justify-center">
            <SiteLogo />
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#E19508]">Admin Access</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white">Manage Content With Precision</h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Sign in to create, edit, unpublish, and delete posts with rich content formatting and image uploads.
            </p>
            <div className="mt-7 grid gap-2 text-sm text-white/60">
              <p>• Fast publishing workflow for devotionals and announcements</p>
              <p>• Centralized management for verses, testimonies, and competitions</p>
              <p>• Secure access to administrative tools</p>
            </div>
            <Link href="/" className="mt-6 inline-block text-sm font-bold text-[#E19508] transition-colors hover:text-[#f0a820]">
              Back to Website
            </Link>
          </div>

          <form onSubmit={onLogin} className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/80 backdrop-blur-sm p-6 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
            <h2 className="text-2xl font-bold text-white">Login</h2>
            <p className="mt-2 text-sm text-[#E19508]/80">{message}</p>

            <div className="mt-5 grid gap-3">
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-[#E19508]/15 bg-[#001233]/80 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E19508]/60 focus:ring-2 focus:ring-[#E19508]/15 placeholder:text-white/40"
                placeholder="Username"
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#E19508]/15 bg-[#001233]/80 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E19508]/60 focus:ring-2 focus:ring-[#E19508]/15 placeholder:text-white/40"
                placeholder="Password"
                type="password"
              />
              <button
                className="rounded-full bg-[#980140] px-5 py-2.5 font-bold text-white transition-all duration-300 hover:bg-[#7c0134] hover:shadow-[0_6px_20px_-8px_rgba(152,1,64,0.5)] disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Access Dashboard"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}