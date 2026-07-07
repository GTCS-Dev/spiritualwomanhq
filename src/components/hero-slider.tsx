"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";

const features = [
  { icon: Heart, title: "Prayer", desc: "Daily intercession and spiritual covering for every sister." },
  { icon: Heart, title: "Mentorship", desc: "Biblical guidance from mature women of faith." },
  { icon: Heart, title: "Community", desc: "A loving sisterhood walking together in purpose." },
  { icon: Heart, title: "Discipleship", desc: "Deepen your walk through structured spiritual growth." },
];

export function HeroSlider() {
  return (
    <>
      {/* ─── HERO ─── full bleed */}
      <section className="relative left-1/2 -mt-px w-screen -translate-x-1/2 overflow-hidden border-b border-[#E19508]/15">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#001946] via-[#05193B] to-[#001946] shadow-2xl">
          {/* Brand color ambient glows */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#E19508]/15 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#980140]/20 blur-[120px]" />
          <div className="pointer-events-none absolute left-[40%] top-[30%] h-64 w-64 rounded-full bg-[#A2014A]/10 blur-[90px]" />

          {/* Decorative gold circles */}
          <div className="pointer-events-none absolute left-[20%] top-[-8%] h-[420px] w-[420px] rounded-full border-2 border-[#E19508]/20" />
          <div className="pointer-events-none absolute right-[10%] top-[15%] h-[280px] w-[280px] rounded-full border-2 border-[#E19508]/15" />
          <div className="pointer-events-none absolute bottom-[5%] left-[50%] h-[180px] w-[180px] rounded-full border-2 border-[#E19508]/12" />

          <div className="relative z-10 mx-auto grid min-h-[720px] w-full max-w-7xl grid-cols-1 lg:min-h-[780px] lg:grid-cols-[1fr_1fr]">
            {/* ─── LEFT CONTENT ─── */}
            <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-20">
              {/* Eyebrow with gold */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="h-px w-10 bg-[#E19508]" />
                <span className="font-[family-name:var(--font-body)] text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#E19508]">
                  CONNECT • GROW • IMPACT
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="mt-6 max-w-[540px]"
              >
                <span className="font-[family-name:var(--font-heading)] text-[clamp(2.8rem,7vw,5rem)] font-bold leading-[1.02] tracking-[-0.02em] text-white">
                  Join fellowship<br />
                </span>
                <span className="relative">
                  <span className="font-[family-name:var(--font-heading)] text-[clamp(2.8rem,7vw,5rem)] font-bold leading-[1.02] tracking-[-0.02em] text-white">
                    and grow{" "}
                  </span>
                  <span className="bg-gradient-to-r from-[#E19508] via-[#980140] to-[#A2014A] bg-clip-text font-[family-name:var(--font-script)] text-[clamp(3rem,8vw,5.8rem)] italic leading-[0.9] tracking-normal text-transparent">
                    in faith
                  </span>
                </span>
              </motion.h1>

              {/* Gold divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-6 h-px w-16 origin-left bg-[#E19508]" 
              />

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.4 }}
                className="mt-6 max-w-[520px] text-base leading-7 text-white/80 sm:text-[0.95rem] sm:leading-8"
              >
                Become part of a caring sisterhood through prayer circles, mentorship, and community-centered discipleship.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.5 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#fellowship"
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#980140] via-[#A2014A] to-[#E19508] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(152,1,64,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(152,1,64,0.7)]"
                >
                  <Heart size={16} className="text-white/90" />
                  Join Fellowship
                </a>
                <a
                  href="#blog"
                  className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#E19508]/60 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#E19508] hover:shadow-[0_0_24px_-6px_rgba(225,149,8,0.4)]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#E19508]/70">
                    <Play size={10} className="text-[#E19508] fill-[#E19508]" />
                  </span>
                  Watch Messages
                </a>
              </motion.div>
            </div>

            {/* ─── RIGHT — PNG on navy ─── */}
            <div className="relative flex min-h-[400px] lg:min-h-full">
              <div className="relative h-full w-full">
                <Image
                  src="/heroslider.png"
                  alt="Fellowship"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Subtle navy fade left edge */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#001946]/60 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#001946]/40 to-transparent" />

              {/* Colorful Symmetrical Circle Badge Structure */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute bottom-6 right-6 z-20 flex h-36 w-36 aspect-square flex-col items-center justify-center gap-1.5 rounded-full border-2 border-[#E19508] bg-gradient-to-br from-[#001946] via-[#980140] to-[#E19508] p-4 text-center shadow-[0_16px_36px_rgba(152,1,64,0.4)] backdrop-blur-md"
              >
                <Heart size={18} className="text-[#E19508] fill-[#E19508]/20" />
                <div className="leading-tight">
                  <p className="font-[family-name:var(--font-heading)] text-[0.8rem] font-bold tracking-wide text-white">
                    Sisterhood
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-[0.8rem] font-bold tracking-wide text-[#E19508]">
                    Faith
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-[0.8rem] font-bold tracking-wide text-white/90">
                    Purpose
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE HIGHLIGHTS ─── */}
      <section className="mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="rounded-[28px] border border-white bg-white px-6 py-8 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] sm:px-10 sm:py-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, i) => (
              <div key={feat.title} className="relative flex flex-col items-center text-center">
                {i > 0 && (
                  <div className="absolute -left-3 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent lg:block" />
                )}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E19508]/10">
                  <feat.icon size={22} className="text-[#E19508] fill-[#E19508]/10" />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-bold text-[#001233]">
                  {feat.title}
                </h3>
                <p className="mt-2 max-w-[220px] text-xs leading-6 text-slate-600">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSPIRATIONAL QUOTE BANNER ─── */}
      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] bg-gradient-to-br from-[#001946] via-[#05193B] to-[#001946] shadow-[0_32px_80px_-40px_rgba(0,25,70,0.6)]">
          {/* Top gold accent line */}
          <div className="absolute top-0 left-12 right-12 h-[3px] bg-gradient-to-r from-transparent via-[#E19508]/60 to-transparent" />
          
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#980140]/20 blur-[130px]" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-[#E19508]/8 blur-[100px]" />

          {/* Decorative gold ring */}
          <div className="pointer-events-none absolute left-[50%] top-[50%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E19508]/8" />

          {/* Gold botanical corner */}
          <svg
            className="pointer-events-none absolute bottom-6 right-8 h-24 w-24 text-[#E19508]/15 sm:h-32 sm:w-32"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M15 85 Q 35 65, 50 50 Q 65 35, 85 15" />
            <path d="M35 90 Q 55 70, 70 50 Q 82 30, 92 18" />
            <path d="M55 88 Q 68 72, 80 55" />
            <circle cx="85" cy="15" r="3.5" />
          </svg>

          <div className="relative z-10 mx-auto max-w-4xl px-8 py-14 sm:px-14 sm:py-18 lg:px-20 lg:py-20">
            <div className="text-center">
              {/* Gold quote mark */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E19508]/10 border border-[#E19508]/20">
                <svg
                  className="h-7 w-7 text-[#E19508]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10.11 17.42c.14.39.08.82-.12 1.17-.2.35-.53.6-.92.68-.8.16-1.59.11-2.35-.12-1.63-.5-2.85-1.75-3.56-3.27-.66-1.42-.86-3.03-.46-4.57.31-1.21.98-2.29 1.92-3.1.89-.77 1.97-1.2 3.11-1.26.4-.02.78.15.99.48.21.33.24.76.08 1.12-.29.66-.64 1.29-1.05 1.87-.03.04-.05.08-.08.12-.5.66-.86 1.39-1.09 2.17.06-.01.12-.01.18-.01 1.41 0 2.7.69 3.57 1.71.6.71.94 1.59.98 2.53.01.4-.06.8-.2 1.16Zm8.89 0c.14.39.08.82-.12 1.17-.2.35-.53.6-.92.68-.8.16-1.59.11-2.35-.12-1.63-.5-2.85-1.75-3.56-3.27-.66-1.42-.86-3.03-.46-4.57.31-1.21.98-2.29 1.92-3.1.89-.77 1.97-1.2 3.11-1.26.4-.02.78.15.99.48.21.33.24.76.08 1.12-.29.66-.64 1.29-1.05 1.87-.03.04-.05.08-.08.12-.5.66-.86 1.39-1.09 2.17.06-.01.12-.01.18-.01 1.41 0 2.7.69 3.57 1.71.6.71.94 1.59.98 2.53.01.4-.06.8-.2 1.16Z" />
                </svg>
              </div>

              {/* Quote text */}
              <div className="mt-6">
                <p className="font-[family-name:var(--font-heading)] text-2xl font-medium italic leading-relaxed text-white/92 sm:text-3xl sm:leading-[1.55] lg:text-[2rem] lg:leading-[1.6]">
                  <span className="relative">
                    <span className="text-[#E19508]/40 text-4xl sm:text-5xl absolute -left-6 -top-4">&ldquo;</span>
                    Together, we uplift, inspire, and walk in faith&mdash;empowered by God, united in purpose.
                    <span className="text-[#E19508]/40 text-4xl sm:text-5xl absolute -right-4 -bottom-8">&rdquo;</span>
                  </span>
                </p>
              </div>

              {/* Gold divider */}
              <div className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-[#E19508]/60 to-transparent" />
              
              {/* Attribution */}
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#E19508]/70">
                Spiritual Woman Fellowship
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}