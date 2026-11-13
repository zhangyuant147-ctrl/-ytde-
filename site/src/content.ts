// 在这里补充真实作品；无需修改页面布局。暂时没有的信息用 null 留空。
// 自定义封面：先 import cover from "./assets/你的封面.webp"，再为作品设置 cover。
export const profile = {
  name: "张元通", englishName: "Yuantong", focus: "AI × IP 创作", phone: "15615543731",
  bio: "关注 AI 与个人表达，探索技术如何成为创作的延伸。希望把一个人的特质、审美与想法，变成有温度、能被记住的形象。",
};
export type Project = {
  id: number; title: string; en: string; category: string; color: string;
  kind: "个人创作" | "概念研究"; intro: string; tags: string[];
  action?: string; cover?: string; year: string | null; role: string; process: string; outcome: string; url: string | null;
};
export const projects: Project[] = [
  {id:1,title:"一个人的数字分身",en:"THE OTHER ME",category:"数字形象",color:"sage",kind:"个人创作",year:"2026",role:"形象探索 · 视觉表达",url:null,
   intro:"从一张真实照片出发，寻找数字世界里另一种表达。保留熟悉的轮廓与个性，让个人形象成为创作空间的一部分。",
   tags:["人物 IP","AI 视觉","数字分身"],process:"从人物特征出发，探索形象风格与不同朝向，再把数字分身带入个人网站，加入轻量的鼠标跟随。",outcome:"一组数字形象，以及一段可以被感知的、随鼠标变化的个人表达。"},
  {"id":4,"title":"点线白板","en":"DOTLINE","category":"创作工具","color":"sage","kind":"个人创作","year":"2026","role":"白板交互 · 资料整理","action":"打开白板","intro":"把一段笔记或录音铺成一张可以继续画的白板。先校对原文和分组，再选择思维导图、流程图或分组便签。","tags":["手绘白板","文字整理","本机转写"],"process":"把文字导入、录音转写和提纲校对放进同一条流程。生成后，每张便签和每根连线都可以继续编辑。","outcome":"试试「资料变白板」里的示例，或带来自己的资料。录音在浏览器内转写，整理好的画布可以导出。","url":"./assets/works/dotline/index.html","cover":"./assets/works/dotline/cover.webp"},
  {"id":5,"title":"纸上大乱斗","en":"PAPER SKIRMISH","category":"互动游戏","color":"cream","kind":"个人创作","year":"2026","role":"战斗机制 · 交互设计","action":"开始游戏","intro":"在纸上为红蓝两队布阵，按下开战，看盾兵挡箭、弓手射击、法师施法。换一个兵种，同样的人数也能打出不同的结果。","tags":["手绘游戏","兵种克制","自由布阵"],"process":"为九种角色分别设计攻击距离、防御与技能，再用箭迹、击退与施法效果，让交战过程可以被看懂。","outcome":"从预设战局开玩，或者自己布阵。打开兵种对练，可以单独观察两种角色的伤害差异。","url":"./assets/works/paper-skirmish/index.html","cover":"./assets/works/paper-skirmish/cover.webp"},
  {id:2,title:"让个人品牌，长出形状",en:"MAKE IT PERSONAL",category:"品牌表达",color:"cream",kind:"概念研究",year:null,role:"个人品牌 · 视觉概念",url:null,
   intro:"以名字为起点，研究个人品牌的视觉语言。字形、色彩与节奏，一起构成一个人的独特印记。此项目为概念研究。",
   tags:["概念研究","个人品牌","视觉系统"],process:"以「元」字为视觉线索，尝试把中文标识与简洁的版式放在一起，观察个人身份如何被转译成视觉表达。",outcome:"一组用于讨论方向的概念画面。完整项目内容将随后续创作逐步补充。"},
  {id:3,title:"从一个想法，到一次看见",en:"IDEA TO IDENTITY",category:"创作实验",color:"orange",kind:"概念研究",year:null,role:"AI 工作流 · 创作方法",url:null,
   intro:"记录从灵感到表达的路径：发现特质、整理想法，再让它成为可以被看见的内容。此项目为创作方法概念研究。",
   tags:["概念研究","AI 工作流","内容表达"],process:"把「想法—形象—表达」串成一次小型研究，探索 AI 参与创作的不同环节。",outcome:"一份持续生长的方法草图，后续可补充过程记录、实验图像和实际应用。"},
];
// 待补充区域只展示占位，不会被当作已完成作品，也不会生成空链接。
export const portfolioSlots = [
  {number:"06",title:"下一件作品",detail:"为新的视觉、品牌或数字产品创作留一席。",fields:"项目封面 / 作品介绍 / 过程与成果"},
  {number:"07",title:"下一段记录",detail:"收藏一次值得分享的思考，或一次小小的突破。",fields:"创作手记 / 幕后过程 / 实验记录"},
];
export const focusAreas = [
  {number:"01",en:"DIGITAL IDENTITY",title:"数字形象",text:"从人物特质出发，探索属于自己的视觉身份。"},
  {number:"02",en:"PERSONAL EXPRESSION",title:"个人表达",text:"让名字、审美与想法，形成一致的表达方式。"},
  {number:"03",en:"CREATIVE EXPLORATION",title:"AI 创作",text:"把新工具放进真实的创作过程，保持好奇与实验。"},
];
