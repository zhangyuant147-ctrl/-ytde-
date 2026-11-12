import { ArrowUpRight, Expand } from "lucide-react";
import { interests, type Interest, type LifeImage } from "./lifestyle";

export function LifePhoto({item,large=false,wide=false}:{item:LifeImage;large?:boolean;wide?:boolean}) {
  return <img src={item.image} srcSet={`${item.smallImage} 768w, ${item.image} ${item.width || 1536}w`} sizes={large ? "(max-width: 760px) 92vw, 1100px" : wide ? "(max-width: 760px) 88vw, 55vw" : item.width ? "(max-width: 760px) 43vw, 27vw" : "(max-width: 760px) 88vw, 29vw"} width={item.width || 1536} height={item.height || 1024} alt={item.alt} loading={large ? "eager" : "lazy"} decoding="async" draggable={false}/>;
}

export default function LifeSection({embedded=false,onPhoto}:{embedded?:boolean;onPhoto:(item:Interest)=>void}) {
  const Heading=embedded ? "h2" : "h1";
  const StoryHeading=embedded ? "h3" : "h2";
  return <section id={embedded ? "home-life" : undefined} aria-labelledby="life-title" className={`content-section life-section ${embedded ? "life-embedded" : "life-page"}`}>
    <div className="life-heading"><div><Heading id="life-title">认真创作，<br/><span>也认真生活。</span></Heading></div><div className="life-intro"><p>把时间留给喜欢的事。<br/>感受驾驶的乐趣，打几杆球、泡一壶茶，<br/>自己下厨做顿饭，偶尔也小酌一下。</p><span>有张有弛，都是生活的乐趣。</span></div></div>
    <div className="life-grid">{interests.map(item=><article key={item.id} className={`life-story life-${item.id}`}>
      {item.additionalPhoto ? <div className="life-cooking-photos">{[item,item.additionalPhoto].map((photo,index)=><figure key={photo.image}><button className="life-photo" onClick={()=>onPhoto({...item,...photo})} aria-label={`查看做饭照片${index+1}大图`}><LifePhoto item={photo}/><span className="life-photo-expand" aria-hidden="true"><Expand size={15}/></span></button><figcaption>{index===0 ? "虾与花蛤，配一碟蘸料。" : "番茄炒蛋，配一碗热米饭。"}</figcaption></figure>)}</div> : <button className="life-photo" onClick={()=>onPhoto(item)} aria-label={`查看${item.label}配图大图`}><LifePhoto item={item} wide={item.id==="driving"}/><span className="life-photo-expand" aria-hidden="true"><Expand size={15}/></span></button>}
      <div className="life-story-copy"><StoryHeading>{item.id==="driving" ? <>喜欢驾驶，<br/>也喜欢感受不同。</> : item.id==="cooking" ? <>自己下厨，<br/>把日子过得有滋有味。</> : item.title}</StoryHeading><p>{item.description}</p><span className="life-story-note">{item.note}</span>{item.id==="driving" && <span className="life-road-line" aria-hidden="true"><i/><ArrowUpRight size={18} strokeWidth={1}/></span>}</div>
    </article>)}</div>
    <div className="life-ending"><p>保持好奇，也给日常留点余地。</p><span>做饭照片由本人提供 · 其余为 AI 意境配图</span></div>
  </section>;
}
