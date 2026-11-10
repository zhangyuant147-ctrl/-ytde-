import {writeFileSync,mkdirSync} from 'node:fs';
// Original 120 BPM electronic score, synthesized locally. No samples or external music.
const rate=44100,seconds=30,N=rate*seconds,L=new Float64Array(N),R=new Float64Array(N);
const bpm=120,beat=60/bpm,hz=m=>440*2**((m-69)/12);
let seed=20261110;
const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1};
function emit(start,duration,level,pan,voice,{midi=60,delay=false,duck=false}={}){
 const begin=Math.round(start*rate),len=Math.round(duration*rate),freq=hz(midi);let phase=0,low=0,prev=0;
 for(let j=0;j<len;j++){
  const k=begin+j;if(k<0||k>=N)continue;const t=j/rate;let v=0;
  if(voice==='kick'){
   const f=46+112*Math.exp(-t*35);phase+=2*Math.PI*f/rate;
   v=Math.sin(phase)*Math.exp(-t*9.5)*(1-Math.exp(-t*900))+.035*noise()*Math.exp(-t*140);
  }else if(voice==='snare'){
   const n=noise();low+=.12*(n-low);
   const clap=[0,.011,.023].reduce((a,s)=>a+(t>s?Math.exp(-(t-s)*32):0),0)/3;
   v=(n-low)*clap*.65+Math.sin(2*Math.PI*185*t)*Math.exp(-t*24)*.22;
  }else if(voice==='hat'){
   const n=noise(),hp=n-prev*.88;prev=n;v=hp*Math.exp(-t*55)*.35;
  }else if(voice==='openhat'){
   const n=noise();low+=.15*(n-low);v=(n-low)*Math.exp(-t*15)*.32;
  }else if(voice==='bass'){
   const env=Math.min(t/.008,1)*Math.exp(-t*8)*Math.min((duration-t)/.03,1);
   v=(Math.sin(2*Math.PI*freq*t)+.25*Math.sin(2*Math.PI*freq*2*t)+.12*Math.sin(2*Math.PI*freq*3*t))*env;
  }else if(voice==='pluck'){
   const env=Math.min(t/.006,1)*Math.exp(-t*7.2);
   v=(Math.sin(2*Math.PI*freq*t)+.32*Math.sin(2*Math.PI*freq*2*t)*Math.exp(-t*10)+.08*Math.sin(2*Math.PI*freq*4*t)*Math.exp(-t*16))*env;
  }else if(voice==='pad'){
   const env=Math.min(t/.17,1)*Math.min((duration-t)/.6,1);
   v=(Math.sin(2*Math.PI*freq*t)+.24*Math.sin(2*Math.PI*freq*1.002*t)+.1*Math.sin(2*Math.PI*freq*2*t))*.45*env;
  }else if(voice==='rise'){
   const n=noise();low+=.03*(n-low);v=(n-low)*Math.sin(Math.PI*t/duration/2)**2*.25;
  }else if(voice==='tick')v=(noise()*.4+Math.sin(2*Math.PI*1700*t)*.25)*Math.exp(-t*180);
  const side=duck?.38+.62*(1-Math.exp(-((k/rate)%beat)*15)):1;
  v*=level*side;const a=v*Math.sqrt((1-pan)/2),b=v*Math.sqrt((1+pan)/2);L[k]+=a;R[k]+=b;
  if(delay){for(let e=1;e<=3;e++){const d=k+Math.round(.375*e*rate);if(d<N){const g=.24**e;L[d]+=(e%2?b:a)*g;R[d]+=(e%2?a:b)*g}}}
 }
}
const chords=[[50,57,60,64,69],[46,53,57,60,65],[53,60,64,67,72],[48,55,58,62,67]];
const bassPattern=[0,.75,1.25,1.75];
for(let bar=0;bar<15;bar++){
 const start=bar*2,ch=chords[bar%4];
 for(let i=0;i<ch.length;i++)emit(start,2.35,.045,(i-2)*.33,'pad',{midi:ch[i],duck:true});
 for(let k=0;k<4;k++){
  const t=start+k*beat,energy=t<3?.40:t>28?.72:1;
  emit(t,.48,.48*energy,0,'kick');
  if(k%2===1&&t>=3)emit(t,.23,.26*energy,.02,'snare');
  if(t>=3)emit(t+.25,.22,.12*energy,.22,'openhat');
 }
 for(let i=0;i<8;i++){
  const t=start+i*.25+(i%2?.012:0);if(t<seconds)emit(t,.095,t<3?.026:.065,i%2?.4:-.35,'hat');
 }
 bassPattern.forEach((off,i)=>emit(start+off,.30,start<2?.06:.18,-.06,'bass',{midi:ch[0]-12+(i===3?12:0),duck:true}));
 const arp=[ch[1]+12,ch[2]+12,ch[3]+12,ch[4]+12,ch[2]+12,ch[3]+12,ch[1]+12,ch[2]+12];
 arp.forEach((m,i)=>{if(start<3&&i%2===1)return;emit(start+i*.25+.125,.7,start<3?.05:.080,i%2?.48:-.48,'pluck',{midi:m,delay:true,duck:true})});
}
for(const t of [3,8,13,19,25]){
 emit(t-.35,.35,.24,0,'rise');emit(t,.8,.13,.15,'pluck',{midi:81,delay:true});
}
for(let i=0;i<12;i++)emit(.55+i*.75/12,.025,.065,i%2?.2:-.2,'tick');
emit(1.65,.06,.13,0,'tick');
for(let i=0;i<3;i++)emit(13.25+i*.5,.5,.11,(i-1)*.5,'pluck',{midi:[74,77,81][i],delay:true});
for(const t of [20.8,22.8])emit(t-.18,.18,.15,.2,'rise');
[62,69,74,77].forEach((m,i)=>emit(29,1,.08,(i-1.5)*.25,'pluck',{midi:m,delay:true}));
let peak=0,sum=0;
for(let i=0;i<N;i++){
 const fade=Math.min(i/(rate*.10),1)*Math.min((N-i)/(rate*.65),1);
 L[i]=Math.tanh(L[i]*1.35)*fade;R[i]=Math.tanh(R[i]*1.35)*fade;peak=Math.max(peak,Math.abs(L[i]),Math.abs(R[i]));
}
const gain=.89/peak,buf=Buffer.alloc(44+N*4);
buf.write('RIFF',0);buf.writeUInt32LE(36+N*4,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);buf.writeUInt32LE(rate,24);buf.writeUInt32LE(rate*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(N*4,40);
for(let i=0;i<N;i++){const l=L[i]*gain,r=R[i]*gain;sum+=(l*l+r*r)/2;buf.writeInt16LE(Math.round(l*32767),44+i*4);buf.writeInt16LE(Math.round(r*32767),46+i*4)}
mkdirSync('public/audio',{recursive:true});writeFileSync('public/audio/momentum.wav',buf);
console.log(JSON.stringify({file:'public/audio/momentum.wav',seconds,bpm,sampleRate:rate,channels:2,peakDb:20*Math.log10(.89),rmsDb:10*Math.log10(sum/N),original:true}));
