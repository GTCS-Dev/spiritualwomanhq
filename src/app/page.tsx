"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { HeroSlider } from "@/components/hero-slider";
import { SiteFooter } from "@/components/site-footer";

type DisplayVerse = {
  text: string;
  reference: string;
  period: string;
};

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role: string;
};

const fallbackVerse = {
  text: "She is clothed with strength and dignity, and she laughs without fear of the future.",
  reference: "Proverbs 31:25",
  period: "week",
};

const bibleVersesForGrowth = [
  { text: "But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him be glory both now and forever! Amen.", reference: "2 Peter 3:18" },
  { text: "So then, just as you received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.", reference: "Colossians 2:6-7" },
  { text: "Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it. Then you will be prosperous and successful.", reference: "Joshua 1:8" },
];

const bibleVersesForWomen = [
  { text: "She is clothed with strength and dignity; she can laugh at the days to come.", reference: "Proverbs 31:25" },
  { text: "Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.", reference: "Proverbs 31:30" },
  { text: "Blessed is she who has believed that the Lord would fulfill his promises to her!", reference: "Luke 1:45" },
];

function FlourishRule({ color = "#E19508", className = "" }: { color?: string; className?: string }) {
  return (
    <svg width="48" height="12" viewBox="0 0 48 12" fill="none" className={className} aria-hidden="true">
      <line x1="0" y1="6" x2="18" y2="6" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      <rect x="22" y="2" width="8" height="8" transform="rotate(45 24 6)" fill="none" stroke={color} strokeWidth="1.2" />
      <line x1="30" y1="6" x2="48" y2="6" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );
}

