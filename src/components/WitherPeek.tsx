"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./WitherPeek.module.css";

type Appearance = {
  side: "left" | "right";
  top: number;
  leaving: boolean;
};

const MAX_APPEARANCES = 5;

function randomScrollDistance() {
  return 450 + Math.floor(Math.random() * 1050);
}

export function WitherPeek() {
  const [appearance, setAppearance] = useState<Appearance | null>(null);
  const nextTrigger = useRef(0);
  const active = useRef(false);
  const appearances = useRef(0);
  const hideTimer = useRef<number | null>(null);
  const removeTimer = useRef<number | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");

    const scheduleNextAppearance = () => {
      nextTrigger.current = window.scrollY + randomScrollDistance();
    };

    const clearTimers = () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      if (removeTimer.current) window.clearTimeout(removeTimer.current);
    };

    const hide = () => {
      if (!active.current) return;

      clearTimers();
      setAppearance((current) => (current ? { ...current, leaving: true } : null));
      removeTimer.current = window.setTimeout(() => {
        active.current = false;
        setAppearance(null);
        scheduleNextAppearance();
      }, 450);
    };

    const show = () => {
      if (
        !motionQuery.matches ||
        active.current ||
        appearances.current >= MAX_APPEARANCES
      ) {
        return;
      }

      active.current = true;
      appearances.current += 1;
      setAppearance({
        side: Math.random() < 0.5 ? "left" : "right",
        top: 34 + Math.floor(Math.random() * 28),
        leaving: false,
      });
      hideTimer.current = window.setTimeout(hide, 5200);
    };

    const handleScroll = () => {
      if (window.scrollY >= nextTrigger.current) show();
    };

    const handleMotionPreferenceChange = () => {
      if (!motionQuery.matches) hide();
    };

    scheduleNextAppearance();
    window.addEventListener("scroll", handleScroll, { passive: true });
    motionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      clearTimers();
      window.removeEventListener("scroll", handleScroll);
      motionQuery.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  const dismiss = () => {
    if (!active.current) return;

    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setAppearance((current) => (current ? { ...current, leaving: true } : null));
    window.setTimeout(() => {
      active.current = false;
      setAppearance(null);
      nextTrigger.current = window.scrollY + randomScrollDistance();
    }, 450);
  };

  if (!appearance) return null;

  return (
    <button
      type="button"
      aria-label="Dismiss the Wither"
      className={`${styles.wither} ${styles[appearance.side]} ${
        appearance.leaving ? styles.leaving : styles.entering
      }`}
      style={{ top: `${appearance.top}%` }}
      onClick={dismiss}
    >
      <Image
        src="/images/wither.png"
        alt=""
        width={1218}
        height={1093}
        className={styles.image}
      />
    </button>
  );
}
