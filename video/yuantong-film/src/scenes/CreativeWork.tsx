import {CanvasImage,Easing,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Shell,ease,fit} from '../design';
import {getSafeArea} from '../safe-area';

// Adapted from chenyuxiaojin/cyxj-shots, replicas/83-three-step-path (MIT).
// Staggered rise, -7deg -> 0, .95 -> 1, blur -> sharp. See third-party/.
// Original commercial copy, poster images and audio are not used.
const works=[
 {kind:'个人创作',title:['一个人的','数字分身'],subtitle:'保留个性，探索另一种表达。',motif:'portrait'},
 {kind:'概念研究',title:['让个人品牌','长出形状'],subtitle:'把个人表达，变成鲜明印象。',motif:'brand'},
 {kind:'概念研究',title:['从一个想法','到一次看见'],subtitle:'让灵感，在创作中逐渐成形。',motif:'idea'},
] as const;
export const CreativeWork=()=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),safe=getSafeArea(width,height),u=width/1920;
 const gap=38*u,cardW=(safe.width-48*u-gap*2)/3,cardH=570*u,top=safe.y+224*u;
 return <Shell chapter="作品与概念研究" nativeLayout>
  <div data-safe-text style={{position:'absolute',left:safe.x+24*u,top:safe.y+30*u,width:safe.width-48*u,opacity:interpolate(f,[0,.65*fps],[0,1],ease),translate:interpolate(f,[0,.8*fps],['0px 22px','0px 0px'],ease)}}>
   <div style={{fontSize:25*u,color:C.muted,marginBottom:18*u}}>作品与探索</div>
   <div style={{fontSize:63*u,letterSpacing:-2*u,lineHeight:1.3}}>把想法，<span style={{color:C.gold}}>变成看得见的作品。</span></div>
  </div>
  {works.map((work,i)=>{
   const start=(.25+i*.5)*fps,settle=start+.7*fps;
   const focus=interpolate(f,[start,settle],[0,1],{...fit,easing:Easing.bezier(.22,1,.36,1)});
   const drift=interpolate(f,[settle,5.9*fps],[0,i===1?-9*u:-5*u],fit);
   const paper=i===1,base=paper?'#e5decf':'#25281f';
   return <div key={i} data-poster={i} style={{position:'absolute',left:safe.x+24*u+i*(cardW+gap),top,width:cardW,height:cardH,border:`1px solid ${C.gold}66`,boxSizing:'border-box',background:base,color:paper?C.dark:C.ink,boxShadow:'0 22px 50px #0005',borderRadius:4*u,overflow:'hidden',opacity:focus,translate:`0px ${(1-focus)*110*u+drift}px`,scale:.95+.05*focus,rotate:`${(1-focus)*-7}deg`,filter:`blur(${(1-focus)*9*u}px)`}}>
    <div style={{position:'absolute',inset:0,background:paper?'radial-gradient(ellipse at 15% 10%,#fff8,transparent 80%)':'radial-gradient(ellipse at 70% 15%,#acaa6c25,transparent 75%)'}}/>
    <div data-safe-text style={{position:'absolute',top:30*u,left:32*u,fontSize:23*u,color:paper?'#76725f':C.gold}}>{work.kind}</div>
    <div data-safe-text style={{position:'absolute',top:84*u,left:30*u,fontSize:52*u,letterSpacing:-2*u,lineHeight:1.25,fontWeight:650,zIndex:2}}>{work.title[0]}<br/>{work.title[1]}</div>
    <div style={{position:'absolute',left:0,right:0,top:224*u,height:269*u,overflow:'hidden'}}>
     {work.motif==='portrait'?<>
      <div style={{position:'absolute',width:225*u,height:225*u,left:95*u,top:28*u,border:`1px solid ${C.gold}55`,borderRadius:'50%'}}/>
      <CanvasImage name="网站数字形象" src={staticFile('portraits/neutral.webp')} premountFor={fps} style={{position:'absolute',width:310*u,height:388*u,objectFit:'contain',left:68*u,top:-8*u,translate:interpolate(f,[settle,6.6*fps],['0px 6px','0px -8px'],fit)}}/>
     </>:work.motif==='brand'?<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{position:'absolute',width:260*u,height:165*u,border:'1px solid #948a72',background:'#c6b99f',rotate:interpolate(f,[settle,6.6*fps],['-16deg','-11deg'],fit)}}/>
      <div style={{position:'absolute',width:275*u,height:171*u,background:C.bg,color:C.paper,boxShadow:'0 15px 30px #25281f33',rotate:interpolate(f,[settle,6.6*fps],['9deg','4deg'],fit),display:'flex',alignItems:'center',justifyContent:'center'}}>
       <span data-safe-text style={{fontSize:42*u,fontWeight:750,letterSpacing:-2*u}}>Yuantong<span style={{color:C.gold}}>.</span></span>
      </div>
     </div>:<svg width="100%" height="100%" viewBox="0 0 470 269" fill="none">
      <g transform={`translate(235 135) rotate(${interpolate(f,[settle,6.6*fps],[-10,7],fit)})`}>
       <ellipse rx="142" ry="66" stroke={C.gold} strokeWidth="1.5"/><ellipse rx="142" ry="66" stroke={C.gold} strokeWidth="1.5" transform="rotate(60)"/><ellipse rx="142" ry="66" stroke={C.gold} strokeWidth="1.5" transform="rotate(120)"/>
       <circle r="21" fill={C.gold}/><circle cx="142" r="7" fill={C.ink}/>
      </g>
     </svg>}
     <div style={{position:'absolute',inset:0,background:`linear-gradient(transparent 78%,${base})`}}/>
    </div>
    <div data-safe-text style={{position:'absolute',left:30*u,bottom:28*u,right:25*u,fontSize:22*u,lineHeight:1.6,color:paper?'#676954':C.muted}}>{work.subtitle}</div>
   </div>;
  })}
 </Shell>;
};
