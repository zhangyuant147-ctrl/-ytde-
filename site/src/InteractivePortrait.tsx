import { useEffect, useRef, useState } from "react";
import { portraitPointer, selectPortraitPose, type PortraitPose } from "./portrait-motion";
import neutral from "./expressions/neutral.webp";
import left from "./expressions/left.webp";
import right from "./expressions/right.webp";
import up from "./expressions/up.webp";
import down from "./expressions/down.webp";

const poses: {name: PortraitPose; src: string}[] = [
  {name:"neutral",src:neutral},{name:"left",src:left},{name:"right",src:right},
  {name:"up",src:up},{name:"down",src:down},
];

export default function InteractivePortrait({enabled = true}: {enabled?: boolean}) {
  const root = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(query.matches);
    change(); query.addEventListener("change",change);
    return () => query.removeEventListener("change",change);
  },[]);
  useEffect(() => {
    const el = root.current;
    const stage = el?.closest<HTMLElement>("[data-portrait-stage]");
    if (!el || !stage) return;
    const layers = Array.from(el.querySelectorAll<HTMLImageElement>(".portrait-pose"));
    let frame=0, last=0, x=0, y=0, tx=0, ty=0, inside=false;
    let pose: PortraitPose="neutral";
    const weights=poses.map(p=>p.name==="neutral" ? 1 : 0);
    const active=enabled && !reducedMotion;
    const tick=(time:number) => {
      frame=0;
      const dt=last ? Math.min(time-last,40) : 16.67; last=time;
      const ease=1-Math.exp(-dt/135);
      x+=(tx-x)*ease; y+=(ty-y)*ease;
      pose=inside ? selectPortraitPose(x,y,pose) : "neutral";
      el.dataset.pose=pose;
      el.style.setProperty("--head-x",`${(x*1.4).toFixed(3)}deg`);
      el.style.setProperty("--head-y",`${(-y*1.1).toFixed(3)}deg`);
      let unsettled=Math.abs(tx-x)+Math.abs(ty-y)>.001;
      for(let i=0;i<layers.length;i++) {
        const target=poses[i].name===pose ? 1 : 0;
        weights[i]+=(target-weights[i])*(1-Math.exp(-dt/95));
        if(Math.abs(target-weights[i])<.001) weights[i]=target;
        else unsettled=true;
        layers[i].style.opacity=String(weights[i]);
      }
      if(unsettled) frame=requestAnimationFrame(tick);
    };
    const schedule=()=>{if(!frame) {last=0;frame=requestAnimationFrame(tick);}};
    const move=(event:PointerEvent)=>{
      if(!active || event.pointerType==="touch") return;
      const box=el.getBoundingClientRect();
      if(!box.width || !box.height) return;
      const p=portraitPointer(event.clientX,event.clientY,box);
      tx=p.x;ty=p.y;inside=true;schedule();
    };
    const reset=()=>{inside=false;tx=ty=0;schedule();};
    el.dataset.pose="neutral";
    el.style.setProperty("--head-x","0deg");el.style.setProperty("--head-y","0deg");
    layers.forEach((layer,i)=>{layer.style.opacity=String(weights[i]);});
    if(active) {
      stage.addEventListener("pointermove",move,{passive:true});
      stage.addEventListener("pointerleave",reset);stage.addEventListener("pointercancel",reset);
      window.addEventListener("blur",reset);window.addEventListener("scroll",reset,{passive:true});
    }
    return ()=>{
      cancelAnimationFrame(frame);stage.removeEventListener("pointermove",move);
      stage.removeEventListener("pointerleave",reset);stage.removeEventListener("pointercancel",reset);
      window.removeEventListener("blur",reset);window.removeEventListener("scroll",reset);
    };
  },[enabled,reducedMotion]);
  return <div ref={root} className="interactive-portrait" role="img" data-pose="neutral" data-motion-enabled={enabled && !reducedMotion} aria-label="张元通的数字分身，随鼠标向上下左右转头，居中时回正">
    <span className="portrait-body" aria-hidden="true"><img src={neutral} alt="" draggable={false}/></span>
    <span className="portrait-head" aria-hidden="true">{poses.map(p=><img key={p.name} src={p.src} alt="" draggable={false} className="portrait-pose" style={{opacity:p.name==="neutral" ? 1 : 0}} fetchPriority={p.name==="neutral" ? "high" : "auto"}/>)}</span>
  </div>;
}
