"use client";

import { useEffect, useState } from "react";
import { AdminTabProps, ContactMessage, apiUrl } from "./shared";

export function MessagesTab({ token, onUnauthorized, onStatus }: AdminTabProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const response = await fetch(`${apiUrl}/contact-messages/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) {
          if (response.status === 401) {
            onUnauthorized();
          }
          return;
        }
        setMessages((await response.json()) as ContactMessage[]);
        onStatus("Messages loaded.");
      } catch {
        onStatus("Could not load messages.");
      }
    })();
  }, [token, onUnauthorized, onStatus]);

  return (
    <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-6 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
      <h2 className="mb-5 text-xl font-extrabold text-white">Contact Messages ({messages.length})</h2>
      {messages.length === 0 ? (
        <p className="text-sm text-white/50">No messages yet.</p>
      ) : (
        <div className="grid gap-3">
          {messages.map((message) => (
            <div key={message._id} className="rounded-xl border border-[#E19508]/10 bg-[#001233]/50 p-4 transition-all duration-300 hover:border-[#E19508]/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{message.name}</p>
                  <p className="text-xs text-white/50">{message.email} — {new Date(message.createdAt).toLocaleDateString()}</p>
                  {message.subject && <p className="mt-1 text-xs font-semibold text-[#E19508]">{message.subject}</p>}
                </div>
                <button type="button" onClick={() => setExpanded(expanded === message._id ? null : message._id)} className="rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-[#E19508]/30 hover:text-[#E19508]">
                  {expanded === message._id ? "Collapse" : "Read"}
                </button>
              </div>
              {expanded === message._id && <p className="mt-3 rounded-lg bg-[#001233]/60 border border-[#E19508]/8 px-4 py-3 text-sm leading-7 text-white/80">{message.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}