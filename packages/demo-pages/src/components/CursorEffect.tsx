import { useEffect, useRef } from "react";

export type CursorMode = "trail" | "follow" | "cursor" | "swarm" | "off";

interface CursorEffectProps {
  mode: CursorMode;
}

const LOBSTER = "🦞";
const PREY = ["🐟", "🦐", "🦀", "🐚", "🪸"];
const EXPLODE_PARTICLES = ["✨", "💥", "🔥", "⭐", "💫"];

/* ------------------------------------------------------------------ */
/*  Mode 1: Lobster Hunting                                            */
/*  - Prey only spawns in empty space (not over text/interactive)      */
/*  - Prey auto-fades after a few seconds                              */
/*  - Lobster grows when eating; explodes at max size then resets      */
/* ------------------------------------------------------------------ */

const MIN_LOBSTER_SIZE = 28;
const MAX_LOBSTER_SIZE = 80;
const SIZE_PER_EAT = 6;
const PREY_LIFETIME_MS = 3000;
const MAX_PREY = 10;

interface Prey {
  el: HTMLSpanElement;
  x: number;
  y: number;
  alive: boolean;
  wobbleOffset: number;
  wobbleSpeed: number;
  baseY: number;
  spawnedAt: number;
}

function isOverText(x: number, y: number): boolean {
  const els = document.elementsFromPoint(x, y);
  for (const el of els) {
    if ((el as HTMLElement).dataset?.cursorLayer) continue;
    const tag = el.tagName;
    if (
      tag === "A" ||
      tag === "BUTTON" ||
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT"
    )
      return true;
    const display = getComputedStyle(el).display;
    if (display === "inline" || display === "inline-block") {
      const text = el.textContent?.trim();
      if (text && text.length > 0 && el.children.length === 0) return true;
    }
    if (
      tag === "H1" ||
      tag === "H2" ||
      tag === "H3" ||
      tag === "H4" ||
      tag === "P" ||
      tag === "SPAN" ||
      tag === "LI" ||
      tag === "LABEL" ||
      tag === "TH" ||
      tag === "TD"
    ) {
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return true;
    }
  }
  return false;
}

