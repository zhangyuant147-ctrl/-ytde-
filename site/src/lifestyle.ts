import driving from "./assets/lifestyle/driving-1536.webp";
import drivingSmall from "./assets/lifestyle/driving-768.webp";
import billiards from "./assets/lifestyle/billiards-1536.webp";
import billiardsSmall from "./assets/lifestyle/billiards-768.webp";
import tea from "./assets/lifestyle/tea-1536.webp";
import teaSmall from "./assets/lifestyle/tea-768.webp";
import evening from "./assets/lifestyle/evening-1536.webp";
import eveningSmall from "./assets/lifestyle/evening-768.webp";
import seafood from "./assets/lifestyle/cooking-seafood-1280.webp";
import seafoodSmall from "./assets/lifestyle/cooking-seafood-768.webp";
import homeMeal from "./assets/lifestyle/cooking-home-meal-1280.webp";
import homeMealSmall from "./assets/lifestyle/cooking-home-meal-768.webp";

export type LifeImage = {image:string;smallImage:string;alt:string;width?:number;height?:number;credit?:string};
export type Interest = LifeImage & {id:string;number:string;label:string;en:string;title:string;description:string;note:string;additionalPhoto?:LifeImage};
export const interests:Interest[] = [
  {id:"driving",number:"01",label:"驾驶",en:"THE JOY OF DRIVING",title:"喜欢驾驶，也喜欢感受不同。",description:"我喜欢驾驶的乐趣。在条件允许、合法合规的范围内，也愿意体验不同车型，感受它们各自的操控、反馈与性格。每一种不同，都让这份兴趣更有意思。",note:"享受驾驶的过程，保持对不同车型的好奇。",image:driving,smallImage:drivingSmall,alt:"阴天下的山间道路旁，一辆深灰色双门轿跑安静停在观景停车处，AI 生成的驾驶意境配图"},
  {id:"billiards",number:"02",label:"台球",en:"ONE SHOT AT A TIME",title:"打几杆球，把节奏慢下来。",description:"休闲时会打打台球。看角度、找手感，把注意力放在眼前这一杆，享受一点专注，也给自己换换节奏。",note:"专注一杆，也放松一刻。",image:billiards,smallImage:billiardsSmall,alt:"暖色灯光下的绿色台球桌，球杆与几颗台球自然散落，AI 生成的台球意境配图"},
  {id:"tea",number:"03",label:"喝茶",en:"A QUIET CUP",title:"一壶茶，留一点空白。",description:"闲下来时，喜欢泡茶、喝茶。不赶时间，让一杯茶的工夫成为日常的小小停顿，慢慢喝，也慢慢想。",note:"茶有回甘，日子也有。",image:tea,smallImage:teaSmall,alt:"窗边木茶盘上的紫砂色茶壶与两只陶杯，杯中是琥珀色茶汤，AI 生成的喝茶意境配图"},
  {id:"evening",number:"04",label:"小酌",en:"A LITTLE UNWINDING",title:"偶尔小酌，为闲暇添点趣。",description:"偶尔也会小酌一下。适量随意，享受放松的氛围，为平常的日子添一点乐趣，让闲暇多一种滋味。",note:"小酌怡情，尽兴也有分寸。",image:evening,smallImage:eveningSmall,alt:"家中暖灯旁的木桌上，一只装有少量琥珀色酒液与冰块的玻璃杯，AI 生成的小酌意境配图"},
  {id:"cooking",number:"05",label:"做饭",en:"A MEAL OF MY OWN",title:"自己下厨，把日子过得有滋有味。",description:"平日里也会自己做做饭。有时是虾和花蛤，有时是一盘番茄炒蛋，配点蔬菜和米饭。做几道家常菜，边吃边看点喜欢的内容，简单的一餐，也有自己的乐趣。",note:"一餐热饭，就是日常的小满足。",image:seafood,smallImage:seafoodSmall,width:1280,height:1707,credit:"日常照片 · 本人提供",alt:"本人提供的日常做饭照片：桌上的虾、花蛤与蘸料，旁边放着一杯啤酒和笔记本电脑",additionalPhoto:{image:homeMeal,smallImage:homeMealSmall,width:1280,height:1707,credit:"日常照片 · 本人提供",alt:"本人提供的日常做饭照片：番茄炒蛋、炒蔬菜和一碗米饭，旁边的电脑播放着视频"}},
];
