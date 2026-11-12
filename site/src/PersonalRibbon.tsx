import { interests, type Interest } from "./lifestyle";

export default function PersonalRibbon({onPhoto}:{onPhoto:(item:Interest)=>void}) {
  const cooking=interests.find(item=>item.id==="cooking")!;
  const photos=[interests[0],interests[1],cooking,interests[2],{...cooking,...cooking.additionalPhoto},interests[3]];
  return <section className="personal-ribbon" aria-label="创作之外的生活照片"><div className="ribbon-rail">{photos.map((item,i)=><button key={i} onClick={()=>onPhoto(item)} aria-label={`打开${item.label}生活照片`}><img src={item.smallImage} alt={item.alt} width="768" height={item.height?1024:512} loading="lazy" decoding="async"/><span>{item.label}</span></button>)}</div></section>;
}
