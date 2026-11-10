import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Shell,ease,fit} from '../design';
import {getSafeArea} from '../safe-area';
import {BrowserWindow} from '../components/BrowserWindow';

// Reference language: layered browser windows, depth changes and page movement.
// Actual personal-site screenshots are used throughout, with no reference-video overlays.
export const Website=()=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),s=getSafeArea(width,height),u=width/1920;
 const page2=interpolate(f,[1.8*fps,2.5*fps],[0,1],ease),page3=interpolate(f,[3.8*fps,4.5*fps],[0,1],ease);
 const arrival=interpolate(f,[0,.8*fps],[0,1],ease);
 return <Shell chapter="打开个人网站" nativeLayout>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 65% 75%,#b2bd5735,transparent 65%)',translate:interpolate(f,[0,6.6*fps],['-50px 15px','35px -10px'],fit)}}/>
  <div data-safe-text style={{position:'absolute',left:s.x+40*u,top:s.y+32*u,fontSize:60*u,lineHeight:1.3,letterSpacing:-2*u,opacity:arrival,translate:`0px ${(1-arrival)*24*u}px`}}>不止一面，<span style={{color:C.gold}}>在这里认识我。</span></div>
  <div data-safe-text style={{position:'absolute',left:s.x+44*u,top:s.y+135*u,fontSize:26*u,color:C.muted,opacity:arrival}}>个人表达 / 创作记录 / 灵感实验</div>
  <BrowserWindow file="home" width={1296*u} height={580*u} imageOffset={interpolate(f,[.8*fps,1.8*fps],[0,-80*u],ease)} style={{left:s.x+120*u,top:s.y+238*u,opacity:arrival,translate:`${(1-arrival)*50*u}px ${((1-arrival)*58-page2*32-page3*22)*u}px`,scale:1-page2*.035-page3*.035,rotate:`${(1-arrival)*-3-page2*1.2-page3*.8}deg`}}/>
  <BrowserWindow file="about" width={1296*u} height={580*u} imageOffset={interpolate(f,[2.5*fps,3.8*fps],[0,-62*u],ease)} style={{left:s.x+120*u,top:s.y+238*u,opacity:page2,translate:`${(1-page2)*96*u}px ${((1-page2)*72-page3*28)*u}px`,scale:.94+.06*page2-page3*.035,rotate:`${(1-page2)*4-page3*.8}deg`,transform:`perspective(2000px) rotateY(${(1-page2)*-8}deg)`}}/>
  <BrowserWindow file="gallery" width={1296*u} height={580*u} imageOffset={interpolate(f,[4.5*fps,6.4*fps],[0,-75*u],ease)} style={{left:s.x+120*u,top:s.y+238*u,opacity:page3,translate:`${(1-page3)*110*u}px ${(1-page3)*70*u}px`,scale:.94+.06*page3,rotate:`${(1-page3)*3}deg`,transform:`perspective(2000px) rotateY(${(1-page3)*-8}deg)`}}/>
 </Shell>;
};
