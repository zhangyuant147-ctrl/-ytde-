import { useEffect } from "react";

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export default function ScrollExperience({page,enabled}:{page:string;enabled:boolean}) {
  useEffect(()=>{
    const site=document.querySelector<HTMLElement>(".site");if(!site)return;
    const query=matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup=()=>{};
    const setup=()=>{
      cleanup();if(!enabled||query.matches)return;
      const targets=[...site.querySelectorAll<HTMLElement>(".page-heading,.side-character,.life-heading,.life-story,.about-life-note,.focus-grid article,.journey-list article,.project-placeholder,.archive-row,.lab-bottom article,.contact-strip")];
      targets.forEach((element,i)=>{element.classList.add("scroll-reveal");element.style.setProperty("--reveal-delay",`${Math.min(i%3,2)*70}ms`);});
      const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add("is-revealed");observer.unobserve(entry.target);}}},{threshold:.08,rootMargin:"0px 0px -20px 0px"});
      targets.forEach(element=>observer.observe(element));
      const words=[...site.querySelectorAll<HTMLElement>(".scroll-words")];
      const ribbon=site.querySelector<HTMLElement>(".personal-ribbon");
      let frame=0;
      const update=()=>{
        frame=0;const height=innerHeight;
        for(const paragraph of words){const box=paragraph.getBoundingClientRect();const p=clamp((height*.85-box.top)/(height*.65+box.height));const letters=paragraph.querySelectorAll<HTMLElement>(".scroll-letter");letters.forEach((letter,i)=>letter.style.opacity=String(.22+.78*clamp(p*1.7-i/letters.length*.7)));}
        let offset=0;
        for(const card of site.querySelectorAll<HTMLElement>(".stacked-projects>.gallery-card")){const parent=card.parentElement!;const normalTop=parent.getBoundingClientRect().top+offset;const p=clamp((64-normalTop)/height);card.style.setProperty("--stack-scale",String(1-p*.045));card.style.setProperty("--stack-shade",String(p*.22));offset+=card.offsetHeight+parseFloat(getComputedStyle(card).marginBottom||"0");}
        if(ribbon){const box=ribbon.getBoundingClientRect();const p=clamp((height-box.top)/(height+box.height));ribbon.style.setProperty("--ribbon-offset",`${(p-.5)*-220}px`);}
        const scrollable=document.documentElement.scrollHeight-height;
        site.style.setProperty("--page-progress",String(scrollable>0?scrollY/scrollable:0));
      };
      const schedule=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(update);};
      window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);schedule();
      cleanup=()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);targets.forEach(element=>{element.classList.remove("scroll-reveal","is-revealed");element.style.removeProperty("--reveal-delay");});words.forEach(p=>p.querySelectorAll<HTMLElement>(".scroll-letter").forEach(l=>l.style.removeProperty("opacity")));site.querySelectorAll<HTMLElement>(".gallery-card").forEach(c=>{c.style.removeProperty("--stack-scale");c.style.removeProperty("--stack-shade");});ribbon?.style.removeProperty("--ribbon-offset");};
    };
    setup();query.addEventListener("change",setup);
    return()=>{cleanup();query.removeEventListener("change",setup);};
  },[page,enabled]);
  return <div className="reading-progress" aria-hidden="true"/>;
}

export function ScrollWords({text}:{text:string}) {
  return <p className="scroll-words"><span className="sr-only">{text}</span><span aria-hidden="true">{Array.from(text).map((letter,i)=><span className="scroll-letter" key={i}>{letter}</span>)}</span></p>;
}
