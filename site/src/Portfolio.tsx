import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, ArrowDown, X, Copy, Phone, Check, Menu } from "lucide-react";
import portrait from "./assets/portrait.webp";
import presenting from "./assets/portrait-presenting.webp";
import working from "./assets/portrait-working.webp";
import InteractivePortrait from "./InteractivePortrait";
import Atmosphere from "./Atmosphere";
import HeroStage from "./HeroStage";
import ScrollExperience, { ScrollWords } from "./ScrollExperience";
import PersonalRibbon from "./PersonalRibbon";
import PointerExperience from "./PointerExperience";
import LifeSection, { LifePhoto } from "./LifeSection";
import { interests, type Interest } from "./lifestyle";
import { profile, projects, portfolioSlots, focusAreas, type Project } from "./content";

type View = "home" | "about" | "life" | "folders" | "gallery" | "lab" | "contact";
const nav: [View,string][] = [["home","首页"],["about","关于我"],["life","生活切片"],["gallery","作品精选"],["folders","创作档案"],["lab","灵感实验室"],["contact","联系"]];
const filters=["全部",...new Set(projects.map(p=>p.category))];
const personalCount=projects.filter(p=>p.kind==="个人创作").length;
const studyCount=projects.filter(p=>p.kind==="概念研究").length;
const twoDigits=(n:number)=>String(n).padStart(2,"0");
const validView = (value:string): View => nav.some(([v])=>v===value) ? value as View : "home";

function Art({project:p,large=false}:{project:Project;large?:boolean}) {
  if(p.cover) return <div className={`art art-custom ${large ? "art-large" : ""}`}><img className="custom-cover" src={p.cover} alt={`${p.title}的作品封面`} draggable={false}/></div>;
  return <div className={`art art-${p.color} ${large ? "art-large" : ""}`}>
    {p.id===1 ? <><div className="art-title">另一个<br/>我<span>。</span></div><img src={portrait} alt="张元通的数字分身" draggable={false}/></> : p.id===2 ? <><div className="brand-mark">元</div><div className="brand-bottom"><strong>生而不同。<br/>表达自己。</strong></div></> : <><div className="process-study"><span>想法</span><span>形象</span><span>表达</span></div><strong className="idea-title">好想法，<br/>值得被看见。</strong></>}
  </div>;
}
function Character({pose="presenting"}:{pose?:"presenting"|"working";}) {
  return <figure className={`side-character character-${pose}`}><img src={pose==="presenting" ? presenting : working} alt={pose==="presenting" ? "张元通的数字分身，摊手介绍" : "张元通的数字分身，坐在椅子上使用电脑创作"} draggable={false}/></figure>;
}
function PageIntro({title,accent,description,heading="h1",headingId}:{title:string;accent:string;description:string;heading?:"h1"|"h2";headingId?:string}) {
  const Heading=heading;
  return <div className="page-heading"><Heading id={headingId}>{title}<br/><span>{accent}</span></Heading><ScrollWords text={description}/></div>;
}
function scrollToSection(id:string) {
  document.getElementById(id)?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"start"});
}
function AboutIntro({embedded=false,onContact}:{embedded?:boolean;onContact:()=>void}) {
  return <section id={embedded ? "discover" : undefined} aria-labelledby={embedded ? "home-about-title" : undefined} className={"inner-page split-intro about-page "+(embedded ? "home-scene home-about" : "")}>
    <div className="intro-copy"><PageIntro title="你好，我是张元通。" accent="好奇心，一直在线。" description={profile.bio} heading={embedded ? "h2" : "h1"} headingId={embedded ? "home-about-title" : undefined}/><div className="about-tags"><span>AI 探索</span><span>IP 打造</span><span>个人表达</span></div><button className="text-link" onClick={embedded ? ()=>scrollToSection("home-work") : onContact}>{embedded ? "继续看我的作品" : "从一句你好开始"}{embedded ? <ArrowDown size={17}/> : <ArrowUpRight size={18}/>}</button><div className="signature">Yuantong<span> / 保持好奇，持续创造。</span></div></div>
    <Character/>
  </section>;
}
function WorkIntro({embedded=false}:{embedded?:boolean}) {
  return <section id={embedded ? "home-work" : undefined} aria-labelledby={embedded ? "home-work-title" : undefined} className={"inner-page split-intro gallery-intro "+(embedded ? "home-scene home-work" : "")}>
    <div className="intro-copy"><PageIntro title="把想法，" accent="变成看得见的作品。" description="数字形象、个人品牌与创作实验。这里收录完成的创作，也保留还在探索的方向。" heading={embedded ? "h2" : "h1"} headingId={embedded ? "home-work-title" : undefined}/><div className="intro-footnote"><span className="index-number">{twoDigits(personalCount)}</span><span>件个人创作<br/><small>另有 {twoDigits(studyCount)} 组概念研究</small></span></div>{embedded && <button className="text-link browse-work" onClick={()=>scrollToSection("home-collection")}>向下浏览作品 <ArrowDown size={17}/></button>}</div>
    <Character pose="working"/>
  </section>;
}
function EmptySlots() {
  return <div className="future-projects">{portfolioSlots.map(slot=><article className="project-placeholder" key={slot.number}><h3>{slot.title}</h3><p>{slot.detail}</p><span className="slot-fields">{slot.fields}</span><span className="status-label">待补充</span></article>)}</div>;
}

