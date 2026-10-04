"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

// Measure only the decorative SVG. Pixel-sized feathers stay soft as answers grow.
export function PanelSilhouette() {
  const layer = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");
  const [size, setSize] = useState({ width: 1200, height: 600, left: 110, right: 110, feather: 110 });
  useLayoutEffect(() => {
    const svg = layer.current;
    if (!svg) return;
    const measure = () => {
      const style = window.getComputedStyle(svg);
      const bounds = svg.getBoundingClientRect();
      setSize(previous => {
        const next = { width: bounds.width, height: bounds.height, left: Math.max(1, -parseFloat(style.left) - (window.innerWidth <= 700 ? 0 : 12)) || 110, right: Math.max(1, -parseFloat(style.right) - (window.innerWidth <= 700 ? 0 : 12)) || 110, feather: parseFloat(style.getPropertyValue("--fade-y")) || 110 };
        return bounds.width && bounds.height && Object.keys(next).some(key => next[key as keyof typeof next] !== previous[key as keyof typeof previous]) ? next : previous;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  const { width, height, left, right, feather } = size;
  const coreWidth = Math.max(1, width - left - right);
  const coreHeight = Math.max(1, height - feather * 2);
  return <svg ref={layer} className="sd-panel-fade" width="100%" height="100%" aria-hidden="true" focusable="false">
    <defs>
      <filter id={`${id}-soften`} x="0" y="0" width={width} height={height} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation={`${Math.min(left, right) / 2.8} ${feather / 2.8}`} />
        {/* Clamp the inner half to full opacity; the exterior reaches zero smoothly. */}
        <feComponentTransfer><feFuncA type="linear" slope="2.02" intercept="-0.01" /></feComponentTransfer>
      </filter>
      <mask id={`${id}-mask`} x="0" y="0" width={width} height={height} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
        <rect x={left} y={feather} width={coreWidth} height={coreHeight} rx={Math.min(90, coreHeight * .22, coreWidth * .1)} fill="white" filter={`url(#${id}-soften)`} />
      </mask>
    </defs>
    <rect width={width} height={height} fill="#fff6e5" mask={`url(#${id}-mask)`} />
  </svg>;
}
