import { useEffect, useRef, useState } from "react";
import { portraitPointer, selectPortraitPose, type PortraitPose } from "./portrait-motion";
import neutral from "./expressions/neutral.webp";
import left from "./expressions/left.webp";
import right from "./expressions/right.webp";
import up from "./expressions/up.webp";
import down from "./expressions/down.webp";
import happy from "./expressions/happy.webp";

const poses: { name: PortraitPose; src: string }[] = [
  {name: "neutral", src: neutral}, {name: "left", src: left}, {name: "right", src: right},
  {name: "up", src: up}, {name: "down", src: down}, {name: "happy", src: happy},
];

export default function InteractivePortrait({enabled = true, greeting = 0}: {enabled?: boolean; greeting?: number}) {
  const root = useRef<HTMLButtonElement>(null);
  const [pose, setPose] = useState<PortraitPose>("neutral");
  const [reducedMotion, setReducedMotion] = useState(false);
  const poseRef = useRef<PortraitPose>("neutral");
  const holdUntil = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(query.matches);
    change(); query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stage = el.closest<HTMLElement>("[data-portrait-stage]");
    if (!stage) return;
    let raf = 0;
    let lastChange = 0;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    let nearFace = false;
    let inside = false;
    const active = enabled && !reducedMotion;
    const displayPose = (next: PortraitPose) => {
      if (poseRef.current !== next) { poseRef.current = next; setPose(next); }
    };
    const tick = () => {
      raf = 0;
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.setProperty("--head-x", `${currentX * 2.8}deg`);
      el.style.setProperty("--head-y", `${-currentY * 2.2}deg`);
      const now = performance.now();
      if (now >= holdUntil.current && now - lastChange > 110) {
        const next = inside ? selectPortraitPose(currentX, currentY, nearFace) : "neutral";
        if (next !== poseRef.current) { displayPose(next); lastChange = now; }
      }
      if (Math.abs(targetX-currentX) + Math.abs(targetY-currentY) > 0.003) raf = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (event: PointerEvent) => {
      if (!active || event.pointerType === "touch") return;
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const p = portraitPointer(event.clientX,event.clientY,box);
      targetX = p.x; targetY = p.y; nearFace = p.nearFace; inside = true; schedule();
    };
    const reset = () => {
      inside = false; nearFace = false; targetX = targetY = 0; holdUntil.current = 0;
      if (timer.current) clearTimeout(timer.current);
      displayPose("neutral"); schedule();
    };
    reset();
    stage.addEventListener("pointermove",move,{passive:true});
    stage.addEventListener("pointerleave",reset);
    stage.addEventListener("pointercancel",reset);
    window.addEventListener("blur",reset);
    return () => {
      stage.removeEventListener("pointermove",move);
      stage.removeEventListener("pointerleave",reset);
      stage.removeEventListener("pointercancel",reset);
      window.removeEventListener("blur",reset);
      cancelAnimationFrame(raf);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [enabled,reducedMotion]);

  const greet = () => {
    if (!enabled || reducedMotion) return;
    if (timer.current) clearTimeout(timer.current);
    poseRef.current = "happy"; setPose("happy");
    holdUntil.current = performance.now() + 1100;
    timer.current = setTimeout(() => {holdUntil.current = 0; poseRef.current = "neutral"; setPose("neutral");},1100);
  };

  useEffect(() => { if (greeting > 0) greet(); }, [greeting]);

  return <button ref={root} type="button" className="interactive-portrait" data-pose={pose} data-motion-enabled={enabled && !reducedMotion} onClick={greet} aria-label="和张元通的黏土形象互动：移动鼠标看他转头，点击收获笑脸">
    <span className="portrait-body" aria-hidden="true"><img src={neutral} alt="" draggable={false}/></span>
    <span className="portrait-head" aria-hidden="true">{poses.map(p => <img key={p.name} src={p.src} alt="" draggable={false} className={pose === p.name ? "portrait-pose is-active" : "portrait-pose"} fetchPriority={p.name === "neutral" ? "high" : "auto"}/>)}</span>
  </button>;
}
