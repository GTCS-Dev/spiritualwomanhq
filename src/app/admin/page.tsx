"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").trim();
const normalizedApiUrl = /^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `https://${rawApiUrl}`;
const apiUrl = normalizedApiUrl.replace(/\/+$/, "");

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
    <main className="mx-auto flex min-h-[84vh] w-full max-w-6xl flex-1 items-center px-4 py-12 sm:px-6">
      <section className="grid w-full gap-8 overflow-hidden rounded-3xl border border-(--ash) bg-(--container) p-6 sm:p-9 lg:grid-cols-2 lg:p-12">
        <div className="flex flex-col justify-center">
          <SiteLogo />
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-(--rose)">Admin Access</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight text-(--ink)">Manage Content With Precision</h1>
          <p className="mt-4 text-sm leading-7 text-(--stone)">
            Sign in to create, edit, unpublish, and delete posts with rich content formatting and image uploads.
          </p>
          <div className="mt-7 grid gap-2 text-sm text-(--stone)">
            <p>• Fast publishing workflow for devotionals and announcements</p>
            <p>• Centralized management for verses, testimonies, and competitions</p>
            <p>• Secure access to administrative tools</p>
          </div>
          <Link href="/" className="mt-6 inline-block text-sm font-bold text-(--rose)">
            Back to Website
          </Link>
        </div>

        <form onSubmit={onLogin} className="rounded-2xl border border-(--ash) bg-white p-6 shadow-[0_16px_34px_-24px_rgba(31,24,34,0.4)]">
          <h2 className="text-2xl font-bold text-(--ink)">Login</h2>
          <p className="mt-2 text-sm text-(--stone)">{message}</p>

          <div className="mt-5 grid gap-3">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-lg border border-(--ash) px-3 py-2 outline-none focus:border-(--rose)"
              placeholder="Username"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-(--ash) px-3 py-2 outline-none focus:border-(--rose)"
              placeholder="Password"
              type="password"
            />
            <button
              className="rounded-full bg-(--rose) px-5 py-2 font-bold text-white transition-colors hover:bg-(--rose-dark) disabled:opacity-70"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Access Dashboard"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
