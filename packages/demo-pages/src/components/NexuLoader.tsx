import { type MotionValue, animate, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

const GRAY = "#D4D4D4";

const SHAPES = [
  {
    id: "n-top-left",
    color: "#F8672F",
    cx: 161,
    cy: 161,
    d: "M161.308 72.5333C210.336 72.5335 250.081 112.279 250.081 161.308V231.059C250.081 241.565 241.565 250.082 231.059 250.082H91.5569C81.0508 250.082 72.5335 241.565 72.5334 231.059V161.308C72.5334 112.279 112.279 72.5333 161.308 72.5333ZM155.39 167.225V250.081H167.226V167.225H155.39Z",
  },
  {
    id: "e-top-right",
    color: "#346E58",
    cx: 350,
    cy: 161,
    d: "M261.919 161.313C261.919 112.284 301.665 72.5391 350.693 72.5391C397.73 72.5393 436.221 109.122 439.27 155.388L356.61 155.388L356.61 167.225L439.271 167.225C436.229 213.497 397.735 250.087 350.693 250.087C301.665 250.087 261.919 210.341 261.919 161.313Z",
  },
  {
    id: "x-bottom-left",
    color: "#F3B0FF",
    cx: 161,
    cy: 350,
    d: "M72.5334 350.697C72.5334 328.311 80.8194 307.862 94.4905 292.245L140.643 338.396L149.012 330.027L102.861 283.876C118.477 270.205 138.926 261.918 161.312 261.918C182.76 261.918 202.432 269.526 217.777 282.19L169.931 330.035L178.301 338.405L226.389 290.317C241.091 306.158 250.081 327.374 250.081 350.69C250.081 373.075 241.794 393.525 228.122 409.141L177.014 358.031L168.644 366.4L219.753 417.51C204.137 431.18 183.689 439.466 161.305 439.466C137.99 439.466 116.774 430.478 100.934 415.778L150.3 366.411L141.931 358.042L92.8069 407.166C80.1413 391.821 72.5335 372.147 72.5334 350.697Z",
  },
  {
    id: "u-bottom-right",
    color: "#EDC337",
    cx: 350,
    cy: 350,
    d: "M350.691 439.466C301.663 439.466 261.918 399.72 261.918 350.692L261.918 280.941C261.918 270.435 270.434 261.917 280.94 261.917L420.442 261.917C430.948 261.917 439.466 270.435 439.466 280.941L439.466 350.692C439.466 399.72 399.72 439.466 350.691 439.466ZM356.61 344.774L356.61 261.918L344.774 261.918L344.774 344.774L356.61 344.774Z",
  },
];

const STAGGER = 250;
const HOLD = 500;

function ColorLayer({
  shape,
  staggerDelay,
  trigger,
}: {
  shape: (typeof SHAPES)[0];
  staggerDelay: number;
  trigger: MotionValue<number>;
}) {
  const gRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const scaleVal = useMotionValue(0);
  const opacityVal = useMotionValue(0);
  const scaleCtrl = useRef<ReturnType<typeof animate> | null>(null);
  const opacityCtrl = useRef<ReturnType<typeof animate> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubS = scaleVal.on("change", (s) => {
      if (!gRef.current) return;
      gRef.current.setAttribute(
        "transform",
        `translate(${shape.cx},${shape.cy}) scale(${s}) translate(${-shape.cx},${-shape.cy})`,
      );
    });
    const unsubO = opacityVal.on("change", (o) => {
      if (!pathRef.current) return;
      pathRef.current.setAttribute("opacity", String(o));
    });
    return () => {
      unsubS();
      unsubO();
    };
  }, [shape.cx, shape.cy, scaleVal, opacityVal]);

  useEffect(() => {
    const unsub = trigger.on("change", (phase) => {
      scaleCtrl.current?.stop();
      opacityCtrl.current?.stop();
      if (timerRef.current) clearTimeout(timerRef.current);

      if (phase === 1) {
        timerRef.current = setTimeout(() => {
          scaleCtrl.current = animate(scaleVal, 1, {
            type: "spring",
            stiffness: 300,
            damping: 15,
            mass: 0.8,
          });
          opacityCtrl.current = animate(opacityVal, 1, {
            type: "spring",
            stiffness: 300,
            damping: 15,
            mass: 0.8,
          });
        }, staggerDelay);
      } else {
        scaleCtrl.current = animate(scaleVal, 0, {
          type: "spring",
          stiffness: 200,
          damping: 22,
          mass: 0.6,
        });
        opacityCtrl.current = animate(opacityVal, 0, {
          type: "spring",
          stiffness: 200,
          damping: 22,
          mass: 0.6,
        });
      }
    });
    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scaleVal, opacityVal, staggerDelay, trigger]);

  return (
    <g
      ref={gRef}
      transform={`translate(${shape.cx},${shape.cy}) scale(0) translate(${-shape.cx},${-shape.cy})`}
    >
      <path ref={pathRef} d={shape.d} fill={shape.color} opacity={0} />
    </g>
  );
}

interface NexuLoaderProps {
  size?: number;
  className?: string;
}

export default function NexuLoader({ size = 48, className = "" }: NexuLoaderProps) {
  const trigger = useMotionValue(0);

  useEffect(() => {
    const totalIn = SHAPES.length * STAGGER + 400;
    const cycleTime = totalIn + HOLD;

    let running = true;

    const raf = requestAnimationFrame(() => {
      trigger.set(1);
    });

    const loop = async () => {
      await sleep(cycleTime + 16);
      while (running) {
        trigger.set(0);
        await sleep(600);
        if (!running) break;
        trigger.set(1);
        await sleep(cycleTime);
      }
    };

    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [trigger]);

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {SHAPES.map((shape) => (
          <path key={`${shape.id}-bg`} d={shape.d} fill={GRAY} />
        ))}
        {SHAPES.map((shape, i) => (
          <ColorLayer key={shape.id} shape={shape} staggerDelay={i * STAGGER} trigger={trigger} />
        ))}
      </svg>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function NexuLoadingScreen({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <NexuLoader size={96} />
      <p className="mt-5 text-sm text-[#999] tracking-wide">Loading...</p>
    </div>
  );
}