function useTrailEffect(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lobsterPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lobsterVel = { x: 0, y: 0 };
    const preyList: Prey[] = [];
    let spawnThrottle = 0;
    let lobsterSize = MIN_LOBSTER_SIZE;

    const lobsterEl = document.createElement("div");
    lobsterEl.textContent = LOBSTER;
    lobsterEl.dataset.cursorLayer = "1";
    lobsterEl.style.cssText = `
      position: fixed; font-size: ${lobsterSize}px; pointer-events: none; z-index: 10000;
      transition: none; will-change: transform, left, top;
    `;
    container.appendChild(lobsterEl);

    function explodeLobster() {
      const cx = lobsterPos.x;
      const cy = lobsterPos.y;
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("span");
        particle.textContent =
          EXPLODE_PARTICLES[Math.floor(Math.random() * EXPLODE_PARTICLES.length)];
        particle.dataset.cursorLayer = "1";
        const a = (Math.PI * 2 * i) / 8;
        particle.style.cssText = `
          position: fixed; left: ${cx}px; top: ${cy}px;
          font-size: ${16 + Math.random() * 12}px;
          pointer-events: none; z-index: 10001;
          transform: translate(-50%, -50%) scale(1); opacity: 1;
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        `;
        container?.appendChild(particle);
        const dist = 50 + Math.random() * 40;
        requestAnimationFrame(() => {
          particle.style.opacity = "0";
          particle.style.transform = `translate(${Math.cos(a) * dist - 8}px, ${Math.sin(a) * dist - 8}px) scale(0.3) rotate(${Math.random() * 360}deg)`;
        });
        setTimeout(() => particle.remove(), 520);
      }

      lobsterSize = MIN_LOBSTER_SIZE;
      lobsterEl.style.fontSize = `${lobsterSize}px`;
      lobsterEl.style.opacity = "0";
      setTimeout(() => {
        lobsterEl.style.opacity = "1";
      }, 300);
    }

    function spawnPrey(x: number, y: number) {
      if (preyList.filter((p) => p.alive).length >= MAX_PREY) return;

      const spread = 80 + Math.random() * 100;
      const angle = Math.random() * Math.PI * 2;
      let px = x + Math.cos(angle) * spread;
      let py = y + Math.sin(angle) * spread;

      px = Math.max(20, Math.min(window.innerWidth - 20, px));
      py = Math.max(20, Math.min(window.innerHeight - 20, py));

      if (isOverText(px, py)) return;

      const el = document.createElement("span");
      el.textContent = PREY[Math.floor(Math.random() * PREY.length)];
      el.dataset.cursorLayer = "1";
      el.style.cssText = `
        position: fixed; left: ${px}px; top: ${py}px;
        font-size: ${14 + Math.random() * 6}px;
        pointer-events: none; z-index: 9998;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s;
        opacity: 1; will-change: transform, left, top;
      `;
      container?.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = "translate(-50%, -50%) scale(1)";
      });
      preyList.push({
        el,
        x: px,
        y: py,
        alive: true,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 1.5 + Math.random() * 1.5,
        baseY: py,
        spawnedAt: Date.now(),
      });
    }

    function fadePrey(prey: Prey) {
      prey.alive = false;
      prey.el.style.transform = "translate(-50%, -50%) scale(0.3)";
      prey.el.style.opacity = "0";
      setTimeout(() => prey.el.remove(), 620);
    }

    function eatPrey(prey: Prey) {
      prey.alive = false;
      prey.el.style.transform = "translate(-50%, -50%) scale(0)";
      prey.el.style.opacity = "0";
      setTimeout(() => prey.el.remove(), 320);

      lobsterSize = Math.min(lobsterSize + SIZE_PER_EAT, MAX_LOBSTER_SIZE + SIZE_PER_EAT);
      if (lobsterSize > MAX_LOBSTER_SIZE) {
        explodeLobster();
      } else {
        lobsterEl.style.fontSize = `${lobsterSize}px`;
      }
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const now = Date.now();
      if (now - spawnThrottle > 400) {
        spawnThrottle = now;
        spawnPrey(e.clientX, e.clientY);
      }
    }
    window.addEventListener("mousemove", onMove);

    let raf: number;
    let t = 0;

    function animate() {
      t += 0.016;
      const now = Date.now();

      const stiffness = 0.06;
      const damping = 0.78;
      lobsterVel.x = (lobsterVel.x + (mouse.x - lobsterPos.x) * stiffness) * damping;
      lobsterVel.y = (lobsterVel.y + (mouse.y - lobsterPos.y) * stiffness) * damping;
      lobsterPos.x += lobsterVel.x;
      lobsterPos.y += lobsterVel.y;

      const speed = Math.sqrt(lobsterVel.x ** 2 + lobsterVel.y ** 2);
      const angle = Math.atan2(lobsterVel.y, lobsterVel.x) * (180 / Math.PI);
      const rot = speed > 0.5 ? angle + 90 : 0;
      const growthRatio = (lobsterSize - MIN_LOBSTER_SIZE) / (MAX_LOBSTER_SIZE - MIN_LOBSTER_SIZE);
      const wobble = growthRatio > 0.7 ? Math.sin(t * 12) * 3 * growthRatio : 0;

      lobsterEl.style.left = `${lobsterPos.x}px`;
      lobsterEl.style.top = `${lobsterPos.y}px`;
      lobsterEl.style.transform = `translate(-50%, -50%) rotate(${rot + wobble}deg)`;

      const eatRadius = 25 + lobsterSize * 0.3;

      for (let i = preyList.length - 1; i >= 0; i--) {
        const p = preyList[i];
        if (!p.alive) {
          if (!p.el.parentNode) preyList.splice(i, 1);
          continue;
        }

        if (now - p.spawnedAt > PREY_LIFETIME_MS) {
          fadePrey(p);
          continue;
        }

        const age = now - p.spawnedAt;
        const fadeStart = PREY_LIFETIME_MS * 0.4;
        if (age > fadeStart) {
          const fadeProgress = (age - fadeStart) / (PREY_LIFETIME_MS - fadeStart);
          p.el.style.opacity = `${1 - fadeProgress}`;
        }

        p.el.style.top = `${p.baseY + Math.sin(t * p.wobbleSpeed + p.wobbleOffset) * 4}px`;

        const dx = lobsterPos.x - p.x;
        const dy = lobsterPos.y - (p.baseY + Math.sin(t * p.wobbleSpeed + p.wobbleOffset) * 4);
        if (Math.sqrt(dx * dx + dy * dy) < eatRadius) {
          eatPrey(p);
        }
      }

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      if (container) container.innerHTML = "";
    };
  }, [active]);

  return containerRef;
}

/* ------------------------------------------------------------------ */
/*  Mode 2: Floating Follow (Pet)                                      */
/* ------------------------------------------------------------------ */

