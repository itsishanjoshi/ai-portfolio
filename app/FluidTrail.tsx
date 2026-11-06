"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./lib/motion";

/*
 * The fluid mouse trail behind the hero. Mouse users only: the simulation loads on the first mouse
 * move, so phones and anyone with reduced motion never download it. Without WebGL2 the canvas stays empty.
 */
export default function FluidTrail() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;

    let disposed = false;
    let fluid: { destroy: () => void } | null = null;

    const start = async () => {
      window.removeEventListener("pointermove", start);
      const { createFluid } = await import("./lib/fluid");
      if (!disposed && canvas.current) fluid = createFluid(canvas.current);
    };
    window.addEventListener("pointermove", start, { passive: true });

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", start);
      fluid?.destroy();
    };
  }, []);

  return <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
