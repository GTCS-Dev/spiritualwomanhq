"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function TopLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    function startLoading() {
      setVisible(true);
      setProgress(18);

      const frame1 = window.setTimeout(() => setProgress(52), 80);
      const frame2 = window.setTimeout(() => setProgress(76), 240);

      return () => {
        window.clearTimeout(frame1);
        window.clearTimeout(frame2);
      };
    }

    function clickHandler(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      if (link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const nextUrl = new URL(link.href, window.location.origin);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.origin !== currentUrl.origin) {
        return;
      }

      if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) {
        return;
      }

      startLoading();
    }

    document.addEventListener("click", clickHandler, true);
    return () => document.removeEventListener("click", clickHandler, true);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setProgress(100);

    const finish = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);

    return () => window.clearTimeout(finish);
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-70 h-0.75 w-full transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-(--rose) shadow-[0_0_14px_rgba(222,49,99,0.75)] transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
