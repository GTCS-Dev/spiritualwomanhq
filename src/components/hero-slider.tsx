"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { heroImages } from "@/lib/site-images";

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Live Worship And On-Demand Messages",
    subtitle: "Watch",
    description:
      "Join every service online and revisit past teachings any time for practical encouragement and spiritual growth.",
    image: heroImages[0],
  },
  {
    id: 2,
    title: "Plan Your Visit Before You Arrive",
    subtitle: "Visit",
    description:
      "See service times, meeting details, and fellowship information so your first visit feels easy and welcoming.",
    image: heroImages[1],
  },
  {
    id: 3,
    title: "Join Fellowship And Grow In Faith",
    subtitle: "Connect",
    description:
      "Become part of a caring sisterhood through prayer circles, mentorship, and community-centered discipleship.",
    image: heroImages[2],
  },
];

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  function goPrev() {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }

  return (
    <section className="relative left-1/2 -mt-px w-screen -translate-x-1/2 overflow-hidden border-b border-(--ash)">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0.35, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.25, scale: 1.03 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <Image
            src={activeSlide.image}
            alt={activeSlide.title}
            width={2200}
            height={980}
            loading="eager"
            className="h-[82vh] min-h-[580px] w-full object-cover object-center"
            priority
          />

          <div className="absolute inset-0 bg-linear-to-r from-[#221126]/70 via-[#351c37]/34 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/15 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl px-1 text-white sm:px-0"
            >
              <p className="text-xs font-bold uppercase tracking-[0.31em] text-[#ffbfd1] sm:text-sm">{activeSlide.subtitle}</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)] sm:text-[3.25rem] lg:text-[3.85rem]">{activeSlide.title}</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/92 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-base sm:leading-8">{activeSlide.description}</p>

              <div className="mt-6 flex flex-wrap gap-3 sm:mt-7 sm:gap-4">
                <a
                  href="#fellowship"
                  className="rounded-full bg-(--rose) px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-16px_rgba(0,0,0,0.7)] transition-colors hover:bg-(--rose-dark)"
                >
                  Join Fellowship
                </a>
                <a
                  href="#blog"
                  className="rounded-full bg-white/16 px-5 py-3 text-sm font-semibold text-white hover:bg-white/26"
                >
                  Read Latest
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-4 z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-12 bg-[#ffbfd1]" : "w-3 bg-white/55"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="rounded-full border border-white/35 bg-black/20 p-2 text-white hover:border-[#ffbfd1]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="rounded-full border border-white/35 bg-black/20 p-2 text-white hover:border-[#ffbfd1]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