function useFollowEffect(active: boolean) {
  const elRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;
    const el = elRef.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMove);

    let raf: number;
    function animate() {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const px = posRef.current.x;
      const py = posRef.current.y;

      const stiffness = 0.08;
      const damping = 0.75;

      const ax = (mx - px) * stiffness;
      const ay = (my - py) * stiffness;

      velRef.current.x = (velRef.current.x + ax) * damping;
      velRef.current.y = (velRef.current.y + ay) * damping;

      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;

      const angle = Math.atan2(velRef.current.y, velRef.current.x) * (180 / Math.PI);
      const speed = Math.sqrt(velRef.current.x ** 2 + velRef.current.y ** 2);
      const tilt = Math.min(speed * 3, 25);

      if (el) {
        el.style.transform = `translate(-50%, -50%) rotate(${tilt > 1 ? angle + 90 : 0}deg)`;
        el.style.left = `${posRef.current.x}px`;
        el.style.top = `${posRef.current.y}px`;
      }

      raf = requestAnimationFrame(animate);
    }

    posRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  return elRef;
}

/* ------------------------------------------------------------------ */
/*  Mode 3: Custom Cursor                                              */
/* ------------------------------------------------------------------ */

function useCursorEffect(active: boolean) {
  const elRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);

  useEffect(() => {
    if (!active) return;
    const el = elRef.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      if (!el) return;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    }

    function onDown() {
      scaleRef.current = 0.8;
      if (el) el.style.transform = "translate(-50%, -50%) scale(0.8)";
    }

    function onUp() {
      scaleRef.current = 1;
      if (el) el.style.transform = "translate(-50%, -50%) scale(1.15)";
      setTimeout(() => {
        if (el) el.style.transform = "translate(-50%, -50%) scale(1)";
      }, 120);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [active]);

  return elRef;
}

/* ------------------------------------------------------------------ */
/*  Mode 4: Particle Swarm                                             */
/* ------------------------------------------------------------------ */

const SWARM_COUNT = 6;

function useSwarmEffect(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const centerRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLSpanElement[] = [];
    for (let i = 0; i < SWARM_COUNT; i++) {
      const el = document.createElement("span");
      el.textContent = LOBSTER;
      el.style.cssText = `
        position: fixed;
        font-size: ${14 + Math.random() * 10}px;
        pointer-events: none;
        z-index: 9999;
        transition: none;
      `;
      container.appendChild(el);
      particles.push(el);
    }

    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMove);

    let raf: number;
    let t = 0;

    function animate() {
      t += 0.02;

      centerRef.current.x += (mouseRef.current.x - centerRef.current.x) * 0.08;
      centerRef.current.y += (mouseRef.current.y - centerRef.current.y) * 0.08;

      for (let i = 0; i < SWARM_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / SWARM_COUNT + t * (0.8 + i * 0.15);
        const radius = 35 + Math.sin(t * 1.5 + i) * 15;
        const x = centerRef.current.x + Math.cos(angle) * radius;
        const y = centerRef.current.y + Math.sin(angle) * radius;
        const rot = angle * (180 / Math.PI) + 90;

        particles[i].style.left = `${x}px`;
        particles[i].style.top = `${y}px`;
        particles[i].style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
      }

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      for (const p of particles) p.remove();
    };
  }, [active]);

  return containerRef;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function CursorEffect({ mode }: CursorEffectProps) {
  const trailRef = useTrailEffect(mode === "trail");
  const followRef = useFollowEffect(mode === "follow");
  const cursorRef = useCursorEffect(mode === "cursor");
  const swarmRef = useSwarmEffect(mode === "swarm");

  const hideCursor = mode === "cursor";

  useEffect(() => {
    if (hideCursor) {
      document.body.style.cursor = "none";
      return () => {
        document.body.style.cursor = "";
      };
    }
  }, [hideCursor]);

  if (mode === "off") return null;

  return (
    <>
      {/* Trail container */}
      {mode === "trail" && (
        <div ref={trailRef} className="fixed inset-0 pointer-events-none z-[9999]" />
      )}

      {/* Follow pet */}
      {mode === "follow" && (
        <div
          ref={followRef}
          className="fixed pointer-events-none z-[9999] text-[32px]"
          style={{ transition: "transform 0.1s ease-out" }}
        >
          {LOBSTER}
        </div>
      )}

      {/* Custom cursor */}
      {mode === "cursor" && (
        <div
          ref={cursorRef}
          className="fixed pointer-events-none z-[9999] text-[28px]"
          style={{
            transition: "transform 0.1s ease-out",
            transform: "translate(-50%, -50%) scale(1)",
          }}
        >
          {LOBSTER}
        </div>
      )}

      {/* Swarm container */}
      {mode === "swarm" && (
        <div ref={swarmRef} className="fixed inset-0 pointer-events-none z-[9999]" />
      )}
    </>
  );
}
