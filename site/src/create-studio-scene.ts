import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type StudioFrame={time:number;arrival:number;scroll:number;x:number;y:number;energy:number};

/** Real perspective geometry and a depth field; no remote textures or video. */
export function createStudioScene(canvas:HTMLCanvasElement) {
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"low-power"});
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.25:1.6));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.5;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,1,.1,90);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,.04);
  scene.environment=environment.texture;
  room.dispose();pmrem.dispose();
  const group=new THREE.Group();scene.add(group);
  scene.add(new THREE.HemisphereLight(0xd8e5ff,0x130e22,2));
  const rim=new THREE.DirectionalLight(0xa8baff,6);rim.position.set(-4,5,4);scene.add(rim);
  const warm=new THREE.PointLight(0xff9abb,65,30);warm.position.set(3,0,4);scene.add(warm);
  const purple=new THREE.PointLight(0x8e6bff,75,35);purple.position.set(-5,-1,2);scene.add(purple);
  const metal=new THREE.MeshPhysicalMaterial({color:0xd3d9ed,metalness:1,roughness:.18,clearcoat:1,iridescence:.7,iridescenceIOR:1.3});
  const violet=new THREE.MeshPhysicalMaterial({color:0x8f76cb,metalness:.85,roughness:.21,clearcoat:1,iridescence:1});
  const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(.48,.145,112,14,2,3),metal);
  const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.66,0),violet);
  group.add(knot,gem);
  const haloGeometry=new THREE.TorusGeometry(2.3,.007,5,150,Math.PI*1.7);
  const haloMaterial=new THREE.MeshBasicMaterial({color:0x8790b9,transparent:true,opacity:.2,depthWrite:false});
  const halo=new THREE.Mesh(haloGeometry,haloMaterial);
  halo.rotation.set(1.18,.18,-.4);halo.position.set(0,-1.8,-1);group.add(halo);
  const flecks=Array.from({length:9},(_,i)=>{
    const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(.1+(i%3)*.045,0),i%2?metal:violet);
    const angle=i*2.399;
    mesh.userData={x:Math.cos(angle)*(2.8+i%3),y:Math.sin(angle)*2.2,z:-2-(i%4)*2,phase:angle};
    group.add(mesh);return mesh;
  });
  const foreground=Array.from({length:3},(_,i)=>{
    const mesh=new THREE.Mesh(new THREE.OctahedronGeometry(.2+i*.08,0),i===1?metal:violet);
    mesh.userData={side:i%2?-1:1};scene.add(mesh);return mesh;
  });

  let seed=37;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const n=innerWidth<760?650:1650;
  const positions=new Float32Array(n*3),sizes=new Float32Array(n),phases=new Float32Array(n);
  for(let i=0;i<n;i++) {positions[i*3]=(random()-.5)*55;positions[i*3+1]=(random()-.5)*34;positions[i*3+2]=-48+random()*65;sizes[i]=.5+random()*1.7;phases[i]=random()*Math.PI*2;}
  const pointsGeometry=new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position",new THREE.BufferAttribute(positions,3));
  pointsGeometry.setAttribute("aSize",new THREE.BufferAttribute(sizes,1));
  pointsGeometry.setAttribute("aPhase",new THREE.BufferAttribute(phases,1));
  const uniforms={uTime:{value:0},uEnergy:{value:0},uBurst:{value:0},uPointer:{value:new THREE.Vector3()}};
  const pointsMaterial=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`attribute float aSize; attribute float aPhase; uniform float uTime; uniform float uEnergy; uniform float uBurst; uniform vec3 uPointer; varying float vAlpha; varying float vHue;
      void main(){vec3 p=position; p.y+=sin(uTime*.16+aPhase)*.1; p.x+=cos(uTime*.1+aPhase)*.12;
      vec2 d=p.xy-uPointer.xy; float l=length(d); p.xy+=normalize(d+vec2(.001))*exp(-l*.55)*(uEnergy*.7+uBurst*1.6);
      vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=clamp(aSize*190./max(1.,-mv.z),.5,6.);
      vAlpha=(.4+.25*sin(uTime*.6+aPhase))*(1.-smoothstep(35.,75.,-mv.z));vHue=sin(aPhase)*.5+.5;}`,
    fragmentShader:`varying float vAlpha; varying float vHue; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float a=pow(1.-r,2.)*vAlpha;gl_FragColor=vec4(mix(vec3(.55,.66,1.),vec3(1.,.7,.82),vHue),a);}`,
  });
  const points=new THREE.Points(pointsGeometry,pointsMaterial);scene.add(points);
  let aspect=1,width=0,height=0,burst=0;
  const resize=()=>{
    width=canvas.clientWidth;height=canvas.clientHeight;if(!width||!height)return;
    aspect=width/height;camera.aspect=aspect;camera.updateProjectionMatrix();renderer.setSize(width,height,false);
  };
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  return {
    burst(){burst=1;},
    render({time,arrival,scroll,x,y,energy}:StudioFrame) {
      burst*=.945;
      const t=time*.001,compact=aspect<1;
      const spread=compact?1.16:3.15;
      camera.position.set((1-arrival)*1.3+x*.22,(1-arrival)*.7-y*.15,24-16*arrival-scroll*3.2-energy*.7);
      camera.lookAt(x*.12,y*.09,-1);
      group.rotation.y=x*.1+scroll*.18;group.rotation.x=-y*.045;
      knot.position.set(-spread+Math.sin(t*.3)*.1,.2+Math.sin(t*.45)*.16,-.6);
      gem.position.set(spread*.99,-.65+Math.sin(t*.42+2)*.18,-.9);
      knot.scale.setScalar(compact?.66:1.04);gem.scale.setScalar(compact?.64:.95);
      knot.rotation.set(t*.12+x*.3,t*.15+y*.3,.3+Math.sin(t*.2)*.2);
      gem.rotation.set(t*.16,-t*.19+x*.35,.2);
      halo.rotation.z=-.4+t*.018;halo.material.opacity=.14+energy*.15;
      for(const mesh of flecks){const d=mesh.userData;mesh.position.set(d.x*(compact?.56:1),d.y+Math.sin(t*.4+d.phase)*.13,d.z);mesh.rotation.set(t*.1+d.phase,t*.15,0);}
      foreground.forEach((mesh,i)=>{
        const p=arrival,side=mesh.userData.side;
        mesh.position.set(side*(.7+p*p*(compact?5:10)),(i-1)*1.1+p*p*(i===1?3:-3),15-i*3);
        mesh.rotation.set(t*.25+p*2,t*.3,p*2);mesh.visible=arrival<.98;
      });
      uniforms.uTime.value=t;uniforms.uEnergy.value=energy;uniforms.uBurst.value=burst;
      uniforms.uPointer.value.set(x*(compact?2.4:5),-y*3,0);
      points.rotation.y=-x*.018;points.rotation.x=-y*.014;
      renderer.render(scene,camera);
    },
    dispose(){
      observer.disconnect();
      const geometries=new Set<THREE.BufferGeometry>();
      scene.traverse(object=>{if(object instanceof THREE.Mesh||object instanceof THREE.Points)geometries.add(object.geometry);});
      geometries.forEach(geometry=>geometry.dispose());
      metal.dispose();violet.dispose();haloMaterial.dispose();pointsMaterial.dispose();
      environment.dispose();scene.clear();renderer.dispose();
    },
  };
}
