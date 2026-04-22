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
    <div className="rounded-2xl border border-(--ash) bg-white p-6">
      <h2 className="mb-5 text-xl font-extrabold text-(--ink)">Contact Messages ({messages.length})</h2>
      {messages.length === 0 ? (
        <p className="text-sm text-(--stone)">No messages yet.</p>
      ) : (
        <div className="grid gap-3">
          {messages.map((message) => (
            <div key={message._id} className="rounded-xl border border-(--ash) p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-(--ink)">{message.name}</p>
                  <p className="text-xs text-(--stone)">{message.email} — {new Date(message.createdAt).toLocaleDateString()}</p>
                  {message.subject && <p className="mt-1 text-xs font-semibold text-(--rose)">{message.subject}</p>}
                </div>
                <button type="button" onClick={() => setExpanded(expanded === message._id ? null : message._id)} className="rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:text-(--rose)">
                  {expanded === message._id ? "Collapse" : "Read"}
                </button>
              </div>
              {expanded === message._id && <p className="mt-3 rounded-lg bg-(--blush) px-4 py-3 text-sm leading-7 text-(--stone)">{message.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
