import {Composition,Folder,Sequence,AbsoluteFill,useCurrentFrame,useVideoConfig,interpolate,staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {SearchOpening} from './scenes/SearchOpening';
import {Introduction} from './scenes/Introduction';
import {DigitalSelf} from './scenes/DigitalSelf';
import {CreativeWork} from './scenes/CreativeWork';
import {Website} from './scenes/Website';
import {Invitation} from './scenes/Invitation';
import {C,fit} from './design';
import {SafetyOverlay} from './SafetyOverlay';
export const YuantongFilm=()=>{const {fps}=useVideoConfig();const frame=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:C.bg}}>
 <TransitionSeries>
  <TransitionSeries.Sequence name="搜索 yuantong.com" durationInFrames={3.6*fps} premountFor={fps}><SearchOpening/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:.6*fps})}/>
  <TransitionSeries.Sequence name="个人亮相" durationInFrames={5.6*fps} premountFor={fps}><Introduction/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:.6*fps})}/>
  <TransitionSeries.Sequence name="一个人的数字分身" durationInFrames={5.6*fps} premountFor={fps}><DigitalSelf/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:.6*fps})}/>
  <TransitionSeries.Sequence name="作品与概念研究" durationInFrames={6.6*fps} premountFor={fps}><CreativeWork/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:.6*fps})}/>
  <TransitionSeries.Sequence name="浏览个人网站" durationInFrames={6.6*fps} premountFor={fps}><Website/></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:.6*fps})}/>
  <TransitionSeries.Sequence name="网站收束 · 合上笔记本" durationInFrames={5*fps} premountFor={fps}><Invitation/></TransitionSeries.Sequence>
 </TransitionSeries>
 <Audio name="原创电子律动 · Momentum / 120 BPM" src={staticFile('audio/momentum.wav')} durationInFrames={30*fps} premountFor={fps} volume={.82}/>
 <AbsoluteFill style={{background:C.bg,pointerEvents:'none',opacity:interpolate(frame,[0,.35*fps,29.5*fps,30*fps-1],[1,0,0,1],fit)}}/>
 </AbsoluteFill>;};
const IntroMotionPreview=()=>{const {fps}=useVideoConfig();return <Sequence from={-3*fps} durationInFrames={30*fps} premountFor={fps}><YuantongFilm/></Sequence>;};
const LaptopEndingPreview=()=>{const {fps}=useVideoConfig();return <Sequence from={-23*fps} durationInFrames={30*fps} premountFor={fps}><YuantongFilm/></Sequence>;};
const LaptopEndingSafety=()=><><Invitation/><SafetyOverlay/></>;
const FilmSafety=()=><><YuantongFilm/><SafetyOverlay/></>;
const IntroductionSafety=()=><><Introduction/><SafetyOverlay/></>;
const SearchSafety=()=><><SearchOpening/><SafetyOverlay/></>;
const WebsiteSafety=()=><><Website/><SafetyOverlay/></>;
const WorkSafety=()=><><CreativeWork/><SafetyOverlay/></>;
export const Root=()=><>
 <Composition id="Yuantong30" component={YuantongFilm} width={1920} height={1080} fps={30} durationInFrames={900}/>
 <Folder name="Previews">
  <Composition id="LaptopEndingPreview" component={LaptopEndingPreview} width={1920} height={1080} fps={30} durationInFrames={210}/>
  <Composition id="IntroMotionPreview" component={IntroMotionPreview} width={1920} height={1080} fps={30} durationInFrames={120}/>
 </Folder>
 <Folder name="Scenes">
  <Composition id="SearchOpening" component={SearchOpening} width={1920} height={1080} fps={30} durationInFrames={108}/>
  <Composition id="Introduction" component={Introduction} width={1920} height={1080} fps={30} durationInFrames={168}/>
  <Composition id="DigitalSelf" component={DigitalSelf} width={1920} height={1080} fps={30} durationInFrames={168}/>
  <Composition id="CreativeWork" component={CreativeWork} width={1920} height={1080} fps={30} durationInFrames={198}/>
  <Composition id="Website" component={Website} width={1920} height={1080} fps={30} durationInFrames={198}/>
  <Composition id="Invitation" component={Invitation} width={1920} height={1080} fps={30} durationInFrames={150}/>
 </Folder>
 <Folder name="SafetyChecks">
  <Composition id="LaptopEndingSafety" component={LaptopEndingSafety} width={1920} height={1080} fps={30} durationInFrames={150}/>
  <Composition id="IntroductionSafety" component={IntroductionSafety} width={1920} height={1080} fps={30} durationInFrames={168}/>
  <Composition id="SearchOpeningSafety" component={SearchSafety} width={1920} height={1080} fps={30} durationInFrames={108}/>
  <Composition id="WebsiteSafety" component={WebsiteSafety} width={1920} height={1080} fps={30} durationInFrames={198}/>
  <Composition id="Yuantong30Safety" component={FilmSafety} width={1920} height={1080} fps={30} durationInFrames={900}/>
  <Composition id="CreativeWorkSafety" component={WorkSafety} width={1920} height={1080} fps={30} durationInFrames={198}/>
 </Folder>
</>;
