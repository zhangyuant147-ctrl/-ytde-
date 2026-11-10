import {useLayoutEffect,useMemo} from 'react';
import {useLoader,useThree} from '@react-three/fiber';
import {Easing,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {Color,InstancedMesh,Matrix4,MeshStandardMaterial,SRGBColorSpace,TextureLoader} from 'three';
import {fit} from '../design';

const Keyboard=()=>{
 const keys=useMemo(()=>{
  const geometry=new RoundedBoxGeometry(.72,.065,.53,2,.055);
  const material=new MeshStandardMaterial({color:'#20231f',roughness:.5,metalness:.16});
  const mesh=new InstancedMesh(geometry,material,70),matrix=new Matrix4();
  for(let row=0;row<5;row++)for(let column=0;column<14;column++){
   matrix.makeTranslation((column-6.5)*.8,.24,-2.7+row*.65);mesh.setMatrixAt(row*14+column,matrix);
  }
  mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
 },[]);
 return <primitive object={keys}/>;
};

export const LaptopCamera=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),{camera}=useThree();
 const pull=interpolate(f,[.35*fps,2.25*fps],[0,1],{...fit,easing:Easing.bezier(.4,0,.2,1)});
 useLayoutEffect(()=>{
  camera.position.set(1+6.8*pull,8.1+2.8*pull,21+2.2*pull);
  camera.lookAt(0,3.4-1.6*pull,0);camera.updateProjectionMatrix();
 },[camera,pull]);
 return null;
};

export const Laptop=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const texture=useLoader(TextureLoader,staticFile('site/gallery.png'));
 useMemo(()=>{texture.colorSpace=SRGBColorSpace;texture.anisotropy=8;return texture},[texture]);
 const base=useMemo(()=>new RoundedBoxGeometry(13.4,.28,8.5,4,.13),[]);
 const lid=useMemo(()=>new RoundedBoxGeometry(13.2,8,.22,4,.13),[]);
 const bezel=useMemo(()=>new RoundedBoxGeometry(12.85,7.65,.05,3,.12),[]);
 const close=interpolate(f,[2.3*fps,4.15*fps],[0,1],{...fit,easing:Easing.bezier(.55,0,.3,1)});
 const settle=interpolate(f,[0,1.3*fps],[0,1],{...fit,easing:Easing.bezier(.16,1,.3,1)});
 const lidAngle=-.12+(Math.PI/2+.12)*close;
 const screenLight=interpolate(f,[2.65*fps,3.8*fps],[1,.1],fit);
 return <group position={[0,.08,0]} rotation={[0,-.055+.055*settle,0]}>
  <mesh geometry={base} castShadow receiveShadow>
   <meshStandardMaterial color="#b4b6aa" metalness={.55} roughness={.32}/>
  </mesh>
  <mesh position={[0,.17,-.95]} receiveShadow><boxGeometry args={[11.9,.045,4.4]}/><meshStandardMaterial color="#55594e" roughness={.6} metalness={.4}/></mesh>
  <Keyboard/>
  <mesh position={[0,.23,.71]} castShadow><boxGeometry args={[4.9,.075,.55]}/><meshStandardMaterial color="#20231f" roughness={.5}/></mesh>
  {[-4.2,-3.1,3.1,4.2].map(x=><mesh key={x} position={[x,.23,.71]} castShadow><boxGeometry args={[.92,.075,.55]}/><meshStandardMaterial color="#20231f" roughness={.5}/></mesh>)}
  <mesh position={[0,.159,2.6]}><boxGeometry args={[4.5,.016,2.15]}/><meshStandardMaterial color="#848b7c" metalness={.4} roughness={.5}/></mesh>
  <mesh position={[0,.17,2.6]}><boxGeometry args={[4.43,.016,2.08]}/><meshStandardMaterial color="#b2b5a7" metalness={.48} roughness={.35}/></mesh>
  <mesh position={[0,.25,-3.95]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.14,.14,11.9,20]}/><meshStandardMaterial color="#606756" metalness={.6} roughness={.3}/></mesh>
  {[-1.5,-.5].map(z=><mesh key={z} position={[-6.702,.015,z]}><boxGeometry args={[.018,.075,.42]}/><meshStandardMaterial color="#242a23"/></mesh>)}
  <group position={[0,.43,-4]} rotation={[lidAngle,0,0]}>
   <mesh position={[0,4,0]} geometry={lid} castShadow receiveShadow><meshStandardMaterial color="#aeb3a3" roughness={.3} metalness={.62}/></mesh>
   <mesh position={[0,4,.128]} geometry={bezel} castShadow><meshStandardMaterial color="#101510" roughness={.3} metalness={.1}/></mesh>
   <mesh position={[0,4,.162]}><planeGeometry args={[12.45,7.003]}/><meshBasicMaterial map={texture} color={new Color(screenLight,screenLight,screenLight)} toneMapped={false}/></mesh>
   <mesh position={[0,7.76,.168]}><circleGeometry args={[.032,16]}/><meshBasicMaterial color="#323c36"/></mesh>
  </group>
 </group>;
};
