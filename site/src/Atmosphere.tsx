import { useEffect, useRef, useState } from "react";

type Ripple={x:number;y:number;born:number;strength:number};
type Dust={x:number;y:number;vx:number;vy:number;born:number};

/** A viewport-sized canvas covers the complete homepage, including every scroll section. */
export default function Atmosphere({enabled}:{enabled:boolean}) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const energy=useRef(0);
  const latched=useRef(false);
  const [exploring,setExploring]=useState(false);
  const [allowed,setAllowed]=useState(false);
  useEffect(()=>{
    const query=matchMedia("(prefers-reduced-motion: reduce)");
    const change=()=>setAllowed(enabled&&!query.matches);
    change();query.addEventListener("change",change);
    return ()=>query.removeEventListener("change",change);
  },[enabled]);
  useEffect(()=>{latched.current=exploring;},[exploring]);
  useEffect(()=>{if(!allowed){setExploring(false);latched.current=false;energy.current=0;}},[allowed]);
  useEffect(()=>{
    const el=canvas.current, site=el?.closest<HTMLElement>(".site");
    const ctx=el?.getContext("2d",{alpha:true});
    if(!el||!site||!ctx||!allowed) return;
    let frame=0,width=0,height=0,last=0,lastRipple=0,pressing=false,pressStart=0,hasPointer=false;
    let tx=.5,ty=.5,x=.5,y=.5,lastX=-1000,lastY=-1000;
    const ripples:Ripple[]=[],dust:Dust[]=[];
    const stars=Array.from({length:90},(_,i)=>({x:((i*73.137+17)%101)/101,y:((i*37.791+7)%103)/103,z:.25+((i*13.7)%10)/10,phase:i*1.618}));
    const resize=()=>{
      width=el.clientWidth;height=el.clientHeight;
      const dpr=Math.min(devicePixelRatio||1,2);
      el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    const ripple=(px:number,py:number,strength=1)=>{
      if(ripples.length>=18) ripples.shift();
      ripples.push({x:px,y:py,born:performance.now(),strength});
    };
    const move=(event:PointerEvent)=>{
      if(event.pointerType==="touch") return;
      tx=event.clientX/width;ty=event.clientY/height;hasPointer=true;
      const now=performance.now(),distance=Math.hypot(event.clientX-lastX,event.clientY-lastY);
      if(distance>12){
        if(dust.length>=70) dust.shift();
        dust.push({x:event.clientX,y:event.clientY,vx:Math.sin(now)*10,vy:-10-Math.abs(Math.cos(now))*10,born:now});
        if(now-lastRipple>100){ripple(event.clientX,event.clientY,.7);lastRipple=now;}
        lastX=event.clientX;lastY=event.clientY;
      }
    };
    const release=()=>{pressing=false;site.removeAttribute("data-holding");};
    const down=(event:PointerEvent)=>{
      if(event.button!==0||event.pointerType==="touch"||!(event.target instanceof Element)||event.target.closest('button,a,input,textarea,select,[contenteditable="true"]')) return;
      pressing=true;pressStart=performance.now();site.dataset.holding="true";
      tx=event.clientX/width;ty=event.clientY/height;hasPointer=true;
      ripple(event.clientX,event.clientY,1.8);
      for(let i=0;i<24;i++){
        const angle=i/24*Math.PI*2,speed=35+(i%5)*14;
        dust.push({x:event.clientX,y:event.clientY,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,born:performance.now()});
      }
      while(dust.length>100)dust.shift();
    };
    const reset=()=>{hasPointer=false;tx=ty=.5;release();};
    const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){latched.current=false;setExploring(false);release();}};
    const draw=(now:number)=>{
      frame=0;if(document.hidden) return;
      if(last&&now-last<15){frame=requestAnimationFrame(draw);return;}
      const dt=last?Math.min(now-last,50):16.67;last=now;
      const target=latched.current||(pressing&&now-pressStart>170)?1:0;
      energy.current+=(target-energy.current)*(1-Math.exp(-dt/(target?260:420)));
      if(Math.abs(target-energy.current)<.0005)energy.current=target;
      x+=(tx-x)*(1-Math.exp(-dt/210));y+=(ty-y)*(1-Math.exp(-dt/210));
      site.style.setProperty("--immersion",energy.current.toFixed(4));
      ctx.clearRect(0,0,width,height);
      const t=now*.001,e=energy.current;
      const glow=ctx.createRadialGradient(x*width,y*height,0,x*width,y*height,Math.max(width,height)*.55);
      glow.addColorStop(0,`rgba(173,169,228,${(hasPointer ? .07 : .025)+e*.07})`);glow.addColorStop(1,"rgba(173,169,228,0)");
      ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
      const count=width<760?45:stars.length;
      for(let i=0;i<count;i++){
        const star=stars[i],spread=1+e*.3;
        const px=width/2+(star.x*width-width/2)*spread-(x-.5)*star.z*36;
        const py=height/2+(star.y*height-height/2)*spread-(y-.5)*star.z*28+Math.sin(t*.3+star.phase)*4;
        const alpha=.12+(Math.sin(t*.7+star.phase)+1)*.11+e*.16;
        ctx.fillStyle=`rgba(223,225,255,${alpha})`;ctx.beginPath();ctx.arc(px,py,star.z*.85,0,Math.PI*2);ctx.fill();
        if(e>.02){ctx.strokeStyle=`rgba(195,186,245,${e*.3})`;ctx.lineWidth=.75;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+(px-width/2)*e*.075,py+(py-height/2)*e*.075);ctx.stroke();}
      }
      for(let i=dust.length-1;i>=0;i--){
        const p=dust[i],age=(now-p.born)/1000;if(age>1.1){dust.splice(i,1);continue;}
        ctx.fillStyle=`rgba(226,208,255,${Math.pow(1-age/1.1,2)*.65})`;
        ctx.beginPath();ctx.arc(p.x+p.vx*age,p.y+p.vy*age+age*age*15,Math.max(.2,1.4-age),0,Math.PI*2);ctx.fill();
      }
      for(let i=ripples.length-1;i>=0;i--){
        const p=ripples[i],age=(now-p.born)/1000;if(age>2.2){ripples.splice(i,1);continue;}
        const alpha=Math.pow(1-age/2.2,2)*p.strength*.23;
        ctx.strokeStyle=`rgba(192,182,239,${alpha})`;ctx.lineWidth=.8;
        ctx.beginPath();ctx.ellipse(p.x,p.y,7+age*90,4+age*38,0,0,Math.PI*2);ctx.stroke();
      }
      frame=requestAnimationFrame(draw);
    };
    const resume=()=>{if(!document.hidden&&!frame){last=0;frame=requestAnimationFrame(draw);}};
    const visibility=()=>{reset();if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();};
    const scroll=()=>{release();};
    const observer=new ResizeObserver(resize);observer.observe(el);resize();
    site.addEventListener("pointermove",move,{passive:true});site.addEventListener("pointerdown",down);site.addEventListener("pointerleave",reset);
    window.addEventListener("pointerup",release);window.addEventListener("pointercancel",release);window.addEventListener("blur",reset);window.addEventListener("scroll",scroll,{passive:true});
    window.addEventListener("keydown",escape);document.addEventListener("visibilitychange",visibility);resume();
    return ()=>{
      cancelAnimationFrame(frame);observer.disconnect();release();ctx.clearRect(0,0,width,height);site.style.removeProperty("--immersion");
      site.removeEventListener("pointermove",move);site.removeEventListener("pointerdown",down);site.removeEventListener("pointerleave",reset);
      window.removeEventListener("pointerup",release);window.removeEventListener("pointercancel",release);window.removeEventListener("blur",reset);window.removeEventListener("scroll",scroll);
      window.removeEventListener("keydown",escape);document.removeEventListener("visibilitychange",visibility);
    };
  },[allowed]);
  return <><canvas ref={canvas} className="atmosphere-canvas" aria-hidden="true"/>{allowed&&<div className="experience-controls"><span className="experience-note">长按空白处探索</span><button className="experience-toggle" aria-pressed={exploring} onClick={()=>setExploring(!exploring)}>{exploring?"退出探索":"沉浸探索"}<span aria-hidden="true">↗</span></button></div>}</>;
}
