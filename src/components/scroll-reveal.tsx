"use client";

import { useEffect } from "react";

// Toggles `.is-visible` on `.reveal`/`.reveal-stagger` elements as they enter the
// viewport — mirrors the plain IntersectionObserver script from the Organic
// reference page, wrapped as a mount effect instead of an inline <script>.
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