export default function Home() {
  const [verses, setVerses] = useState<DisplayVerse[]>([fallbackVerse]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setVerses([fallbackVerse]);
  }, []);

  return (
    <div className="min-h-screen bg-[#001946] text-white antialiased selection:bg-[#980140]/40 selection:text-white relative" id="home">
      
      {/* ── ATMOSPHERIC BRAND GLOWS ── */}
      <div className="absolute top-[15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#980140]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[45%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E19508]/5 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#980140]/8 blur-[100px] pointer-events-none z-0" />

      <SiteHeader />

      <main className="w-full overflow-x-hidden relative z-10">
        <HeroSlider />

        {/* ── CALENDAR SYNC SCHEDULE PANEL ── */}
        <section id="fellowship" className="py-16 border-b border-white/[0.06] relative">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none mix-blend-screen hidden lg:block">
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="199" stroke="#E19508" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="150" stroke="#E19508" strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#E19508]">
                  <FlourishRule color="#E19508" /> Meeting Times
                </span>
                <h2 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
                  Join Us In Prayer & Study
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-md">
                  Dedicate time each day to seek God’s presence through prayer, worship, Bible study, and spiritual encouragement. Strengthen your faith and grow deeper in your walk with Christ.
                </p>
                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-[#980140] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#980140]/25 hover:bg-[#7c0134] transition-all hover:scale-[1.02] group"
                  >
                    Join a group <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { day: "Monday – Friday", time: "12:00 PM (WAT)", label: "Prayer Sync Pipeline", highlighted: false },
                  { day: "Monday – Friday", time: "10:00 PM (WAT)", label: "Daily Intercession & Word Study", highlighted: true },
                  { day: "Saturday", time: "6:00 AM (WAT)", label: "Weekend Devotional Charge", highlighted: false },
                ].map((item) => (
                  <div 
                    key={item.label} 
                    className={`group flex items-center justify-between gap-4 p-5 rounded-xl transition-all duration-300 shadow-sm relative overflow-hidden ${
                      item.highlighted 
                        ? "bg-gradient-to-br from-[#980140] via-[#A2014A] to-[#001233] text-white border-2 border-[#E19508]/40 shadow-[0_12px_30px_-10px_rgba(152,1,64,0.45)]" 
                        : "bg-[#001233]/60 backdrop-blur-sm border border-white/[0.08] hover:border-[#E19508]/50 hover:bg-[#001233]/90"
                    }`}
                  >
                    {item.highlighted && (
                      <>
                        <div className="pointer-events-none absolute -left-6 -top-6 h-14 w-14 rounded-full border border-[#E19508]/20" />
                        <div className="pointer-events-none absolute -right-6 -bottom-6 h-14 w-14 rounded-full border border-[#E19508]/15" />
                      </>
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <CalendarDays size={16} className="text-[#E19508] shrink-0" />
                      <div>
                        <p className="text-sm font-bold tracking-tight text-white">{item.label}</p>
                        <p className={`mt-0.5 text-xs font-mono ${item.highlighted ? "text-white/70" : "text-white/50"}`}>{item.day}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold whitespace-nowrap px-2.5 py-1 rounded-md relative z-10 ${
                      item.highlighted ? "bg-white/15 text-[#E19508]" : "bg-[#E19508]/10 text-[#E19508]"
                    }`}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DOUBLE MATRIX SCRIPTURAL STREAMS ── */}
        <section className="py-16 bg-[#001233]/40 backdrop-blur-sm border-b border-white/[0.06] relative">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#E19508] mb-6 flex items-center gap-3">
                  <FlourishRule color="#E19508" /> Spiritual Growth Stream
                </h3>
                <div className="space-y-4">
                  {bibleVersesForGrowth.map((v) => (
                    <div key={v.reference} className="p-6 rounded-xl bg-[#001233]/90 border-l-4 border-[#980140] shadow-md border-y border-r border-white/[0.04] hover:border-white/10 transition-colors">
                      <p className="font-serif text-sm italic text-white/90 leading-relaxed">&ldquo;{v.text}&rdquo;</p>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#E19508]/80">{v.reference}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#E19508] mb-6 flex items-center gap-3">
                  <FlourishRule color="#E19508" /> Identity & Strength Stream
                </h3>
                <div className="space-y-4">
                  {bibleVersesForWomen.map((v) => (
                    <div key={v.reference} className="p-6 rounded-xl bg-[#001233]/90 border-l-4 border-[#E19508] shadow-md border-y border-r border-white/[0.04] hover:border-white/10 transition-colors">
                      <p className="font-serif text-sm italic text-white/90 leading-relaxed">&ldquo;{v.text}&rdquo;</p>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#E19508]/80">{v.reference}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL GRID STAGE ── */}
        {testimonials.length > 0 && (
          <section className="py-16 relative z-10 border-b border-white/[0.04]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center mb-10">
                <FlourishRule color="#E19508" />
                <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-white text-center">Words From The Sisterhood</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {testimonials.map((t) => (
                  <div key={t._id} className="rounded-xl border border-white/[0.08] p-6 bg-[#001233]/80 backdrop-blur-sm flex flex-col justify-between hover:shadow-xl hover:shadow-black/30 transition-shadow duration-300">
                    <div>
                      <span className="text-[#E19508] text-lg font-serif">“</span>
                      <p className="font-serif text-sm italic text-white/80 leading-relaxed inline">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#980140] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{t.name}</p>
                        <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── HIGH VISIBILITY CTA CONTAINER BAND ── */}
        <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 pt-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#980140] via-[#A2014A] to-[#001233] px-8 py-12 sm:px-16 sm:py-14 shadow-2xl shadow-black/40 border border-[#E19508]/20"
          >
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border-2 border-[#E19508]/15 opacity-60" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full border-2 border-[#E19508]/10 opacity-40" />
            
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#E19508]">
                <FlourishRule color="#E19508" /> Welcome Home
              </span>
              <h2 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
                Authentic Sisterhood Awaits
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/85">
                Step into alignment. Engage with highly intentional, deep strategic pathways of prayer, worship, and vibrant word fellowship.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#980140] font-semibold shadow-xl hover:bg-white/90 transition-all duration-200 hover:scale-[1.02]"
                >
                  Join the Fellowship
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <div className="bg-[#001233] border-t border-white/10 relative z-20">
        <SiteFooter />
      </div>
    </div>
  );
}