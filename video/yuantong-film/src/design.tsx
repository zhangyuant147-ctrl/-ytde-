import React from 'react';
import {AbsoluteFill, CanvasImage, Easing, interpolate, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';
import {getSafeArea} from './safe-area';
export const C={bg:'#1c1e19',ink:'#eeece3',gold:'#d4c39e',muted:'#a4a698',paper:'#e7e2d6',dark:'#292d24'};
export const font='"Avenir Next", "PingFang SC", "Helvetica Neue", sans-serif';
export const ease={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const,easing:Easing.bezier(.16,1,.3,1)};
export const fit={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
export const Shell:React.FC<{children:React.ReactNode;light?:boolean;chapter:string;nativeLayout?:boolean}>=({children,light,nativeLayout})=>{
 const f=useCurrentFrame();const {width,height}=useVideoConfig();const safe=getSafeArea(width,height);
 const scale=Math.min(safe.width/1730,safe.height/920);
 return <AbsoluteFill data-scene-canvas style={{background:light?C.paper:C.bg,color:light?C.dark:C.ink,fontFamily:font,overflow:'hidden'}}>
  <AbsoluteFill style={{background:light?'radial-gradient(ellipse at 70% 50%,#f8f3e7,transparent 65%)':'radial-gradient(ellipse at 70% 45%,#77795e25,transparent 65%)'}}/>
  {nativeLayout?children:<div data-safe-stage style={{position:'absolute',width:1920,height:1080,left:safe.x-95*scale,top:safe.y-130*scale+24*height/1080,scale,transformOrigin:'top left'}}>{children}</div>}
  <div style={{position:'absolute',inset:0,opacity:.045,pointerEvents:'none',backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 160 160\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.7\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Cpath fill=\'%23fff\' filter=\'url(%23n)\' d=\'M0 0h160v160H0z\'/%3E%3C/svg%3E")',backgroundPosition:`${Math.floor(f/3)%7}px ${Math.floor(f/3)%5}px`}}/>
 </AbsoluteFill>;
};
export const Reveal:React.FC<{children:React.ReactNode;delay?:number;style?:React.CSSProperties}>=({children,delay=0,style})=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return <div style={{opacity:interpolate(f,[delay,delay+.65*fps],[0,1],ease),translate:interpolate(f,[delay,delay+.9*fps],['0px 50px','0px 0px'],ease),...style}}>{children}</div>;};
export const Kicker:React.FC<{children:React.ReactNode;light?:boolean}>=({children,light})=><div style={{fontSize:19,letterSpacing:3,color:light?'#6f715f':C.gold,marginBottom:28}}>{children}</div>;
export const Portrait:React.FC<{file:string;style?:React.CSSProperties}>=({file,style})=>{const {fps}=useVideoConfig();return <CanvasImage name={file} premountFor={fps} src={staticFile(`portraits/${file}.webp`)} style={{position:'absolute',objectFit:'contain',...style}}/>;};
export const Arrow=({size=80}:{size?:number})=><svg width={size} height={size} viewBox="0 0 80 80" fill="none"><path d="M19 61L61 19M21 19H61V59" stroke="currentColor" strokeWidth="2.5"/></svg>;
