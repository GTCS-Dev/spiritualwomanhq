"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

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
    title: "Faith. Purpose. Community.",
    subtitle: "SpiritualWoman Fellowship",
    description:
      "A welcoming place for women to grow spiritually, build healthy relationships, and serve with confidence.",
    image: "/images/hero-slide-1.jpg",
  },
  {
    id: 2,
    title: "Worship And Prayer Moments",
    subtitle: "Weekly Gatherings",
    description:
      "Join Bible study, worship devotion, and consistent prayer sessions that strengthen daily faith routines.",
    image: "/images/hero-slide-2.jpg",
  },
  {
    id: 3,
    title: "Stories That Inspire Growth",
    subtitle: "Life Transformation",
    description:
      "Discover testimonies, practical teachings, and mentorship pathways that encourage purposeful living in Christ.",
    image: "/images/hero-slide-3.jpg",
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
    <section className="hero-pattern relative -mx-2 mt-8 overflow-hidden rounded-3xl border border-white/70 p-3 sm:mx-0 sm:p-5 lg:-mx-3">
      <div className="absolute -right-18 -top-20 h-52 w-52 rounded-full bg-(--rose)/12 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-(--stone)/15 blur-3xl" />

      <div className="relative z-10 grid items-stretch gap-5 overflow-hidden rounded-2xl bg-white/74 p-4 sm:p-6 lg:grid-cols-[1fr_1.06fr] lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="order-2 flex h-full flex-col justify-center lg:order-1"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-(--rose) sm:text-sm">{activeSlide.subtitle}</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-(--ink) sm:text-[2.7rem] lg:text-[3.15rem]">{activeSlide.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-(--stone) sm:text-base sm:leading-8">{activeSlide.description}</p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-7 sm:gap-4">
              <a
                href="#fellowship"
                className="rounded-full bg-(--rose) px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-(--rose-dark)"
              >
                Join Fellowship
              </a>
              <a
                href="#blog"
                className="rounded-full border border-(--stone)/40 bg-white px-5 py-3 text-sm font-semibold text-(--ink) hover:border-(--rose)"
              >
                Read Latest
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${activeSlide.id}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.45 }}
            className="order-1 h-full overflow-hidden rounded-2xl border border-white/70 lg:order-2"
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              width={900}
              height={620}
              loading="eager"
              className="h-74 w-full object-cover sm:h-94 lg:h-full lg:min-h-124"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="order-3 flex items-center justify-between pt-1 lg:col-span-2">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-10 bg-(--rose)" : "w-3 bg-(--stone)/30"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="rounded-full border border-(--ash) bg-white p-2 text-(--ink) hover:border-(--rose)"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="rounded-full border border-(--ash) bg-white p-2 text-(--ink) hover:border-(--rose)"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