function FocusSection({embedded=false}:{embedded?:boolean}) {
  const Heading=embedded ? "h3" : "h2";
  return <section className={"content-section light-section "+(embedded ? "home-focus" : "")}><div className="section-topline"><span>三个关注方向</span></div><div className="focus-grid">{focusAreas.map(item=><article key={item.number}><span className="index-number">{item.number}</span><Heading>{item.title}</Heading><p>{item.text}</p></article>)}</div></section>;
}

function WorkCollection({filter,onFilter,onProject,embedded=false}:{filter:string;onFilter:(filter:string)=>void;onProject:(project:Project)=>void;embedded?:boolean}) {
  const Heading=embedded ? "h3" : "h2";
  return <section id={embedded ? "home-collection" : undefined} className="content-section work-section"><div className="work-toolbar"><span className="collection-count">共 {projects.length} 项创作与研究</span><div className="filter" aria-label="筛选作品">{filters.map(f=><button key={f} className={filter===f ? "selected" : ""} aria-pressed={filter===f} onClick={()=>onFilter(f)}>{f}<sup>{twoDigits(f==="全部" ? projects.length : projects.filter(p=>p.category===f).length)}</sup></button>)}</div></div><div className={`gallery-grid ${filter==="全部" ? "stacked-projects" : ""}`}>{projects.filter(p=>filter==="全部" || p.category===filter).map((p,i)=><button style={{"--card-index":i} as CSSProperties} key={p.id} className={`gallery-card ${p.id===1 && filter==="全部" ? "gallery-lead" : ""}`} onClick={()=>onProject(p)}><Art project={p}/><div className="card-heading"><div><Heading>{p.title}</Heading></div><ArrowUpRight size={23} strokeWidth={1}/></div><p>{p.category}<span>{p.kind} / {p.year || "持续探索"}</span></p></button>)}</div><div className="section-divider"><span>为新的作品留白</span></div><EmptySlots/></section>;
}

