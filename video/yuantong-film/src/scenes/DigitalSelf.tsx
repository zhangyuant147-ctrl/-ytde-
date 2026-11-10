import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Shell,Reveal,Kicker,Portrait,ease,fit} from '../design';
export const DigitalSelf=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return <Shell light chapter="02 / THE OTHER ME">
 <Reveal style={{position:'absolute',left:110,top:230,width:870}}><Kicker light>DIGITAL IDENTITY / 数字形象</Kicker><div style={{fontSize:135,fontWeight:750,lineHeight:1.02,letterSpacing:-8}}>THE<br/>OTHER ME<span style={{color:'#9a8763'}}>.</span></div></Reveal>
 <Reveal delay={.5*fps} style={{position:'absolute',left:115,top:650}}><div style={{fontSize:56,letterSpacing:-2,lineHeight:1.6}}>熟悉的我，<br/>另一种表达。</div><div style={{fontSize:24,color:'#6f715f',marginTop:27}}>保留个性，让形象成为创作的一部分。</div></Reveal>
 <div style={{position:'absolute',left:1010,top:175,width:760,height:760,border:'1px solid #474c3c35',borderRadius:'50%',scale:interpolate(f,[0,6.6*fps],[.92,1.02],fit)}}/>
 <div style={{position:'absolute',left:1110,top:275,width:560,height:560,border:'1px solid #474c3c20',borderRadius:'50%'}}/>
 <Portrait file="neutral" style={{left:1040,top:160,width:690,height:860,opacity:interpolate(f,[0,.75*fps],[0,1],ease),translate:interpolate(f,[0,1.1*fps],['80px 0px','0px 0px'],ease),maskImage:'linear-gradient(#000 80%,transparent 100%)'}}/>
 <Portrait file="left" style={{left:1040,top:160,width:690,height:860,opacity:interpolate(f,[1.5*fps,1.9*fps,2.9*fps,3.3*fps],[0,1,1,0],fit),maskImage:'linear-gradient(#000 58%,transparent 68%)'}}/>
 <Portrait file="right" style={{left:1040,top:160,width:690,height:860,opacity:interpolate(f,[3.4*fps,3.8*fps,4.9*fps,5.3*fps],[0,1,1,0],fit),maskImage:'linear-gradient(#000 58%,transparent 68%)'}}/>
 </Shell>;};
