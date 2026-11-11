import { z } from "zod";

const id = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/, "标识无效");
const label = (limit: number) =>
  z
    .string()
    .trim()
    .min(1, "请填一下这里")
    .max(limit, `最多输入 ${limit} 个字符`);
export const normalize = (s: string) =>
  s.trim().normalize("NFKC").toLocaleLowerCase();
const unique = (values: string[]) => new Set(values).size === values.length;
export const optionSchema = z.object({ id: id.max(48), name: label(36) });
export const decisionSchema = z
  .object({
    prompt: label(120),
    options: z.array(optionSchema).min(2).max(4),
  })
  .superRefine(({ options }, ctx) => {
    const seen = new Set<string>();
    options.forEach((o, i) => {
      const name = normalize(o.name);
      if (name && seen.has(name))
        ctx.addIssue({
          code: "custom",
          path: ["options", i, "name"],
          message: "这个选项已经出现过了",
        });
      seen.add(name);
    });
    if (!unique(options.map((o) => o.id)))
      ctx.addIssue({ code: "custom", message: "候选项标识重复" });
  });
const weightSchema = z.object({
  optionId: id,
  points: z.number().int().min(0).max(5),
  reason: label(120),
});
export const answerSchema = z.object({
  id,
  text: label(100),
  weights: z.array(weightSchema).min(2).max(4),
});
export const questionSchema = z.object({
  id,
  text: label(140),
  answers: z.array(answerSchema).min(2).max(4),
});
export const questionsSchema = z.array(questionSchema).min(3).max(5);
export const responseSchema = z.object({ questionId: id, answerId: id });
export const resultSchema = z
  .array(
    z.object({
      optionId: id,
      name: label(36),
      raw: z.number().int().min(0).max(25),
      index: z.number().min(0).max(100),
      rank: z.number().int().min(1).max(4),
    }),
  )
  .min(2)
  .max(4);
export const explanationSchema = z.object({
  reason: z.string(),
  evidence: z.array(z.string()),
  tradeoff: z.string(),
  next: z.string(),
  uncertainty: z.string(),
});
export const sessionSchema = z.object({
  decision: decisionSchema,
  questions: questionsSchema,
  mode: z.enum(["ai", "demo"]),
  notice: z.string().max(200),
  proof: z.string().max(128).optional(),
});
export type Decision = z.infer<typeof decisionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Answer = z.infer<typeof answerSchema>;
export type Choice = z.infer<typeof responseSchema>;
export type Score = z.infer<typeof resultSchema>[number];
export type Session = z.infer<typeof sessionSchema>;
export type Explanation = z.infer<typeof explanationSchema>;

export function validateQuestions(
  decision: Decision,
  data: unknown,
): Question[] {
  const qs = questionsSchema.parse(data);
  const ids = decision.options.map((o) => o.id);
  if (!unique(qs.flatMap((q) => [q.id, ...q.answers.map((a) => a.id)])))
    throw Error("题目或答案标识重复");
  if (!unique(qs.map((q) => normalize(q.text)))) throw Error("题目重复");
  const separable = new Set<string>();
  for (const q of qs) {
    if (!unique(q.answers.map((a) => normalize(a.text))))
      throw Error("答案重复");
    for (const a of q.answers) {
      const keys = a.weights.map((w) => w.optionId);
      if (keys.length !== ids.length || !ids.every((k) => keys.includes(k)))
        throw Error("评分未覆盖全部候选项");
    }
    let meaningful = false;
    ids.forEach((left, i) =>
      ids.slice(i + 1).forEach((right) => {
        const differences = q.answers.map(
          (a) => points(a, left) - points(a, right),
        );
        if (new Set(differences).size > 1) {
          separable.add(left + ":" + right);
          meaningful = true;
        }
      }),
    );
    if (!meaningful) throw Error("答案不能区分偏好");
  }
  if (separable.size !== (ids.length * (ids.length - 1)) / 2)
    throw Error("存在无法区分的候选项");
  return qs;
}

export function points(a: Answer, optionId: string) {
  const weight = a.weights.find((w) => w.optionId === optionId);
  if (!weight) throw Error("候选项缺少评分");
  return weight.points;
}

export function selected(qs: Question[], choices: Choice[]) {
  if (choices.length !== qs.length || !unique(choices.map((c) => c.questionId)))
    throw Error("请先完成每道题");
  return qs.map((q) => {
    const choice = choices.find((c) => c.questionId === q.id);
    const a = q.answers.find((a) => a.id === choice?.answerId);
    if (!a) throw Error("答案与题目不匹配");
    return { q, a };
  });
}

export function score(d: Decision, qs: Question[], choices: Choice[]): Score[] {
  const answers = selected(qs, choices);
  const rows = d.options
    .map((o) => {
      const raw = answers.reduce((sum, { a }) => sum + points(a, o.id), 0);
      return {
        optionId: o.id,
        name: o.name,
        raw,
        index: (raw / (qs.length * 5)) * 100,
        rank: 1,
      };
    })
    .sort((a, b) => b.raw - a.raw);
  return rows.map((row) => ({
    ...row,
    rank: 1 + rows.filter((other) => other.raw > row.raw).length,
  }));
}

export const percent = (value: number) => Number(value.toFixed(1)).toString();