export default function Portfolio() {
  const [view,setView]=useState<View>(()=>validView(window.location.hash.slice(1)));
  const [project,setProject]=useState<Project|null>(null);
  const [interest,setInterest]=useState<Interest|null>(null);
  const [contact,setContact]=useState(false);
  const [copied,setCopied]=useState(false);
  const [copyError,setCopyError]=useState(false);
  const [filter,setFilter]=useState("全部");
  const [menu,setMenu]=useState(false);
  const [tone,setTone]=useState(0);
  const [motion,setMotion]=useState(true);
  const dialog=useRef<HTMLDialogElement>(null);
  const closeButton=useRef<HTMLButtonElement>(null);
  const modal=!!project || !!interest || contact;
  const go=(next:View)=>{
    if(next!==view) history.pushState(null,"",`#${next}`);
    setView(next);setMenu(false);setCopied(false);setCopyError(false);window.scrollTo({top:0,behavior:"instant"});
  };
  useEffect(()=>{
    const sync=()=>{setView(validView(location.hash.slice(1)));setMenu(false);window.scrollTo({top:0,behavior:"instant"});};
    window.addEventListener("popstate",sync);window.addEventListener("hashchange",sync);
    return ()=>{window.removeEventListener("popstate",sync);window.removeEventListener("hashchange",sync);};
  },[]);
  useEffect(()=>{document.title=`${nav.find(([v])=>v===view)?.[1]} — 张元通 Yuantong.`;},[view]);
  useEffect(()=>{
    if(modal) {dialog.current?.showModal();document.body.style.overflow="hidden";closeButton.current?.focus();}
    else {dialog.current?.close();document.body.style.overflow="";}
    return ()=>{document.body.style.overflow="";};
  },[modal]);
  const close=()=>{setProject(null);setInterest(null);setContact(false);setCopied(false);setCopyError(false);};
  async function copy() {try {await navigator.clipboard.writeText(profile.phone);setCopied(true);setCopyError(false);} catch {setCopyError(true);}}
  const contactDetails=<><a className="phone-number" href={`tel:${profile.phone}`}>156 1554 3731 <ArrowUpRight size={25} strokeWidth={1}/></a><div className="contact-actions"><button className="pill" onClick={copy}>{copied ? "号码已复制" : "复制联系电话"}<span>{copied ? <Check size={17}/> : <Copy size={17}/>}</span></button><a className="text-link" href={`tel:${profile.phone}`}>直接拨打 <Phone size={15}/></a></div><p className="contact-hint" role="status">{copied ? "号码已复制，期待和你聊聊。" : copyError ? "请选中上方号码，手动复制。" : "关于 AI、个人 IP，或者一个还没成形的想法。"}</p></>;

  return <div className={`site studio-site tone-${tone} ${motion ? "" : "motion-off"} ${view==="home" ? "home-experience" : ""}`}>
    <a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById("main-content")?.focus();}}>跳到主要内容</a><div className="film-grain" aria-hidden="true"/><ScrollExperience page={view} enabled={motion}/><PointerExperience enabled={motion} page={view} paused={modal || menu}/>{view==="home" && <Atmosphere enabled={motion && !modal && !menu}/>}
    <header className="header"><button className="wordmark" onClick={()=>go("home")} aria-label="张元通，回到首页">Yuantong<span>.</span></button><nav aria-label="主导航" className={menu ? "nav is-open" : "nav"}>{nav.map(([v,t])=><button key={v} className={view===v ? "active" : ""} onClick={()=>go(v)} aria-current={view===v ? "page" : undefined}>{t}</button>)}</nav><div className="header-right"><button className="round-button" onClick={()=>go("contact")} aria-label="前往联系页面"><ArrowUpRight size={18}/></button><button className="mobile-menu" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="切换导航">{menu ? <X size={20}/> : <Menu size={20}/>}</button></div></header>

    {view==="home" && <main tabIndex={-1} id="main-content" key="home" className="page-enter">
      <HeroStage enabled={motion} paused={modal||menu} onMotion={()=>setMotion(!motion)} onContact={()=>go("contact")} onExplore={()=>scrollToSection("discover")} onLife={()=>scrollToSection("home-life")}/>
      <PersonalRibbon onPhoto={setInterest}/>
      <AboutIntro embedded onContact={()=>go("contact")}/>
      <WorkIntro embedded/>
      <WorkCollection embedded filter={filter} onFilter={setFilter} onProject={setProject}/>
      <LifeSection embedded onPhoto={setInterest}/>
    </main>}

    {view==="about" && <main tabIndex={-1} id="main-content" key="about" className="page-enter">
      <AboutIntro onContact={()=>go("contact")}/>
      <section className="content-section about-life-note"><div><h2>生活，是另一种灵感。</h2><p>喜欢驾驶的乐趣，也喜欢在允许的范围内体验不同车型。休闲时打打台球、喝喝茶，平日里也自己下厨做做饭，偶尔小酌，为日常添一点乐趣。</p><button className="text-link" onClick={()=>go("life")}>走进我的生活切片 <ArrowUpRight size={17}/></button></div><div className="about-life-photos">{interests.map(item=><button key={item.id} className={`about-photo-${item.id}`} onClick={()=>setInterest(item)} aria-label={`查看${item.label}配图`}><img src={item.smallImage} alt={item.alt} width="768" height="512" loading="lazy" decoding="async"/><span>{item.label}</span></button>)}</div></section>
      <FocusSection/>
      <section className="content-section journey-section"><div><h2>经历会继续，<br/><span>故事慢慢写。</span></h2></div><div className="journey-list"><article><span>现在</span><div><h3>从自己的数字分身开始</h3><p>把 AI 视觉与个人表达放在一起，搭建一个属于自己的创作空间。</p></div></article><article className="unfinished"><span>以后</span><div><h3>下一段经历，留给未来。</h3><p>这里预留给个人履历、代表经历与新的里程碑。</p><span className="status-label">待补充</span></div></article></div></section>
    </main>}

    {view==="life" && <main tabIndex={-1} id="main-content" key="life" className="page-enter"><LifeSection onPhoto={setInterest}/></main>}

    {view==="gallery" && <main tabIndex={-1} id="main-content" key="gallery" className="page-enter"><WorkIntro/>
      <WorkCollection filter={filter} onFilter={setFilter} onProject={setProject}/>
    </main>}

    {view==="folders" && <main tabIndex={-1} id="main-content" key="folders" className="page-enter"><section className="inner-page split-intro archive-intro"><div className="intro-copy"><PageIntro title="每一个想法，" accent="都有迹可循。" description="收好创作的起点、过程与结果。它们不必一次完整，但每一步都值得被记录。"/><div className="archive-categories"><span>01 形象</span><span>02 品牌</span><span>03 实验</span></div></div><Character pose="working"/></section><section className="content-section archive-section"><div className="section-topline"><span>{projects.length} 项创作与研究</span></div><div className="archive-list">{projects.map(p=><button key={p.id} className="archive-row" onClick={()=>setProject(p)}><span className="archive-number">0{p.id}</span><div className="archive-thumb"><Art project={p}/></div><div className="archive-name"><h2>{p.title}</h2></div><span className="archive-category">{p.category}</span><span className="archive-kind">{p.kind}</span><ArrowUpRight size={24} strokeWidth={1}/></button>)}</div><div className="archive-empty"><div><h3>下一次创作，正在路上。</h3><p>未来的案例、创作手记与过程记录，将陆续收录在这里。</p></div><span className="status-label">持续更新</span></div></section></main>}

    {view==="lab" && <main tabIndex={-1} id="main-content" key="lab" className="page-enter"><section className="inner-page split-intro lab-page"><div className="intro-copy"><PageIntro title="认真创作，" accent="也留一点好玩。" description="把新工具、新媒介与小小的好奇心放在一起。这里是想法成形前的练习场。"/><fieldset className="tone-picker"><legend>选择空间的色调 </legend>{["石墨黑","深海蓝","暖砂棕"].map((name,i)=><button key={name} className={`swatch swatch-${i} ${tone===i ? "chosen" : ""}`} aria-label={name} aria-pressed={tone===i} onClick={()=>setTone(i)}>{tone===i && <Check size={14}/>}<span>{name}</span></button>)}</fieldset><button className={`motion-toggle ${motion ? "on" : ""}`} onClick={()=>setMotion(!motion)} aria-pressed={motion}><span><i/></span>动态互动 {motion ? "已开启" : "已关闭"}</button><p className="setting-note">鼠标移回人物中央时回正，自然回到正面。</p></div><Character pose="working"/></section><section className="content-section lab-exhibits"><div className="portrait-exhibit"><div className="exhibit-copy"><h2>换个角度，<br/>还是我。</h2><p>移动鼠标，观察人物的上下左右变化。<br/>移回中央，回到自然的正面。</p><span className="exhibit-status"><i/>{motion ? "四向跟随已开启" : "静态展示"}</span></div><div className="lab-stage" data-portrait-stage><InteractivePortrait enabled={motion && !modal}/></div></div><div className="lab-bottom"><article><h3>让光线，回应你。</h3><p>移动鼠标，拨动悬浮物与星尘；长按首页空白处，感受空间慢慢展开。</p><button className="text-link" onClick={()=>go("home")}>回首页体验 <ArrowUpRight size={17}/></button></article><article className="unfinished"><h3>下一个灵感，还没有名字。</h3><p>预留给新的交互、影像实验或 AI 创作记录。</p><span className="status-label">待补充</span></article></div></section></main>}

    {view==="contact" && <main tabIndex={-1} id="main-content" key="contact" className="page-enter"><section className="inner-page split-intro contact-page"><div className="intro-copy"><PageIntro title="一个好想法，" accent="从一次对话开始。" description="欢迎聊聊新的创作、个人表达，或者你正在探索的方向。"/>{contactDetails}<div className="contact-extra"><p>更多社交平台与作品链接，后续补充。</p></div></div><Character/></section><section className="content-section conversation-section"><h2>我们可以从这些话题聊起。</h2><div className="conversation-topics">{focusAreas.map(area=><span key={area.number}>{area.title}<ArrowUpRight size={16}/></span>)}</div></section></main>}

    {view!=="contact" && <section className="contact-strip"><div><h2>让下一次创作，<span>从这里开始。</span></h2></div><button onClick={()=>go("contact")} aria-label="前往联系页面"><ArrowUpRight size={36} strokeWidth={1}/></button></section>}
    <footer><div className="footer-top"><button className="wordmark" onClick={()=>go("home")}>Yuantong<span>.</span></button><button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>回到顶部 <ArrowUpRight size={16}/></button></div><div className="footer-bottom"><span>© 2026 张元通</span><span>保持好奇，持续创造。</span><button onClick={()=>go("contact")}>联系我 <ArrowUpRight size={14}/></button></div></footer>

    <dialog ref={dialog} onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}} className={interest ? "life-dialog" : contact ? "contact-dialog" : "project-dialog"} aria-labelledby="dialog-title"><button className="dialog-close" onClick={close} ref={closeButton} aria-label="关闭弹窗"><X size={21}/></button>{interest && <><LifePhoto item={interest} large/><div className="life-dialog-copy"><h2 id="dialog-title">{interest.title}</h2><p>{interest.description}</p><span className="life-dialog-credit">{interest.credit || "生活意境配图 · AI 生成"}</span></div></>}{project && <><Art project={project} large/><div className="project-detail"><h2 id="dialog-title">{project.title}</h2><p className="detail-intro">{project.intro}</p><dl className="project-facts"><div><dt>创作方向</dt><dd>{project.category}</dd></div><div><dt>参与内容</dt><dd>{project.role}</dd></div><div><dt>项目时间</dt><dd>{project.year || "持续探索"}</dd></div></dl><div className="project-story"><article><h3>探索的过程</h3><p>{project.process}</p></article><article><h3>这次表达</h3><p>{project.outcome}</p></article></div><div className="project-tags">{project.tags.map(t=><span key={t}>{t}</span>)}</div>{project.url && <a className="text-link" href={project.url} target="_blank" rel="noreferrer">访问项目 <ArrowUpRight size={17}/></a>}<div className="detail-bottom"><span>{project.kind}</span><button className="text-link" onClick={()=>{setProject(null);setContact(true);}}>聊聊类似的想法 <ArrowUpRight size={17}/></button></div></div></>}{contact && <div className="contact-content"><h2 id="dialog-title">一起，让想法<br/>有自己的<span>样子。</span></h2><p>张元通 / AI × IP 创作</p>{contactDetails}</div>}</dialog>
  </div>;
}
