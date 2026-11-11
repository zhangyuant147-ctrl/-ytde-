import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { generate, summarize, chatClient } from "../lib/server";
import { presets, demoQuestions } from "../lib/demo";
import { decisionSchema } from "../lib/model";
const d = decisionSchema.parse(presets[0]),
  qs = demoQuestions(d);
const choices = qs.map((q) => ({
  questionId: q.id,
  answerId: q.answers[0].id,
}));
const original = { key: process.env.AI_API_KEY, mode: process.env.DEMO_MODE };
beforeEach(() => {
  process.env.AI_API_KEY = "test-only";
  process.env.DEMO_MODE = "false";
});
afterEach(() => {
  for (const [k, v] of [
    ["AI_API_KEY", original.key],
    ["DEMO_MODE", original.mode],
  ] as const) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});
test("without a key, and in forced demo, neither endpoint contacts an upstream", async () => {
  let calls = 0;
  const chat = async () => {
    calls++;
    return {};
  };
  for (const mode of ["false", "true"]) {
    process.env.DEMO_MODE = mode;
    if (mode === "false") delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = "test-only";
    const s = await generate(d, chat);
    assert.equal(s.mode, "demo");
    assert.equal((await summarize(s, choices, chat)).mode, "demo");
  }
  assert.equal(calls, 0);
});
for (const fault of ["json", "timeout", "status", "schema"])
  test(
    fault + " retries once, shows fallback, and stays local for explanation",
    async () => {
      let calls = 0;
      const chat = chatClient(12, async (_url, init) => {
        calls++;
        if (fault === "timeout")
          await delay(1000, undefined, { signal: init?.signal ?? undefined });
        if (fault === "status") return new Response(null, { status: 503 });
        return Response.json({
          choices: [
            { message: { content: fault === "json" ? "[invalid" : "{}" } },
          ],
        });
      });
      const s = await generate(d, chat);
      assert.equal(s.mode, "demo");
      assert.match(s.notice, /切换/);
      await summarize(s, choices, chat);
      assert.equal(calls, 2);
    },
  );
test("verified AI session selects evidence; invalid plans cannot replace computed rows", async () => {
  const s = await generate(d, async () => ({ questions: qs }));
  assert.equal(s.mode, "ai");
  const result = await summarize(s, choices, async () => ({
    evidenceIds: [qs[0].id],
    nextStep: 1,
  }));
  assert.equal(result.mode, "ai");
  assert.equal(result.explanation.evidence.length, 1);
  const fallback = await summarize(s, choices, async () => ({
    evidenceIds: ["other"],
    nextStep: 2,
    rows: [],
  }));
  assert.equal(fallback.mode, "demo");
  assert.deepEqual(fallback.rows, result.rows);
  let calls = 0;
  await summarize({ ...s, proof: "invalid" }, choices, async () => {
    calls++;
  });
  assert.equal(calls, 0);
});
