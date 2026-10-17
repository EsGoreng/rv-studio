"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

const DEFAULT_ROOT_MARGIN = "256px";

type RafRoot = Element | null | { current: Element | null } | (() => Element | null);

function resolveElement(root: RafRoot): Element | null {
  if (!root) return null;
  if (typeof root === "function") return root() ?? null;
  if (typeof root === "object" && "current" in root) return root.current ?? null;
  return root;
}

interface VisibilityGateOptions {
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
  onChange?: (active: boolean) => void;
}

interface VisibilityGate {
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

function createVisibilityGate({
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
  onChange,
}: VisibilityGateOptions = {}): VisibilityGate {
  let tabVisible =
    typeof document === "undefined" ? true : !document.hidden;
  // Match border-beam: assume onscreen until the observer reports otherwise.
  let onscreen = true;
  let destroyed = false;
  let observer: IntersectionObserver | null = null;

  const isActive = () => {
    if (destroyed) return false;
    if (observeTab && !tabVisible) return false;
    if (observeOffscreen && resolveElement(root) && !onscreen) return false;
    return true;
  };

  let lastActive = isActive();

  const emit = () => {
    if (destroyed) return;
    const next = isActive();
    if (next === lastActive) return;
    lastActive = next;
    onChange?.(next);
  };

  const onVisibilityChange = () => {
    tabVisible = !document.hidden;
    emit();
  };

  if (observeTab && typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  const bindObserver = () => {
    if (!observeOffscreen || typeof IntersectionObserver === "undefined") {
      return;
    }

    const el = resolveElement(root);
    if (!el) return;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onscreen = entry.isIntersecting;
        }
        emit();
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
  };

  bindObserver();

  return {
    /** Whether the animation should currently run. */
    get isActive() {
      return isActive();
    },

    /**
     * Re-bind IntersectionObserver after the root element mounts late
     * (e.g. ref not ready on first call). Safe to call multiple times.
     */
    observe(nextRoot?: RafRoot) {
      if (destroyed) return;
      if (nextRoot != null) root = nextRoot;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      onscreen = true;
      bindObserver();
      emit();
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (observeTab && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    },
  };
}

interface SuspendedRafOptions {
  onFrame: (time: number) => void;
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
}

interface SuspendedRaf {
  start: () => void;
  stop: () => void;
  readonly isRunning: boolean;
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

/**
 * Owns a requestAnimationFrame loop that auto-pauses when the tab is hidden
 * or the root element is offscreen.
 */
function createSuspendedRaf({
  onFrame,
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
}: SuspendedRafOptions): SuspendedRaf {
  if (typeof onFrame !== "function") {
    throw new TypeError("createSuspendedRaf: onFrame is required");
  }

  let rafId: number | null = null;
  let running = false;
  let destroyed = false;

  const stopRaf = () => {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const tick = (time: number) => {
    rafId = null;
    if (destroyed || !running || !gate.isActive) return;
    onFrame(time);
    if (!destroyed && running && gate.isActive) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const sync = () => {
    if (destroyed) return;
    if (running && gate.isActive) {
      if (rafId == null) {
        rafId = requestAnimationFrame(tick);
      }
    } else {
      stopRaf();
    }
  };

  const gate = createVisibilityGate({
    root,
    rootMargin,
    threshold,
    observeTab,
    observeOffscreen,
    onChange: sync,
  });

  return {
    /** Start (or resume) the loop when visibility allows. */
    start() {
      if (destroyed) return;
      running = true;
      sync();
    },

    /** Stop requesting frames (visibility listeners stay attached until destroy). */
    stop() {
      running = false;
      stopRaf();
    },

    /** Whether the caller has started the loop (may still be paused by visibility). */
    get isRunning() {
      return running;
    },

    /** Whether a frame is currently allowed to schedule. */
    get isActive() {
      return gate.isActive;
    },

    /** Re-attach offscreen observer to a (new) root element. */
    observe(nextRoot?: RafRoot) {
      gate.observe(nextRoot);
      sync();
    },

    /** Tear down listeners and cancel any pending frame. */
    destroy() {
      if (destroyed) return;
      destroyed = true;
      running = false;
      stopRaf();
      gate.destroy();
    },
  };
}

const IMAGES = [
  "data:image/jpeg;base64,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0VMOYJR7A/kf/r1LfqgnE0X3JlDj8eo/Om2rIZfLkOFkBQn0z3qra8oua8eYobqXNSXFtJbSmKUYI/Ij1FQ1zu60Zummrokd2kbe5yT/SmUlLSuFhyHDVsWsoHFYvSp4pdhp3sRJX1Osjn961ba7KEHNcjFcZ71oRz1zzepotj0a01coAM1ebVd/evOY7kjvVlbw+tZjO4+3A964vxrIstpbN3WQj8x/wDWpRfEd653xBeef5UIOduWP48VcNwZzlFJRXSSLSUUUgP/0vAqKKK0JFopKWmAUUUUwCiiigQUUUUwFooopgFFFFABRRRTAeqlzgUOedq9B+tCyMgIXvTKHsHUXNABJwO9JVq3TrIe3ApxV3YUnZXIH5O1eg4FOx5a8/eNTsUQ9APWqrNuOTTegk7jif3YHqSaQUj8bR7UmaExlqFtm6X+6MD61VBqxICsIX3yarCm30Jit2SZp8rcKnoKYgywFMZtzE0OQ7ajgau2r/LJGejrVDNTQNhz9KqMrMmcbojBpc1HmlzUXLsW5H3WsWf4Sw/kagDUrH9yi+5P8qiqnImK0Lsl481utvJ82w5Vj1A9KqUlLQ5N6sFFLRBRRRSKCmninUdaTVwQJKVNXorms0qe1NyRXPK63LOhS5HrUv2ketc2JGFPEkhqUrgbcl7tHWsmSRpXLt1NR89+aK3hGxLFopKK0EFFFFAH/9PwKikpa0EFLSUtMQUUUUwCiiigAooopiFooopgFFFFABRRRQAUUUlAC1eLCGMDviqFKST1pqViZRuBJJLHqaAMkD1pKmgGZB7c0ktbFN2Qk3EhHpikiALjPQc1PJGpO8nHrVbdydvAqpaMmLutC1Ocpn6VTq3N/q/yqpRN6hDYmj4R39sfnUNSbv3W0dzmoqlvYpLcWpYuNx9qipytgEetCeoNaDaKXaKUACizGKM4ANFFFUSFFFFMAooooAKKKKACiiigA4paSigApaSigBaSiigAooooA//U8BpaSlrQQUtJRQIWiiimAUUUUwCiiimIWikopgLRSUUAFFFFIAooooAKKKKQBTlcocim0UwHMzOfmNNoooAn3ho9jcGq+DS0tN6gtAo60UUAGBS0UUwCiiimAtFJRQIWikooAWiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1fAaWkpa0EFFFFAhaKKKYBRRRTAKKKKYgooooAKKKKACiiigAooopAFFFFAwooooAKKKKYgpaSlpgFFFFMBaKKKACiiigAooooEFFFFMApaSloAKKKKACiiigAooooAKKKKACiiigAooooA//9k=",
];

const defaultImages: InfinitePerspectiveSliderItem[] = [
  { number: "01", src: IMAGES[0], title: "Inspire", desc: "Nature and calm beginnings" },
  { number: "02", src: IMAGES[1], title: "Stillness", desc: "Moments of quiet and beauty" },
  { number: "03", src: IMAGES[2], title: "Texture", desc: "Light, grain and motion" },
  { number: "04", src: IMAGES[3], title: "Flow", desc: "Soft forms and gentle tone" },
  { number: "05", src: IMAGES[4], title: "Depth", desc: "Warmth and perspective" },
  { number: "06", src: IMAGES[5], title: "Motion", desc: "Energy, waves and drift" },
  { number: "07", src: IMAGES[6], title: "Distort", desc: "Abstract visuals" },
  { number: "08", src: IMAGES[7], title: "Frame", desc: "A cinematic still" },
  { number: "09", src: IMAGES[8], title: "Contrast", desc: "A study in light" },
  { number: "10", src: IMAGES[9], title: "Minimal", desc: "Pared-back composition" },
];

// True when the user has asked the OS to minimise animation. Safe to call
// during render - returns false on the server.
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

const DEFAULT_CARD_WIDTH = 320;
const DEFAULT_CARD_GAP = 24;
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1025;
const MOBILE_CARD_WIDTH = 240;
const MOBILE_CARD_GAP = 16;
const TABLET_CARD_WIDTH = 380;
const TABLET_CARD_GAP = 20;

const ACTIVE_CONTENT_CLEAR_DELTA = 2;
const TEXT_LEAVE_STAGGER = 0.04;

export interface InfinitePerspectiveSliderItemData {
  src?: string;
  number?: string | number;
  title?: string;
  desc?: string;
  description?: string;
}

export type InfinitePerspectiveSliderItem = string | InfinitePerspectiveSliderItemData;

const getItemData = (
  item: InfinitePerspectiveSliderItem
): InfinitePerspectiveSliderItemData =>
  typeof item === "string" ? { src: item } : item;

interface CardSetter {
  x: (value: number | string) => void;
  rotateY: (value: number | string) => void;
}

interface SliderConfig {
  cardWidth: number;
  scrollSpeed: number;
  scrollLerp: number;
  velocityLerp: number;
  rotationSensitivity: number;
  rotationDamp: number;
  rotationLerp: number;
  maxRotation: number;
  scrollStopDelay: number;
  textEnterDuration: number;
  textLeaveDuration: number;
  textStagger: number;
  autoScroll: boolean;
  autoScrollSpeed: number;
  autoScrollMobileOnly: boolean;
  pauseOnHover: boolean;
}

export interface InfinitePerspectiveSliderCompProps {
  images?: InfinitePerspectiveSliderItem[];
  cardWidth?: number;
  cardGap?: number;
  perspective?: number;
  sideFade?: boolean;
  scrollSpeed?: number;
  scrollLerp?: number;
  velocityLerp?: number;
  rotationSensitivity?: number;
  rotationDamp?: number;
  rotationLerp?: number;
  maxRotation?: number;
  scrollStopDelay?: number;
  textEnterDuration?: number;
  textLeaveDuration?: number;
  textStagger?: number;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  autoScrollMobileOnly?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

function InfinitePerspectiveSliderComp({
  images = defaultImages,
  cardWidth = DEFAULT_CARD_WIDTH,
  cardGap = DEFAULT_CARD_GAP,
  perspective = 2200,
  sideFade = true,
  scrollSpeed = 1.0,
  scrollLerp = 0.1,
  velocityLerp = 0.09,
  rotationSensitivity = 0.025,
  rotationDamp = 0.1,
  rotationLerp = 0.12,
  maxRotation = 80,
  scrollStopDelay = 180,
  textEnterDuration = 0.35,
  textLeaveDuration = 0.35,
  textStagger = 0.06,
  autoScroll = true,
  autoScrollSpeed = 1.0,
  autoScrollMobileOnly = true,
  pauseOnHover = true,
  className,
}: InfinitePerspectiveSliderCompProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const settersRef = useRef<CardSetter[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeHoverIndexRef = useRef<number | null>(null);
  const hoveredIndexRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const scrollStopTimerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const isInteractingWithSliderRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  const leaveHandlersRef = useRef<Record<number, () => void>>({});
  const enterHandlersRef = useRef<Record<number, () => void>>({});

  const [viewportWidth, setViewportWidth] = useState(DEFAULT_CARD_WIDTH * 4);

  const isMobileViewport = viewportWidth < MOBILE_BREAKPOINT || viewportWidth < 768;
  const isTabletViewport =
    !isMobileViewport && viewportWidth < TABLET_BREAKPOINT;

  const resolvedCardWidth = isMobileViewport
    ? MOBILE_CARD_WIDTH
    : isTabletViewport
      ? TABLET_CARD_WIDTH
      : cardWidth;

  const resolvedCardGap = isMobileViewport
    ? MOBILE_CARD_GAP
    : isTabletViewport
      ? TABLET_CARD_GAP
      : cardGap;

  const cardStep = resolvedCardWidth + resolvedCardGap;

  const cardHeight = isMobileViewport
    ? "calc(40vh + 72px)"
    : isTabletViewport
      ? "calc(45vh + 84px)"
      : "calc(50vh + 96px)";

  const stateRef = useRef({
    current: 0,
    target: 0,
    velocity: 0,
    smoothVelocity: 0,
    rotationVelocity: 0,
    currentRotation: 0,
    prevDirection: 0,
    isDragging: false,
    lastX: 0,
  });
  const configRef = useRef<SliderConfig>({
    cardWidth: resolvedCardWidth,
    scrollSpeed,
    scrollLerp,
    velocityLerp,
    rotationSensitivity,
    rotationDamp,
    rotationLerp,
    maxRotation,
    scrollStopDelay,
    textEnterDuration,
    textLeaveDuration,
    textStagger,
    autoScroll,
    autoScrollSpeed,
    autoScrollMobileOnly,
    pauseOnHover,
  });

  configRef.current = {
    cardWidth: resolvedCardWidth,
    scrollSpeed,
    scrollLerp,
    velocityLerp,
    rotationSensitivity,
    rotationDamp,
    rotationLerp,
    maxRotation,
    scrollStopDelay,
    textEnterDuration,
    textLeaveDuration,
    textStagger,
    autoScroll,
    autoScrollSpeed,
    autoScrollMobileOnly,
    pauseOnHover,
  };

  const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const clearActiveContent = useCallback(() => {
    const activeIndex = activeHoverIndexRef.current;

    if (activeIndex === null) return;

    const leaveHandler = leaveHandlersRef.current[activeIndex];

    if (leaveHandler) {
      leaveHandler();
    }

    activeHoverIndexRef.current = null;
  }, []);

  const markScrolling = useCallback(() => {
    isScrollingRef.current = true;
    clearActiveContent();

    if (scrollStopTimerRef.current) {
      window.clearTimeout(scrollStopTimerRef.current);
    }

    scrollStopTimerRef.current = window.setTimeout(() => {
      isScrollingRef.current = false;
      scrollStopTimerRef.current = null;

      const hoveredIndex = hoveredIndexRef.current;

      if (hoveredIndex === null) return;

      const enterHandler = enterHandlersRef.current[hoveredIndex];

      if (enterHandler) {
        enterHandler();
      }
    }, configRef.current.scrollStopDelay);
  }, [clearActiveContent]);

  const initSetters = () => {
    if (!stripRef.current) return;

    settersRef.current = Array.from(stripRef.current.children).map(
      (element) =>
        ({
          x: gsap.quickSetter(element, "x", "px"),
          rotateY: gsap.quickSetter(element, "rotateY", "deg"),
        }) as CardSetter
    );
  };

  const positionCards = useCallback(
    (offset: number, rotation: number) => {
      const strip = stripRef.current;

      if (!strip || !images.length) return;

      const cards = strip.children;
      const setters = settersRef.current;

      const count = images.length;
      const loopWidth = count * cardStep;

      const viewW = window.innerWidth;
      const centerX = viewW / 2;
      const centreOffset = centerX - configRef.current.cardWidth / 2;

      for (let index = 0; index < cards.length; index += 1) {
        let x = index * cardStep - offset + centreOffset;

        x = ((x % loopWidth) + loopWidth) % loopWidth;

        if (x > loopWidth - cardStep) {
          x -= loopWidth;
        }

        setters[index]?.x(x);
        setters[index]?.rotateY(rotation);
      }
    },
    [cardStep, images]
  );

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!images.length) return;

    const state = stateRef.current;
    const loopWidth = images.length * cardStep;
    const reducedMotion = prefersReducedMotion();

    initSetters();

    let lastTime = 0;
    const tick = (time: number) => {
      const config = configRef.current;
      const isMobile = viewportWidth < MOBILE_BREAKPOINT || viewportWidth < 768;
      const shouldAutoScroll =
        config.autoScroll &&
        (!config.autoScrollMobileOnly || isMobile) &&
        !state.isDragging &&
        !isPausedRef.current;

      const dt = lastTime ? Math.min((time - lastTime) / (1000 / 60), 2.5) : 1;
      lastTime = time;

      if (shouldAutoScroll) {
        state.target += config.autoScrollSpeed * dt;
      }

      if (reducedMotion) {
        state.current = state.target;
        state.velocity = 0;
        state.smoothVelocity = 0;
        state.rotationVelocity = 0;
        state.currentRotation = 0;
      } else {
        state.current = lerp(state.current, state.target, config.scrollLerp);
        state.velocity = state.target - state.current;

        state.smoothVelocity = lerp(
          state.smoothVelocity,
          state.velocity,
          config.velocityLerp
        );

        state.rotationVelocity = lerp(
          state.rotationVelocity,
          state.velocity,
          config.rotationDamp
        );

        const absVel = Math.abs(state.rotationVelocity);
        const sign = Math.sign(state.rotationVelocity);
        const targetRotation = sign * absVel * config.rotationSensitivity;

        state.currentRotation = lerp(
          state.currentRotation,
          targetRotation,
          config.rotationLerp
        );
      }

      const finalRotation = clamp(
        state.currentRotation,
        -config.maxRotation,
        config.maxRotation
      );

      // Seamless wrapping loop for infinite scroll
      if (Math.abs(state.current) >= loopWidth) {
        const shift = Math.floor(state.current / loopWidth) * loopWidth;
        if (shift !== 0) {
          state.current -= shift;
          state.target -= shift;
        }
      } else if (Math.abs(state.current - state.target) < 0.05) {
        const shift = Math.round(state.current / loopWidth) * loopWidth;
        if (shift !== 0) {
          state.current -= shift;
          state.target -= shift;
        }
      }

      positionCards(state.current, finalRotation);
    };

    const onWheel = (event: WheelEvent) => {
      const delta = event.deltaY;

      if (Math.abs(delta) >= ACTIVE_CONTENT_CLEAR_DELTA) {
        markScrolling();
      }

      state.target += delta * configRef.current.scrollSpeed;
    };

    const onDown = (clientX: number) => {
      state.isDragging = true;
      state.lastX = clientX;
      markScrolling();
    };

    const onMove = (clientX: number) => {
      if (!state.isDragging) return;

      const delta = clientX - state.lastX;

      state.lastX = clientX;

      if (Math.abs(delta) >= ACTIVE_CONTENT_CLEAR_DELTA) {
        markScrolling();
      }

      state.target += -delta * configRef.current.scrollSpeed;
    };

    const onUp = () => {
      state.isDragging = false;
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        return;
      }
      isInteractingWithSliderRef.current = true;
      isPausedRef.current = true;
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      onDown(event.clientX);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isInteractingWithSliderRef.current) return;
      onMove(event.clientX);
    };

    const handleMouseUp = () => {
      if (!isInteractingWithSliderRef.current) return;
      isInteractingWithSliderRef.current = false;
      onUp();
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
      resumeTimerRef.current = window.setTimeout(() => {
        isPausedRef.current = false;
      }, 800);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        return;
      }
      isInteractingWithSliderRef.current = true;
      isPausedRef.current = true;
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      onDown(event.touches[0].clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isInteractingWithSliderRef.current) return;
      onMove(event.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      if (!isInteractingWithSliderRef.current) return;
      isInteractingWithSliderRef.current = false;
      onUp();
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
      resumeTimerRef.current = window.setTimeout(() => {
        isPausedRef.current = false;
      }, 800);
    };

    const handleContainerMouseEnter = () => {
      if (configRef.current.pauseOnHover && !isMobileViewport) {
        isPausedRef.current = true;
      }
    };

    const handleContainerMouseLeave = () => {
      if (!isInteractingWithSliderRef.current) {
        isPausedRef.current = false;
      }
    };

    const onResize = () => {
      markScrolling();
      initSetters();
      positionCards(state.current, state.currentRotation);
    };

    state.current = 0;
    state.target = 0;
    state.velocity = 0;
    state.smoothVelocity = 0;
    state.rotationVelocity = 0;
    state.currentRotation = 0;
    state.prevDirection = 0;

    activeHoverIndexRef.current = null;
    hoveredIndexRef.current = null;
    isScrollingRef.current = false;

    positionCards(0, 0);
    gsap.set(cardRefs.current, { opacity: 1 });

    const loop = createSuspendedRaf({
      root: stripRef,
      onFrame: tick,
    });
    loop.start();

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener("mouseenter", handleContainerMouseEnter);
      containerEl.addEventListener("mouseleave", handleContainerMouseLeave);
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      loop.destroy();

      if (scrollStopTimerRef.current) {
        window.clearTimeout(scrollStopTimerRef.current);
      }
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }

      if (containerEl) {
        containerEl.removeEventListener("mouseenter", handleContainerMouseEnter);
        containerEl.removeEventListener("mouseleave", handleContainerMouseLeave);
      }

      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);

      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [cardStep, images, positionCards, markScrolling, isMobileViewport, viewportWidth]);

  useEffect(() => {
    if (!images.length) return;

    interface AnimationEntry {
      image: HTMLElement;
      handleImageEnter: () => void;
      handleImageLeave: () => void;
      numberSplit: InstanceType<typeof SplitText>;
      titleSplit: InstanceType<typeof SplitText>;
      descriptionSplit: InstanceType<typeof SplitText>;
    }

    const animations: AnimationEntry[] = [];

    leaveHandlersRef.current = {};
    enterHandlersRef.current = {};
    activeHoverIndexRef.current = null;
    hoveredIndexRef.current = null;

    cardRefs.current.forEach((card, index) => {
      const image = imageRefs.current[index];
      const number = numberRefs.current[index];
      const title = titleRefs.current[index];
      const description = descriptionRefs.current[index];

      if (!card || !image || !number || !title || !description) return;

      const numberSplit = SplitText.create(number, {
        type: "lines",
        mask: "lines",
      });

      const titleSplit = SplitText.create(title, {
        type: "lines",
        mask: "lines",
      });

      const descriptionSplit = SplitText.create(description, {
        type: "lines",
        mask: "lines",
      });

      const numberLines = numberSplit.lines;
      const titleLines = titleSplit.lines;
      const descriptionLines = descriptionSplit.lines;

      const allLines = [...numberLines, ...titleLines, ...descriptionLines];

      if (isMobileViewport) {
        gsap.set([number, title, description], {
          autoAlpha: 1,
        });
        gsap.set(allLines, {
          yPercent: 0,
        });
      } else {
        gsap.set([number, title, description], {
          autoAlpha: 0,
        });
        gsap.set(allLines, {
          yPercent: 100,
        });
      }

      const enter = () => {
        if (isScrollingRef.current) return;

        if (
          activeHoverIndexRef.current !== null &&
          activeHoverIndexRef.current !== index
        ) {
          const previousLeave =
            leaveHandlersRef.current[activeHoverIndexRef.current];

          if (previousLeave) {
            previousLeave();
          }
        }

        activeHoverIndexRef.current = index;

        gsap.killTweensOf(allLines);
        gsap.killTweensOf([number, title, description]);

        gsap
          .timeline({
            defaults: {
              ease: "power3.out",
              overwrite: "auto",
            },
          })
          .set([number, title, description], { autoAlpha: 1 })
          .to(
            numberLines,
            {
              yPercent: 0,
              duration: configRef.current.textEnterDuration,
              stagger: configRef.current.textStagger,
            },
            0
          )
          .to(
            [titleLines, descriptionLines],
            {
              yPercent: 0,
              duration: configRef.current.textEnterDuration,
              stagger: configRef.current.textStagger,
            },
            0.05
          );
      };

      const leave = () => {
        if (activeHoverIndexRef.current === index) {
          activeHoverIndexRef.current = null;
        }

        gsap.killTweensOf(allLines);
        gsap.killTweensOf([number, title, description]);

        gsap
          .timeline({
            defaults: {
              ease: "power3.in",
              overwrite: "auto",
            },
          })
          .to(
            [titleLines, descriptionLines],
            {
              yPercent: 100,
              duration: configRef.current.textLeaveDuration,
              stagger: TEXT_LEAVE_STAGGER,
            },
            0
          )
          .to(
            numberLines,
            {
              yPercent: 100,
              duration: configRef.current.textLeaveDuration,
              stagger: TEXT_LEAVE_STAGGER,
            },
            0.04
          )
          .set([number, title, description], { autoAlpha: 0 });
      };

      const handleImageEnter = () => {
        hoveredIndexRef.current = index;

        if (isScrollingRef.current) return;

        enter();
      };

      const handleImageLeave = () => {
        if (hoveredIndexRef.current === index) {
          hoveredIndexRef.current = null;
        }

        leave();
      };

      enterHandlersRef.current[index] = enter;
      leaveHandlersRef.current[index] = leave;

      image.addEventListener("mouseenter", handleImageEnter);
      image.addEventListener("mouseleave", handleImageLeave);

      animations.push({
        image,
        handleImageEnter,
        handleImageLeave,
        numberSplit,
        titleSplit,
        descriptionSplit,
      });
    });

    return () => {
      animations.forEach(
        ({
          image,
          handleImageEnter,
          handleImageLeave,
          numberSplit,
          titleSplit,
          descriptionSplit,
        }) => {
          image.removeEventListener("mouseenter", handleImageEnter);
          image.removeEventListener("mouseleave", handleImageLeave);

          numberSplit.revert();
          titleSplit.revert();
          descriptionSplit.revert();
        }
      );

      leaveHandlersRef.current = {};
      enterHandlersRef.current = {};
      activeHoverIndexRef.current = null;
      hoveredIndexRef.current = null;
    };
  }, [images, isMobileViewport]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden py-1 sm:py-2 select-none", className)}
    >
      {sideFade && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 sm:w-44 lg:w-64 bg-gradient-to-r from-background via-background/75 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 sm:w-44 lg:w-64 bg-gradient-to-l from-background via-background/75 to-transparent"
          />
        </>
      )}

      <div className="pointer-events-none relative flex items-center overflow-hidden" style={{ perspective, minHeight: cardHeight }}>
        <div
          ref={stripRef}
          className="transform-3d relative w-full"
          style={{ height: cardHeight }}
        >
          {images.map((item, index) => {
            const { src, number, title, desc, description } = getItemData(item);

            return (
              <div
                key={index}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="pointer-events-auto absolute left-0 top-0 opacity-0 will-change-transform"
                style={{
                  width: resolvedCardWidth,
                  height: cardHeight,
                  transformOrigin: "center center",
                  transform: "translateZ(1px)",
                }}
              >
                <div
                  ref={(element) => {
                    numberRefs.current[index] = element;
                  }}
                  className="mb-2 text-2xl leading-none tracking-tight text-foreground opacity-0 max-[1025px]:text-xl max-md:mb-1 max-md:text-lg"
                >
                  {number}
                </div>

                <div
                  ref={(element) => {
                    imageRefs.current[index] = element;
                  }}
                  className="relative h-[50vh] w-full overflow-hidden rounded-lg bg-muted max-[1025px]:h-[45vh] max-md:h-[40vh]"
                >
                  <img
                    src={src}
                    alt={`slide-${index}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                <div className="mt-2 space-y-1">
                  <div
                    ref={(element) => {
                      titleRefs.current[index] = element;
                    }}
                    className="text-xl uppercase leading-none tracking-[0.04em] text-foreground opacity-0 max-[1025px]:text-lg max-md:text-base"
                  >
                    {title}
                  </div>

                  <div
                    ref={(element) => {
                      descriptionRefs.current[index] = element;
                    }}
                    className="text-sm leading-none text-muted-foreground opacity-0 max-[1025px]:text-xs max-md:text-xs"
                  >
                    {desc || description || ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface InfinitePerspectiveSliderProps {
  images?: InfinitePerspectiveSliderItem[];
  cardWidth?: number;
  cardGap?: number;
  perspective?: number;
  sideFade?: boolean;
  scrollSpeed?: number;
  scrollLerp?: number;
  velocityLerp?: number;
  rotationSensitivity?: number;
  rotationDamp?: number;
  rotationLerp?: number;
  maxRotation?: number;
  scrollStopDelay?: number;
  textEnterDuration?: number;
  textLeaveDuration?: number;
  textStagger?: number;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  autoScrollMobileOnly?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export function InfinitePerspectiveSlider({ className, ...props }: InfinitePerspectiveSliderProps) {
  return (
    <div className={cn("flex w-full flex-col justify-center bg-transparent", className)}>
      <InfinitePerspectiveSliderComp {...props} />
    </div>
  );
}

export default InfinitePerspectiveSlider;
