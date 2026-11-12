import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import InteractivePortrait from "./InteractivePortrait";
import type { createStudioScene } from "./create-studio-scene";

let entered=false;
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(a:number,b:number,n:number)=>{const p=clamp((n-a)/(b-a));return p*p*(3-2*p);};
type Studio=ReturnType<typeof createStudioScene>;

export default function HeroStage({enabled,paused,onMotion,onContact,onExplore,onLife}:{enabled:boolean;paused:boolean;onMotion:()=>void;onContact:()=>void;onExplore:()=>void;onLife:()=>void}) {
  const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null);
  const replay=useRef<()=>void>(()=>{}),skip=useRef<()=>void>(()=>{});
  const wake=useRef<()=>void>(()=>{}),playOnMount=useRef(!entered);
  const [arriving,setArriving]=useState(false);
  const [reduced,setReduced]=useState(()=>matchMedia("(prefers-reduced-motion: reduce)").matches);
  const pauseRef=useRef(paused);pauseRef.current=paused;
  useEffect(()=>{if(!paused)wake.current();},[paused]);
  useEffect(()=>{const q=matchMedia("(prefers-reduced-motion: reduce)");const sync=()=>setReduced(q.matches);q.addEventListener("change",sync);return()=>q.removeEventListener("change",sync);},[]);
  useEffect(()=>{
    const el=root.current,cv=canvas.current;if(!el||!cv)return;
    if(!enabled||reduced){el.style.setProperty("--arrival","1");el.style.setProperty("--flight","0");el.dataset.renderer="static";setArriving(false);return;}
    let stopped=false,frame=0,last=0,time=0,start=0,intro=1,scroll=0,x=0,y=0,tx=0,ty=0,visible=true,scene:Studio|undefined;
    let playing=playOnMount.current;entered=true;
    if(playing){intro=0;setArriving(true);}else setArriving(false);
    el.style.setProperty("--arrival",String(intro));
    const settle=()=>{playing=false;intro=1;setArriving(false);el.style.setProperty("--arrival","1");};
    skip.current=settle;
    replay.current=()=>{window.scrollTo({top:0,behavior:"instant"});scroll=0;start=performance.now();intro=0;playing=true;setArriving(true);el.style.setProperty("--arrival","0");resume();};
    const move=(e:PointerEvent)=>{if(e.pointerType==="touch")return;const r=el.getBoundingClientRect();tx=(e.clientX/r.width-.5)*2;ty=((e.clientY-r.top)/innerHeight-.5)*2;};
    const leave=()=>{tx=ty=0;};
    const down=(e:PointerEvent)=>{if(e.button!==0||!(e.target instanceof Element)||e.target.closest("button,a,input"))return;scene?.burst();};
    const onScroll=()=>{if(playing&&window.scrollY>80)settle();resume();};
    const draw=(now:number)=>{
      frame=0;if(stopped||document.hidden||!visible)return;
      const dt=last?Math.min(now-last,50):16.7;last=now;
      if(pauseRef.current){if(playing)settle();return;}
      time+=dt;
      if(playing){intro=clamp((now-start)/2800);if(intro>=1)settle();}
      const r=el.getBoundingClientRect(),target=clamp(-r.top/Math.max(1,el.offsetHeight-innerHeight));
      const ease=1-Math.exp(-dt/135);scroll+=(target-scroll)*ease;x+=(tx-x)*ease*.6;y+=(ty-y)*ease*.6;
      const arrival=smooth(0,1,intro);
      el.style.setProperty("--arrival",arrival.toFixed(4));el.style.setProperty("--flight",scroll.toFixed(4));
      el.style.setProperty("--pointer-x",x.toFixed(4));el.style.setProperty("--pointer-y",y.toFixed(4));
      const energy=Number(getComputedStyle(el.closest(".site")!).getPropertyValue("--immersion"))||0;
      scene?.render({time,arrival,scroll,x,y,energy});
      frame=requestAnimationFrame(draw);
    };
    function resume(){if(!stopped&&!frame&&!document.hidden&&visible){last=0;frame=requestAnimationFrame(draw);}}
    wake.current=resume;
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else {if(playing)settle();resume();}};
    const site=el.closest<HTMLElement>(".site")!;
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;site.dataset.heroVisible=String(visible);if(visible)resume();else{cancelAnimationFrame(frame);frame=0;if(playing)settle();}},{threshold:0});observer.observe(el);
    const contextLost=()=>{el.dataset.renderer="unavailable";settle();};cv.addEventListener("webglcontextlost",contextLost);
    const deadline=window.setTimeout(()=>{if(!scene&&!stopped){settle();el.dataset.renderer="unavailable";}},3000);
    void import("./create-studio-scene").then(module=>{
      if(stopped)return;
      try {scene=module.createStudioScene(cv);el.dataset.renderer="webgl";}catch{el.dataset.renderer="unavailable";settle();}
      clearTimeout(deadline);start=performance.now();resume();
    }).catch(()=>{if(!stopped){clearTimeout(deadline);settle();el.dataset.renderer="unavailable";resume();}});
    el.addEventListener("pointermove",move,{passive:true});el.addEventListener("pointerleave",leave);el.addEventListener("pointerdown",down);
    window.addEventListener("scroll",onScroll,{passive:true});document.addEventListener("visibilitychange",visibility);
    return()=>{stopped=true;cancelAnimationFrame(frame);clearTimeout(deadline);observer.disconnect();delete site.dataset.heroVisible;cv.removeEventListener("webglcontextlost",contextLost);scene?.dispose();el.removeEventListener("pointermove",move);el.removeEventListener("pointerleave",leave);el.removeEventListener("pointerdown",down);window.removeEventListener("scroll",onScroll);document.removeEventListener("visibilitychange",visibility);};
  },[enabled,reduced]);
  return <section className={`hero-flight ${arriving ? "is-arriving" : ""}`} ref={root} aria-label="张元通的个人创作空间">
    <div className="hero constellation-hero" data-portrait-stage>
      <div className="studio-aurora" aria-hidden="true"/><canvas key={`${enabled}-${reduced}`} className="studio-canvas" ref={canvas} aria-hidden="true"/>
      <div className="studio-fallback" aria-hidden="true"><i/><i/></div>
      <div className="hero-introduction"><span className="hero-hello">你好，我是张元通</span><h1>YUANTONG<span>.</span></h1></div>
      <div className="hero-person"><InteractivePortrait enabled={enabled&&!paused&&!arriving}/></div>
      <div className="hero-caption"><h2>用 AI 释放创造力，<br/>用 IP 让你被记住。</h2><p>认真创作，也认真生活。</p><button className="hero-life-link" onClick={onLife}>看看我的日常 <ArrowUpRight size={14}/></button></div>
      <div className="hero-contact-block"><button className="hero-contact" onClick={onContact}>聊聊你的想法 <ArrowUpRight size={20}/></button></div>
      <div className="flight-statement" aria-hidden="true">创作有形，<br/><span>生活有趣。</span></div>
      <div className="hero-bottom"><button className="scroll-invite" onClick={onExplore}><span className="scroll-pill"><ArrowDown size={14}/></span>向下探索</button><span className="hero-interaction-hint">移动鼠标，拨动光与灵感</span><div className="hero-playback">{enabled&&!reduced&&<button onClick={()=>arriving?skip.current():replay.current()}>{arriving ? <>跳过入场 <ArrowUpRight size={13}/></> : <><RotateCcw size={13}/>重播入场</>}</button>}<button onClick={onMotion} aria-label={enabled?"关闭动态效果":"开启动效"} aria-pressed={enabled}>{enabled?<Pause size={14}/>:<Play size={14}/>}</button></div></div>
    </div>
  </section>;
}
