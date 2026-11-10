import type {CSSProperties} from 'react';
import {CanvasImage,staticFile,useVideoConfig} from 'remotion';
import {C,font} from '../design';

type Props={file:'home'|'about'|'gallery';width:number;height:number;imageOffset?:number;style?:CSSProperties;label?:string};
export const BrowserWindow=({file,width,height,imageOffset=0,style,label='yuantong.com'}:Props)=>{
 const {fps}=useVideoConfig(),u=width/1320,bar=48*u;
 return <div data-browser-window={file} style={{position:'absolute',width,height,borderRadius:16*u,overflow:'hidden',background:C.bg,border:`1px solid ${C.gold}66`,boxSizing:'border-box',boxShadow:'0 30px 70px #0006',fontFamily:font,...style}}>
  <div style={{height:bar,background:'#32362c',position:'relative',display:'flex',alignItems:'center',gap:8*u,padding:`0 ${20*u}px`,boxSizing:'border-box'}}>
   {['#d4c39e','#949878','#62694f'].map(color=><i key={color} style={{width:9*u,height:9*u,borderRadius:'50%',background:color}}/>)}
   <div data-safe-text style={{position:'absolute',left:'24%',right:'24%',textAlign:'center',fontSize:21*u,lineHeight:1,color:'#e7e2d6',letterSpacing:1.2*u}}>{label}</div>
   <svg style={{marginLeft:'auto',opacity:.6}} width={17*u} height={17*u} viewBox="0 0 24 24" fill="none"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z" stroke={C.gold} strokeWidth="1.5"/></svg>
  </div>
  <div style={{position:'absolute',top:bar,left:0,right:0,bottom:0,overflow:'hidden'}}>
   <CanvasImage name={`网站实景 · ${file}`} premountFor={fps} src={staticFile(`site/${file}.png`)} style={{position:'absolute',left:0,top:0,width:'100%',height:width*720/1280,objectFit:'cover',translate:`0px ${imageOffset}px`}}/>
  </div>
 </div>;
};
