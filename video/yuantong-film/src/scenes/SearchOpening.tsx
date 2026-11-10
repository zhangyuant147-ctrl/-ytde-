import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Shell,ease,fit} from '../design';
import {getSafeArea} from '../safe-area';
import {BrowserWindow} from '../components/BrowserWindow';

export const SearchOpening=()=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),s=getSafeArea(width,height),u=width/1920;
 const domain='yuantong.com',typed=domain.slice(0,Math.floor(interpolate(f,[.55*fps,1.3*fps],[0,domain.length],fit)));
 const barWidth=interpolate(f,[.12*fps,.6*fps],[112*u,1056*u],ease);
 const searchOpacity=interpolate(f,[0,.15*fps,2*fps,2.25*fps],[0,1,1,0],fit);
 const browserEnter=interpolate(f,[2.05*fps,2.85*fps],[0,1],ease);
 return <Shell chapter="搜索打开创作空间" nativeLayout>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 30% 65%,#8e9b4a35,transparent 58%),radial-gradient(ellipse at 80% 25%,#d4c39e20,transparent 48%)',translate:interpolate(f,[0,3.6*fps],['-35px 20px','25px -15px'],fit)}}/>
  <div style={{position:'absolute',inset:0,opacity:searchOpacity}}>
   <div data-safe-text style={{position:'absolute',left:s.x+32*u,right:s.margins.right+32*u,top:s.y+165*u,textAlign:'center',fontSize:64*u,lineHeight:1.3,letterSpacing:-2*u,opacity:interpolate(f,[.15*fps,.65*fps],[0,1],ease),translate:interpolate(f,[.15*fps,.65*fps],['0px 20px','0px 0px'],ease)}}>一个网址，<span style={{color:C.gold}}>打开我的创作世界。</span></div>
   <div style={{position:'absolute',left:(width-barWidth)/2,top:s.y+370*u,width:barWidth,height:112*u,borderRadius:60*u,border:`1px solid ${C.gold}88`,background:'#11150ff0',boxShadow:'0 22px 60px #0005,0 0 35px #b3ba6422',overflow:'hidden',display:'flex',alignItems:'center'}}>
    <svg style={{position:'absolute',left:33*u}} width={45*u} height={45*u} viewBox="0 0 48 48" fill="none"><circle cx="20" cy="20" r="14" stroke={C.ink} strokeWidth="2.5" strokeDasharray="88" strokeDashoffset={interpolate(f,[0,.4*fps],[88,0],fit)}/><path d="M31 31L43 43" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round"/></svg>
    <div data-safe-text style={{position:'absolute',left:110*u,fontSize:47*u,color:C.ink,letterSpacing:2*u,whiteSpace:'nowrap',opacity:interpolate(f,[.5*fps,.6*fps],[0,1],fit)}}>{typed}<span style={{color:C.gold,opacity:f<1.45*fps&&Math.floor(f/(.16*fps))%2===0?1:0}}>|</span></div>
    <div style={{position:'absolute',right:18*u,width:76*u,height:76*u,borderRadius:'50%',background:C.gold,color:C.bg,display:'flex',alignItems:'center',justifyContent:'center',scale:interpolate(f,[1.55*fps,1.65*fps,1.8*fps],[1,.88,1],fit),opacity:interpolate(f,[1.25*fps,1.45*fps],[0,1],fit)}}><svg width={35*u} height={35*u} viewBox="0 0 40 40" fill="none"><path d="M8 20H32M22 10L32 20L22 30" stroke="currentColor" strokeWidth="2.5"/></svg></div>
   </div>
   <div data-safe-text style={{position:'absolute',top:s.y+530*u,left:s.x+40*u,width:s.width-80*u,textAlign:'center',fontSize:25*u,color:C.muted,opacity:interpolate(f,[.65*fps,1*fps],[0,1],ease)}}>个人表达 · 创作记录 · 更多可能</div>
  </div>
  <BrowserWindow file="home" width={1360*u} height={704*u} imageOffset={interpolate(f,[2.8*fps,3.6*fps],[0,-18*u],fit)} style={{left:(width-1360*u)/2,top:s.y+90*u,opacity:browserEnter,scale:.82+.18*browserEnter,transform:`perspective(1800px) rotateX(${(1-browserEnter)*58}deg)`,translate:`0px ${(1-browserEnter)*58*u}px`}}/>
 </Shell>;
};
