import {
  points,
  selected,
  type Choice,
  type Explanation,
  type Score,
  type Session,
} from "./model";

export const nextSteps = [
  "给领先的选择留出十分钟，试做第一步，再判断是否继续。",
  "写下最在意的一项条件，核对领先的选项能否满足它。",
  "分别写下选与不选各会放弃什么，再读一遍自己的答案。",
];
export function explain(
  session: Session,
  choices: Choice[],
  rows: Score[],
  order?: string[],
  next = 0,
): Explanation {
  const winners = rows.filter((s) => s.rank === 1);
  const names = winners.map((s) => "「" + s.name + "」").join("、");
  const top = rows[0];
  const runner = rows.find((s) => s.rank > 1);
  const picks = selected(session.questions, choices);
  const evidence = picks
    .map(({ q, a }) => {
      const weights = winners.map((w) =>
        a.weights.find((x) => x.optionId === w.optionId)!,
      );
      return {
        id: q.id,
        strength: Math.max(...weights.map((w) => w.points)),
        text:
          `「${q.text}」你选了「${a.text}」。` +
          winners
            .map((w) => `${w.name} +${points(a, w.optionId)} 分`)
            .join("，") +
          "。",
      };
    })
    .sort((a, b) => b.strength - a.strength);
  const ordered = order
    ?.map((id) => evidence.find((e) => e.id === id))
    .filter((e) => e !== undefined);
  const alternative = runner ?? winners[1];
  const bestForAlternative = [...picks].sort(
    (x, y) =>
      points(y.a, alternative.optionId) -
      points(y.a, top.optionId) -
      (points(x.a, alternative.optionId) - points(x.a, top.optionId)),
  )[0];
  const { q, a } = bestForAlternative;
  return {
    reason:
      winners.length > 1
        ? `${names}均获得 ${top.raw} 分，并列第一。`
        : `你的回答给了${names}最多支持，共 ${top.raw} 分。`,
    evidence: (ordered?.length ? ordered : evidence)
      .slice(0, 3)
      .map((e) => e.text),
    tradeoff: `在「${q.text}」这题，你的选择为「${alternative.name}」贡献 ${points(a, alternative.optionId)} 分，为「${top.name}」贡献 ${points(a, top.optionId)} 分。若这项偏好改变，可以回去重选。`,
    next: nextSteps[next],
    uncertainty:
      winners.length > 1
        ? "现有回答无法拉开差距。可补充一个实际限制，再决定先试哪个。"
        : top.index - (runner?.index ?? 0) <= 10
          ? "前两项相差不超过 10 个指数点，一道题的回答就可能改变排名。"
          : "结论只使用了本次回答。尚未表达的限制或偏好，也可能改变你的选择。",
  };
}
