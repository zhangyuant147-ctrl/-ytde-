import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Shell,Portrait,ease,fit} from '../design';
import {getSafeArea} from '../safe-area';

// Motion adapted from cyxj-shots/replicas/96-activation-insight (MIT).
// This is a conceptual creative path, without fabricated performance data.
// Its four-second action occupies film seconds 3–7, followed by a reading hold.
export const Introduction=()=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),safe=getSafeArea(width,height),u=width/1920;
 const scroll=interpolate(f,[.05*fps,.8*fps],[0,118],ease);
 const chart=interpolate(f,[.25*fps,.9*fps],[0,1],ease);
 const line=interpolate(f,[.6*fps,1.55*fps],[0,1],fit);
 const zoom=interpolate(f,[2.6*fps,3.65*fps],[0,1],ease);
 const text='用 AI 释放创造力，\n用 IP 让你被记住。';
 const typed=text.slice(0,Math.ceil(interpolate(f,[1.15*fps,2.65*fps],[0,text.length],fit)));
 const rightLeft=safe.x+(538-430*zoom)*u,rightTop=safe.y+72*u,rightWidth=(950+370*zoom)*u;
 const points=[[70,185],[310,154],[550,107],[800,61]];
 return <Shell light chapter="从想法到作品" nativeLayout>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 30% 65%,#a9ac762d,transparent 65%)'}}/>
  <div data-safe-text style={{position:'absolute',left:safe.x+(52+126*zoom)*u,top:safe.y+(97+83*zoom)*u,zIndex:5,fontSize:(66-24*zoom)*u,fontWeight:650,color:C.dark,lineHeight:1.25,letterSpacing:-2*u,opacity:interpolate(f,[0,.5*fps],[0,1],ease)}}>张元通<span style={{color:'#8b7957'}}>.</span></div>
  <div data-safe-text style={{position:'absolute',left:safe.x+(56+122*zoom)*u,top:safe.y+(194+53*zoom)*u,zIndex:5,fontSize:26*u,color:'#74745f',opacity:interpolate(f,[.2*fps,.6*fps],[0,1],ease)}}>AI × IP / 个人创作</div>
  <div style={{position:'absolute',left:safe.x+40*u,top:safe.y+257*u,width:435*u,height:540*u,opacity:(1-zoom)*interpolate(f,[0,.6*fps],[0,1],ease),translate:interpolate(f,[0,.8*fps],['-20px 18px','0px 0px'],ease)}}>
   <div style={{position:'absolute',left:20*u,top:45*u,width:390*u,height:390*u,borderRadius:'50%',border:'1px solid #8c926b55'}}/>
   <Portrait file="neutral" style={{left:0,top:-25*u,width:435*u,height:590*u,maskImage:'linear-gradient(#000 70%,transparent 98%)'}}/>
  </div>
  <div style={{position:'absolute',left:rightLeft,top:rightTop,width:rightWidth,height:720*u,borderRadius:28*u,boxSizing:'border-box',border:'1px solid #c6c4b4',background:'#f7f6ee',boxShadow:'0 20px 65px #4f523616',opacity:interpolate(f,[0,.45*fps],[0,1],ease)}}>
   <div data-safe-text style={{position:'absolute',left:36*u,top:28*u,fontSize:27*u,fontWeight:550,color:'#4c5341',opacity:1-zoom}}>从想法，到作品</div>
   <div style={{position:'absolute',left:0,right:0,top:84*u,bottom:20*u,overflow:'hidden',opacity:1-zoom,translate:`0px ${-zoom*160*u}px`}}>
    <div data-safe-text style={{position:'absolute',left:120*u,top:-scroll*u,width:760*u,boxSizing:'border-box',padding:'18px 25px',borderRadius:22*u,background:'#e7e8dc',fontSize:28*u,lineHeight:1.5,color:'#454b3a',opacity:interpolate(f,[.35*fps,.85*fps],[1,0],fit)}}>如何让一个想法，成为有辨识度的作品？</div>
    <div style={{position:'absolute',left:36*u,top:(158-scroll)*u,width:878*u,height:270*u,boxSizing:'border-box',border:'1px solid #d6d8c9',background:'#fffef8',borderRadius:20*u,overflow:'hidden',opacity:chart,scale:.98+.02*chart,transformOrigin:'center top'}}>
     <div data-safe-text style={{position:'absolute',left:25*u,top:18*u,fontSize:25*u,color:'#454c37'}}>创作路径</div>
     <svg width={878*u} height={270*u} viewBox="0 0 878 270" fill="none" style={{position:'absolute',inset:0}}>
      {[92,138,184].map(y=><path key={y} d={`M62 ${y}H816`} stroke="#e9ebdf" strokeWidth="1"/>)}
      <defs><clipPath id="intro-insight-line"><rect x="55" y="45" width={770*line} height="162"/></clipPath></defs>
      <g clipPath="url(#intro-insight-line)">
       <path d="M70 185L310 154L550 107L800 61L800 207H70Z" fill="#899552" opacity=".09"/>
       <path d="M70 185L310 154L550 107L800 61" stroke="#7b894b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      {points.map(([x,y],i)=>{const node=interpolate(f,[(.65+i*.28)*fps,(.9+i*.28)*fps],[0,1],ease);return <g key={i} opacity={node}><circle cx={x} cy={y} r={7*node} fill="#7b894b" stroke="#fffef8" strokeWidth="3"/><circle cx={x} cy={y} r={16*node} stroke="#a6b476" opacity={i===3?.65:.25}/><text data-safe-text x={x} y={239} textAnchor="middle" fill="#666d50" fontSize="22">{['灵感','AI 共创','个人 IP','作品'][i]}</text></g>})}
     </svg>
    </div>
   </div>
  </div>
  <div data-safe-text style={{position:'absolute',left:safe.x+(574-396*zoom)*u,top:safe.y+(618-scroll-176*zoom)*u,width:(870+290*zoom)*u,zIndex:6,fontSize:(34+36*zoom)*u,lineHeight:1.5,letterSpacing:-1*u,color:'#333b29',whiteSpace:'pre-line',fontWeight:550}}>{typed}<span style={{display:'inline-block',width:3*u,height:(32+28*zoom)*u,background:'#879354',marginLeft:7*u,verticalAlign:'-3px',opacity:f<2.7*fps?1:0}}/></div>
  <div data-safe-text style={{position:'absolute',left:safe.x+178*u,top:safe.y+629*u,zIndex:6,fontSize:28*u,color:'#767960',opacity:interpolate(f,[3.1*fps,3.8*fps],[0,1],ease),translate:interpolate(f,[3.1*fps,3.8*fps],['0px 12px','0px 0px'],ease)}}>一个持续生长的个人创作空间。</div>
 </Shell>;
};
