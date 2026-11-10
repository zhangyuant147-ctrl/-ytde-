import {AbsoluteFill,useVideoConfig} from 'remotion';
import {getSafeArea,getActionArea,type SafePreset} from './safe-area';
// Explicit check compositions only. Never mounted in the clean preview.
export const SafetyOverlay=({preset='landscape'}:{preset?:SafePreset})=>{
 const {width,height}=useVideoConfig();const t=getSafeArea(width,height,preset),a=getActionArea(width,height);
 return <AbsoluteFill style={{pointerEvents:'none',zIndex:1000}}>
  <div style={{position:'absolute',left:a.x,top:a.y,width:a.width,height:a.height,boxSizing:'border-box',border:'2px dashed #54d8ef'}}/>
  <div style={{position:'absolute',left:t.x,top:t.y,width:t.width,height:t.height,boxSizing:'border-box',border:'2px solid #f4c35b',boxShadow:'0 0 0 4000px #0005'}}/>
 </AbsoluteFill>;
};
