import { z } from "zod";
import { decisionSchema, normalize, optionSchema } from "./model";

const name = optionSchema.shape.name;
export const ideaRequest = z.object({
  prompt: decisionSchema.shape.prompt,
  existing: z
    .array(name)
    .max(3)
    .refine(
      (names) => new Set(names.map(normalize)).size === names.length,
      "请先修改重复的选项",
    ),
});
export type IdeaRequest = z.infer<typeof ideaRequest>;
export const ideaResponse = z.object({
  names: z.array(name).min(1).max(3),
  mode: z.enum(["ai", "demo"]),
  note: z.string(),
});

// Offline suggestions are editable starting points. Match specific topics first.
const topics: [RegExp, string[]][] = [
  [
    /吃|晚饭|午饭|早餐|夜宵|点餐/,
    ["吃一碗汤面", "点一份盖饭", "在家做顿饭", "去附近的小馆子"],
  ],
  [
    /学习|复习|备考|读书/,
    ["用十五分钟复习旧知识", "挑一道新题试做", "先休息一会儿", "找同学一起学"],
  ],
  [
    /礼物|送礼/,
    ["手写一张卡片", "一起吃顿饭", "挑一件日常用品", "做一份手工作品"],
  ],
  [
    /工作|跳槽|职业|实习/,
    [
      "留在当前岗位积累经验",
      "找同行了解目标岗位",
      "申请一次新的面试",
      "争取一次内部转岗",
    ],
  ],
  [
    /旅行|旅游|出游|度假/,
    ["去周边城市短途游", "安排一次自然徒步", "在本地做一日游客", "暂缓出行"],
  ],
  [
    /周末|放假|休闲|去哪|去哪儿/,
    ["去公园散步", "看一场展览", "约朋友吃饭", "在家看电影"],
  ],
];
const general = [
  "先小范围试一次",
  "沿用当前做法",
  "先向有经验的人请教",
  "留出一天再决定",
];

export function ideaCount(existing: string[]) {
  return existing.length === 0 ? 3 : Math.min(2, 4 - existing.length);
}
export function localIdeas({ prompt, existing }: IdeaRequest) {
  const topic = topics.find(([pattern]) => pattern.test(prompt));
  const seen = new Set(existing.map(normalize));
  const names = [...(topic?.[1] ?? []), ...general]
    .filter((n) => !seen.has(normalize(n)))
    .slice(0, ideaCount(existing));
  return {
    names,
    mode: "demo" as const,
    note: topic
      ? "演示模式 · 从主题示例中补充，可直接改写。"
      : "演示模式 · 这些是通用行动思路，可改成适合你的选项。",
  };
}
