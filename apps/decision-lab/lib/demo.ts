import { normalize, type Decision, type Question } from "./model";

type Axis = { id: string; text: string; choices: Record<string, string> };
type Preset = Decision & { id: string; axes: Axis[] };
export const presets: Preset[] = [
  {
    id: "weekend",
    prompt: "周末去哪里？",
    options: [
      { id: "park", name: "公园散步" },
      { id: "gallery", name: "逛展览" },
      { id: "home", name: "宅家看电影" },
    ],
    axes: [
      {
        id: "mood",
        text: "周末结束时，你最想带走哪种感觉？",
        choices: {
          park: "吹过风，身体也舒展开了",
          gallery: "看到新作品，脑子里冒出灵感",
          home: "在熟悉的角落彻底放松",
        },
      },
      {
        id: "scene",
        text: "把周六下午定格成一张照片，你更喜欢哪一幕？",
        choices: {
          gallery: "站在作品前，细看一个细节",
          home: "窝在沙发里，电影刚刚开场",
          park: "沿着树影慢慢走",
        },
      },
      {
        id: "plan",
        text: "现在就做第一步，你最愿意做哪件事？",
        choices: {
          home: "挑一部想看的片子",
          park: "换双舒服的鞋",
          gallery: "翻翻最近的展讯",
        },
      },
    ],
  },
  {
    id: "dinner",
    prompt: "晚饭吃什么？",
    options: [
      { id: "noodle", name: "汤面" },
      { id: "pot", name: "火锅" },
      { id: "rice", name: "炒饭" },
    ],
    axes: [
      {
        id: "taste",
        text: "今晚最期待的第一口是什么？",
        choices: {
          noodle: "热汤和面条一起入口",
          pot: "刚涮好的菜蘸上酱料",
          rice: "吃一勺粒粒分明的米饭",
        },
      },
      {
        id: "pace",
        text: "你喜欢怎样吃完这顿饭？",
        choices: {
          pot: "边涮边聊，慢慢吃",
          rice: "用一把勺子专心吃饭",
          noodle: "一口面，一口汤",
        },
      },
      {
        id: "extra",
        text: "如果可以自己加点东西，你想加什么？",
        choices: {
          rice: "给米饭加个煎蛋",
          noodle: "给汤底撒点葱花",
          pot: "给锅里再下一盘菜",
        },
      },
    ],
  },
  {
    id: "study",
    prompt: "休息还是继续学习？",
    options: [
      { id: "rest", name: "休息一下" },
      { id: "learn", name: "继续学习" },
    ],
    axes: [
      {
        id: "focus",
        text: "试着回想刚才的内容，你感觉怎样？",
        choices: {
          rest: "已经反复读了几遍，还是走神",
          learn: "思路连贯，还想顺着往下做",
        },
      },
      {
        id: "energy",
        text: "再给你十五分钟，你更愿意怎么用？",
        choices: { learn: "把手上这道题做完", rest: "闭眼放松或起身走走" },
      },
      {
        id: "need",
        text: "今天对你更重要的是哪件事？",
        choices: { rest: "留出恢复精力的空间", learn: "完成一个明确的小目标" },
      },
    ],
  },
];

const genericAxes = [
  { id: "instinct", text: "先听直觉，此刻你最想选哪一个？" },
  { id: "regret", text: "如果今天错过了，哪个选项最让你觉得可惜？" },
  {
    id: "action",
    text: "考虑你自己的时间和精力，你最愿意为哪个选项迈出第一步？",
  },
];

export function demoQuestions(d: Decision): Question[] {
  const preset = presets.find(
    (p) =>
      normalize(p.prompt) === normalize(d.prompt) &&
      p.options.length === d.options.length &&
      p.options.every((o) =>
        d.options.some((x) => o.id === x.id && x.name === o.name),
      ),
  );
  const axes: Axis[] =
    preset?.axes ??
    genericAxes.map((axis) => ({
      ...axis,
      choices: Object.fromEntries(d.options.map((o) => [o.id, o.name])),
    }));
  return axes.map((axis) => ({
    id: axis.id,
    text: axis.text,
    answers: Object.entries(axis.choices).map(([preferred, text]) => ({
      id: axis.id + "-" + preferred,
      text,
      weights: d.options.map((o) => ({
        optionId: o.id,
        points: o.id === preferred ? 5 : 0,
        reason:
          o.id === preferred
            ? `「${text}」表达了对「${o.name}」的偏好。`
            : "这次回答没有表达对该选项的直接偏好。",
      })),
    })),
  }));
}
