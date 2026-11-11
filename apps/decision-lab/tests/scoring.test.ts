import test from "node:test";
import assert from "node:assert/strict";
import { demoQuestions, presets } from "../lib/demo";
import {
  decisionSchema,
  score,
  validateQuestions,
  type Question,
} from "../lib/model";
const d = decisionSchema.parse(presets[2]);
const questions = () => demoQuestions(d);
const pick = (qs: Question[], option: string) =>
  qs.map((q) => ({
    questionId: q.id,
    answerId: q.answers.find((a) =>
      a.weights.some((w) => w.optionId === option && w.points === 5),
    )!.id,
  }));
test("trim and reject empty, normalized duplicates, repeated IDs and overlength labels", () => {
  assert.equal(
    decisionSchema.parse({ ...d, prompt: "  读书？  " }).prompt,
    "读书？",
  );
  for (const options of [
    [{ id: "a", name: " " }, d.options[1]],
    [
      { id: "a", name: "A" },
      { id: "b", name: " Ａ " },
    ],
    [d.options[0], { ...d.options[1], id: d.options[0].id }],
    [{ id: "a", name: "中".repeat(37) }, d.options[1]],
  ]) {
    assert.equal(decisionSchema.safeParse({ ...d, options }).success, false);
  }
});
test("scores remain ID-linked when questions, options, weights and choices are reordered", () => {
  const qs = questions(),
    choices = pick(qs, "learn");
  qs.forEach((q) => q.answers.forEach((a) => a.weights.reverse()));
  const rows = score(
    { ...d, options: [...d.options].reverse() },
    qs.reverse(),
    choices,
  );
  assert.deepEqual(
    rows.map((r) => [r.optionId, r.raw, r.index, r.rank]),
    [
      ["learn", 15, 100, 1],
      ["rest", 0, 0, 2],
    ],
  );
  choices[0] = pick(questions(), "rest")[0];
  assert.equal(score(d, qs, choices)[0].raw, 10);
});
test("co-winners keep rank 1 even at zero; incomplete or mismatched choices fail", () => {
  const qs = questions();
  qs.forEach((q) =>
    q.answers.push({
      id: q.id + "-none",
      text: "都还没想好",
      weights: d.options.map((o) => ({
        optionId: o.id,
        points: 0,
        reason: "没有偏好",
      })),
    }),
  );
  validateQuestions(d, qs);
  const picks = qs.map((q) => ({ questionId: q.id, answerId: q.id + "-none" }));
  assert.deepEqual(
    score(d, qs, picks).map((r) => [r.raw, r.rank]),
    [
      [0, 1],
      [0, 1],
    ],
  );
  for (const bad of [
    picks.slice(1),
    [picks[0], picks[0], picks[2]],
    picks.map((c) => ({ ...c, answerId: "unknown" })),
  ])
    assert.throws(() => score(d, qs, bad));
});
test("all curated presets have valid distinct questions and references", () => {
  for (const p of presets) validateQuestions(p, demoQuestions(p));
});
test("reject duplicate IDs, incorrect cardinality, missing/unknown weights, out-of-range and flat scoring", () => {
  const mutations: ((q: Question[]) => void)[] = [
    (q) => q.pop(),
    (q) => q[0].answers.pop(),
    (q) => {
      q[1].id = q[0].id;
    },
    (q) => {
      q[0].answers[1].id = q[1].answers[0].id;
    },
    (q) => q[0].answers[0].weights.pop(),
    (q) => {
      q[0].answers[0].weights[0].optionId = "other";
    },
    (q) => {
      q[0].answers[0].weights[0].points = 6;
    },
    (q) => {
      q[0].answers.forEach((a) =>
        a.weights.forEach((w) => {
          w.points = 2;
        }),
      );
    },
  ];
  for (const change of mutations) {
    const qs = questions();
    change(qs);
    assert.throws(() => validateQuestions(d, qs));
  }
});
