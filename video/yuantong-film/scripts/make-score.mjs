import {writeFileSync, mkdirSync} from 'node:fs';
// Original 30-second ambient score. No external recordings or samples.
const rate=44100, seconds=30, total=rate*seconds;
const left=new Float64Array(total), right=new Float64Array(total);
const hz=(m)=>440*Math.pow(2,(m-69)/12);
function note(start,duration,midi,level,pan=0,kind='bell'){
 const first=Math.floor(start*rate), count=Math.min(Math.floor(duration*rate),total-first), f=hz(midi);
 for(let i=0;i<count;i++){
  const t=i/rate; let x=0;
  if(kind==='pad') {const env=Math.min(t/1.1,1)*Math.min((duration-t)/1.5,1); x=(Math.sin(2*Math.PI*f*t)+.22*Math.sin(2*Math.PI*(f*2+.3)*t))*.5*env;}
  else if(kind==='bass') x=Math.sin(2*Math.PI*f*t)*Math.min(t/.025,1)*Math.exp(-t*2.5);
  else if(kind==='kick') x=Math.sin(2*Math.PI*(44*t+4*(1-Math.exp(-t*26))))*Math.exp(-t*19);
  else {x=(Math.sin(2*Math.PI*f*t)+.24*Math.sin(2*Math.PI*f*2.002*t)+.08*Math.sin(2*Math.PI*f*3*t))*Math.min(t/.008,1)*Math.exp(-t*2.2);}
  const v=x*level;left[first+i]+=v*(1-pan*.3);right[first+i]+=v*(1+pan*.3);
  if(kind==='bell'){for(let e=1;e<=3;e++){const j=first+i+Math.floor(.3*e*rate);if(j<total){left[j]+=v*Math.pow(.29,e)*(e%2?.6:1);right[j]+=v*Math.pow(.29,e)*(e%2?1:.6);}}}
 }
}
const chords=[[50,57,60,64],[46,53,57,60],[53,60,64,67],[48,55,58,62]];
for(let bar=0;bar<12;bar++){
 const t=bar*2.4, chord=chords[bar%4];
 for(const n of chord)note(t,4,n,.035,(n%3)-1,'pad');
 note(t,1.4,chord[0]-12,.14,0,'bass');
 for(let beat=0;beat<4;beat++)note(t+beat*.6,.3,36,.13,0,'kick');
 const phrase=[chord[2]+12,chord[1]+12,chord[3]+12,chord[2]+12];
 phrase.forEach((n,i)=>note(t+i*.6+.15,1.4,n,.052,i%2?-.65:.65));
}
note(28.8,1.2,74,.075,0);note(28.8,1.2,69,.05,-.5);note(28.8,1.2,62,.05,.5);
let peak=0;for(let i=0;i<total;i++){const fade=Math.min(i/(rate*.6),1)*Math.min((total-i)/(rate*1.5),1);left[i]*=fade;right[i]*=fade;peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));}
const gain=.74/Math.max(peak,.74);const out=Buffer.alloc(44+total*4);out.write('RIFF',0);out.writeUInt32LE(36+total*4,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(2,22);out.writeUInt32LE(rate,24);out.writeUInt32LE(rate*4,28);out.writeUInt16LE(4,32);out.writeUInt16LE(16,34);out.write('data',36);out.writeUInt32LE(total*4,40);for(let i=0;i<total;i++){out.writeInt16LE(Math.round(left[i]*gain*32767),44+i*4);out.writeInt16LE(Math.round(right[i]*gain*32767),46+i*4);}mkdirSync('public/audio',{recursive:true});writeFileSync('public/audio/curiosity.wav',out);console.log(`Original score: ${seconds}s, stereo ${rate}Hz, peak ${peak.toFixed(3)}`);
