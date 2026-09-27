"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  randomCharacters,
  shuffledCharacterBag,
  type RandomCharacter,
} from "@/data/randomCharacters";
import styles from "./WitherPeek.module.css";

type Appearance = {
  character: RandomCharacter;
  side: "left" | "right";
  top: number;
  revealProgress: number;
  leaving: boolean;
};

const WITHER_SETTINGS = {
  maxAppearances: 6,
  minScrollDistance: 360,
  scrollDistanceRange: 1040,
  revealScrollDistance: 420,
  visibleDuration: 1040,
  incompleteRevealDuration: 1600,
  exitDuration: 450,
};

function randomScrollDistance() {
  return (
    WITHER_SETTINGS.minScrollDistance +
    Math.floor(Math.random() * WITHER_SETTINGS.scrollDistanceRange)
  );
}

function revealTransform(side: Appearance["side"], progress: number) {
  const enteringPosition = side === "left" ? -78 : 78;
  const restingPosition = side === "left" ? -18 : 18;
  const enteringRotation = side === "left" ? -7 : 7;
  const restingRotation = side === "left" ? -3 : 3;
  const position = enteringPosition + (restingPosition - enteringPosition) * progress;
  const rotation = enteringRotation + (restingRotation - enteringRotation) * progress;

  return `translateX(${position}%) rotate(${rotation}deg)`;
}

export function WitherPeek() {
  const [appearance, setAppearance] = useState<Appearance | null>(null);
  const characterBag = useRef<RandomCharacter[]>([]);
  const lastCharacterId = useRef<string | null>(null);
  const nextTrigger = useRef(0);
  const active = useRef(false);
  const appearances = useRef(0);
  const hideTimer = useRef<number | null>(null);
  const incompleteRevealTimer = useRef<number | null>(null);
  const removeTimer = useRef<number | null>(null);
  const revealProgress = useRef(0);
  const revealComplete = useRef(false);
  const overflowRevealDistance = useRef(0);
  const touchStartY = useRef<number | null>(null);

  const nextCharacter = () => {
    if (characterBag.current.length === 0) {
      characterBag.current = shuffledCharacterBag(lastCharacterId.current);
    }

    const character = characterBag.current.shift();

    if (!character) {
      return randomCharacters[0];
    }

    lastCharacterId.current = character.id;
    return character;
  };

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");

    const scheduleNextAppearance = () => {
      nextTrigger.current = window.scrollY + randomScrollDistance();
    };

    const clearTimers = () => {
      if (hideTimer.current !== null) {
        window.clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      if (incompleteRevealTimer.current !== null) {
        window.clearTimeout(incompleteRevealTimer.current);
        incompleteRevealTimer.current = null;
      }
      if (removeTimer.current !== null) {
        window.clearTimeout(removeTimer.current);
        removeTimer.current = null;
      }
    };

    const hide = () => {
      if (!active.current) return;

      clearTimers();
      setAppearance((current) => (current ? { ...current, leaving: true } : null));
      removeTimer.current = window.setTimeout(() => {
        active.current = false;
        revealProgress.current = 0;
        revealComplete.current = false;
        overflowRevealDistance.current = 0;
        removeTimer.current = null;
        setAppearance(null);
        scheduleNextAppearance();
      }, WITHER_SETTINGS.exitDuration);
    };

    const startHideTimer = () => {
      if (hideTimer.current !== null) return;

      hideTimer.current = window.setTimeout(hide, WITHER_SETTINGS.visibleDuration);
    };

    const startIncompleteRevealTimer = () => {
      if (incompleteRevealTimer.current !== null) return;

      incompleteRevealTimer.current = window.setTimeout(
        hide,
        WITHER_SETTINGS.incompleteRevealDuration,
      );
    };

    const updateReveal = () => {
      if (!active.current || revealComplete.current) return;

      const progress = Math.min(
        1,
        Math.max(
          0,
          (window.scrollY - nextTrigger.current + overflowRevealDistance.current) /
            WITHER_SETTINGS.revealScrollDistance,
        ),
      );

      if (progress === revealProgress.current) return;

      revealProgress.current = progress;
      setAppearance((current) =>
        current ? { ...current, revealProgress: progress } : null,
      );

      if (progress === 1) {
        revealComplete.current = true;
        if (incompleteRevealTimer.current !== null) {
          window.clearTimeout(incompleteRevealTimer.current);
          incompleteRevealTimer.current = null;
        }
        startHideTimer();
      }
    };

    const isAtPageBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;

    const continueRevealAtPageBottom = (distance: number) => {
      if (!active.current || revealComplete.current || distance <= 0 || !isAtPageBottom()) {
        return;
      }

      overflowRevealDistance.current += distance;
      updateReveal();
    };

    const show = () => {
      if (
        !motionQuery.matches ||
        active.current ||
        appearances.current >= WITHER_SETTINGS.maxAppearances
      ) {
        return;
      }

      active.current = true;
      appearances.current += 1;
      const initialRevealProgress = Math.min(
        1,
        Math.max(
          0,
          (window.scrollY - nextTrigger.current) / WITHER_SETTINGS.revealScrollDistance,
        ),
      );
      revealProgress.current = initialRevealProgress;
      revealComplete.current = initialRevealProgress === 1;
      overflowRevealDistance.current = 0;
      setAppearance({
        character: nextCharacter(),
        side: Math.random() < 0.5 ? "left" : "right",
        top: 34 + Math.floor(Math.random() * 28),
        revealProgress: initialRevealProgress,
        leaving: false,
      });

      if (revealComplete.current) {
        startHideTimer();
      } else {
        startIncompleteRevealTimer();
      }
    };

    const handleScroll = () => {
      if (window.scrollY >= nextTrigger.current) show();
      updateReveal();
    };

    const handleWheel = (event: WheelEvent) => {
      continueRevealAtPageBottom(event.deltaY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined || touchStartY.current === null) return;

      continueRevealAtPageBottom(touchStartY.current - currentY);
      touchStartY.current = currentY;
    };

    const handleMotionPreferenceChange = () => {
      if (!motionQuery.matches) hide();
    };

    scheduleNextAppearance();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    motionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      clearTimers();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      motionQuery.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  const dismiss = () => {
    if (!active.current) return;

    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (incompleteRevealTimer.current !== null) {
      window.clearTimeout(incompleteRevealTimer.current);
      incompleteRevealTimer.current = null;
    }
    setAppearance((current) => (current ? { ...current, leaving: true } : null));
    removeTimer.current = window.setTimeout(() => {
      active.current = false;
      revealProgress.current = 0;
      revealComplete.current = false;
      overflowRevealDistance.current = 0;
      removeTimer.current = null;
      setAppearance(null);
      nextTrigger.current = window.scrollY + randomScrollDistance();
    }, WITHER_SETTINGS.exitDuration);
  };

  if (!appearance) return null;

  return (
    <button
      type="button"
      aria-label="Dismiss character"
      className={`${styles.wither} ${styles[appearance.side]} ${appearance.leaving ? styles.leaving : ""}`}
      style={{
        top: `${appearance.top}%`,
        transform: revealTransform(appearance.side, appearance.revealProgress),
      }}
      onClick={dismiss}
    >
      <Image
        src={appearance.character.src}
        alt=""
        width={appearance.character.width}
        height={appearance.character.height}
        className={`${styles.image} ${
          appearance.revealProgress === 1 ? styles.bobbing : ""
        }`}
      />
    </button>
  );
}
