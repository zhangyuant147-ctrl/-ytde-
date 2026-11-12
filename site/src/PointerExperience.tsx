import { useEffect, useRef } from "react";

/** A single, delegated pointer loop. React only renders the cursor once. */
export default function PointerExperience({ enabled, page, paused }: { enabled: boolean; page: string; paused: boolean }) {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ring = cursor.current;
    const site = ring?.closest<HTMLElement>(".site");
    if (!ring || !site || !enabled || paused) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (reduced.matches || !fine.matches) return;
      let frame = 0, last = 0, visible = false;
      let px = 0, py = 0, x = 0, y = 0, sx = 0, sy = 0;
      let scene: HTMLElement | null = null;
      let magnet: HTMLElement | null = null;
      let card: HTMLElement | null = null;
      let mx = 0, my = 0;
      const resetTargets = () => {
        magnet?.style.removeProperty("translate");
        card?.style.removeProperty("--tilt-x");
        card?.style.removeProperty("--tilt-y");
        magnet = card = null;
      };
      const tick = (time: number) => {
        const dt = Math.min((time - last) / 16.67 || 1, 3); last = time;
        const ease = 1 - Math.pow(.84, dt);
        x += (px - x) * ease; y += (py - y) * ease;
        ring.style.transform = `translate3d(${x}px,${y}px,0)`;
        if (scene) {
          sx += (mx - sx) * ease * .6; sy += (my - sy) * ease * .6;
          scene.style.setProperty("--scene-x", `${sx.toFixed(2)}px`);
          scene.style.setProperty("--scene-y", `${sy.toFixed(2)}px`);
        }
        frame = 0;
        if (visible && (Math.abs(px-x)+Math.abs(py-y)+Math.abs(mx-sx)+Math.abs(my-sy) > .05)) frame = requestAnimationFrame(tick);
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        px = event.clientX; py = event.clientY;
        if (!visible) { x = px; y = py; visible = true; }
        site.classList.add("pointer-active");
        const target = event.target instanceof Element ? event.target : null;
        const nextScene = target?.closest<HTMLElement>(".constellation-hero, .home-scene, #home-collection, .contact-strip, .lab-stage, .life-story") ?? null;
        if (scene !== nextScene) {
          scene?.style.removeProperty("--scene-x"); scene?.style.removeProperty("--scene-y");
          scene = nextScene; sx = sy = 0;
        }
        if (scene) {
          const box = scene.getBoundingClientRect();
          mx = ((px-box.left)/box.width-.5)*40;
          my = ((py-box.top)/box.height-.5)*30;
        } else { mx = my = 0; }
        const nextMagnet = target?.closest<HTMLElement>(".hero-contact, .round-button, .nav button, .text-link, .contact-strip>button, .experience-toggle, .filter button, .pill") ?? null;
        if (magnet !== nextMagnet) { magnet?.style.removeProperty("translate"); magnet = nextMagnet; }
        if (magnet) {
          const box = magnet.getBoundingClientRect();
          // offsetWidth and the previous translation keep the attraction bounded.
          const prior = getComputedStyle(magnet).translate.split(/\s+/).map(parseFloat);
          const dx = px - (box.left - (prior[0] || 0) + box.width/2);
          const dy = py - (box.top - (prior[1] || 0) + box.height/2);
          magnet.style.translate = `${Math.max(-10,Math.min(10,dx*.2))}px ${Math.max(-8,Math.min(8,dy*.2))}px`;
        }
        const nextCard = target?.closest<HTMLElement>(".feature-art, .gallery-card, .folder, .archive-row, .life-photo") ?? null;
        if (card !== nextCard) { card?.style.removeProperty("--tilt-x"); card?.style.removeProperty("--tilt-y"); card = nextCard; }
        if (card) {
          const box = card.getBoundingClientRect();
          card.style.setProperty("--tilt-x", `${-((py-box.top)/box.height-.5)*7}deg`);
          card.style.setProperty("--tilt-y", `${((px-box.left)/box.width-.5)*9}deg`);
        }
        const interactive = target?.closest("button, a");
        ring.dataset.mode = card ? "open" : interactive ? "link" : scene ? "scene" : "idle";
        const label = ring.querySelector("span");
        if (label) label.textContent = card ? "打开 ↗" : interactive ? "↗" : "";
        schedule();
      };
      const reset = () => { visible = false; site.classList.remove("pointer-active"); resetTargets(); scene?.style.removeProperty("--scene-x"); scene?.style.removeProperty("--scene-y"); cancelAnimationFrame(frame); frame = 0; };
      site.addEventListener("pointermove",move,{passive:true});
      site.addEventListener("pointerleave",reset);
      window.addEventListener("blur",reset);
      window.addEventListener("scroll",reset,{passive:true});
      cleanup = () => { reset(); site.removeEventListener("pointermove",move); site.removeEventListener("pointerleave",reset); window.removeEventListener("blur",reset); window.removeEventListener("scroll",reset); };
    };
    setup(); reduced.addEventListener("change",setup); fine.addEventListener("change",setup);
    return () => { cleanup(); reduced.removeEventListener("change",setup); fine.removeEventListener("change",setup); };
  }, [enabled, page, paused]);
  return <div ref={cursor} className="experience-cursor" aria-hidden="true"><i/><span/></div>;
}
