import {ThreeCanvas} from '@remotion/three';
import {Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {C,Shell,ease,fit} from '../design';
import {getSafeArea} from '../safe-area';
import {Laptop,LaptopCamera} from '../components/Laptop';

// Final five seconds: match the gallery page, pull back, close the physical lid.
// Contact details are deliberately absent from this scene and from the active source.
export const Invitation=()=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),safe=getSafeArea(width,height),u=width/1920;
 return <Shell chapter="创作未完待续" nativeLayout>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 65%,#7885453a,transparent 63%)'}}/>
  <div data-safe-text style={{position:'absolute',left:safe.x+30*u,top:safe.y+18*u,width:safe.width-60*u,textAlign:'center',color:C.ink,fontSize:66*u,lineHeight:1.35,letterSpacing:-2*u,zIndex:2,opacity:interpolate(f,[.6*fps,1.35*fps],[0,1],ease),translate:interpolate(f,[.6*fps,1.35*fps],['0px 22px','0px 0px'],ease)}}>创作，<span style={{color:C.gold}}>未完待续。</span></div>
  <div data-safe-text style={{position:'absolute',left:safe.x+30*u,top:safe.y+125*u,width:safe.width-60*u,textAlign:'center',color:C.muted,fontSize:28*u,zIndex:2,opacity:interpolate(f,[3.3*fps,4.15*fps],[0,1],ease)}}>保持好奇，持续创造。</div>
  <ThreeCanvas name="网站笔记本 · 拉远与合盖" premountFor={fps} width={safe.width} height={720*u} style={{position:'absolute',left:safe.x,top:safe.y+128*u,opacity:interpolate(f,[0,.55*fps],[0,1],fit)}} dpr={1.5} shadows camera={{position:[1,8.1,21],fov:32,near:.1,far:100}} gl={{alpha:true,antialias:true,preserveDrawingBuffer:true}}>
   <ambientLight intensity={1.1}/>
   <hemisphereLight args={['#eeecdd','#35402b',2]}/>
   <directionalLight position={[3,12,9]} intensity={3} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-.001}/>
   <directionalLight position={[-9,4,5]} intensity={1.8} color="#c1ceb3"/>
   <directionalLight position={[-4,8,-8]} intensity={2.8} color="#f0dfb3"/>
   <LaptopCamera/>
   <Laptop/>
   <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.075,0]} receiveShadow><planeGeometry args={[40,40]}/><shadowMaterial transparent opacity={.25}/></mesh>
  </ThreeCanvas>
 </Shell>;
};
