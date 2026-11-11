"use client";
import { useRef, useState, useEffect } from "react";
import { MotionConfig, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Flag,
  LoaderCircle,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Home from "./Home";
import Results from "./Results";
import {
  type Choice,
  type Explanation,
  type Score,
  type Session,
} from "../lib/model";

export type Outcome = {
  rows: Score[];
  explanation: Explanation;
  mode: "ai" | "demo";
  notice: string;
};
export default function DecisionApp({
  configuredAI,
}: {
  configuredAI: boolean;
}) {
  const [session, setSession] = useState<Session | null>(null),
    [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}),
    [result, setResult] = useState<Outcome | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const lock = useRef(false),
    guide = useRef<HTMLDialogElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const mode = result?.mode ?? session?.mode ?? (configuredAI ? "ai" : "demo");
  const q = session?.questions[index];
  useEffect(() => {
    if (session) {
      heading.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }, [session, index, result]);
  async function next() {
    if (!session || !q || !answers[q.id] || lock.current) return;
    if (index < session.questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    setBusy(true);
    lock.current = true;
    setError("");
    const choices: Choice[] = session.questions.map(({ id }) => ({
      questionId: id,
      answerId: answers[id],
    }));
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, choices }),
      });
      if (!res.ok) throw Error();
      setResult(await res.json());
    } catch {
      setError("结果暂时没有加载出来，答案已保留，请再试一次。");
    } finally {
      setBusy(false);
      lock.current = false;
    }
  }
  const reset = () => {
    setSession(null);
    setResult(null);
    setAnswers({});
    setIndex(0);
    setError("");
    window.scrollTo(0, 0);
  };
  return (
    <MotionConfig reducedMotion="user">
      <div className="site">
        <header>
          <div className="shell nav">
            <div className="brand">
              <span className="logo">
                <Zap size={23} fill="currentColor" />
              </span>
              <b>纠结终结者</b>
            </div>
            <div className="tools">
              <span className="mode">
                <i className={mode} />
                {mode === "ai" ? "AI 模式" : "演示模式"}
              </span>
              <button
                className="help"
                onClick={() => guide.current?.showModal()}
                aria-label="使用说明"
              >
                <CircleHelp size={19} />
                <span>使用说明</span>
              </button>
            </div>
          </div>
        </header>
        <dialog ref={guide} aria-labelledby="guide-title">
          <div className="dlghead">
            <h2 id="guide-title">怎么玩？</h2>
            <button
              aria-label="关闭说明"
              onClick={() => guide.current?.close()}
            >
              <X />
            </button>
          </div>
          <ol>
            <li>写下你的难题，列出 2–4 个候选项。</li>
            <li>按当下的真实想法回答卡片，可回头修改。</li>
            <li>查看匹配指数、回答依据和下一步建议。</li>
          </ol>
          <p>
            每次回答给各选项贡献 0–5
            分。总分除以本轮满分就是匹配指数，相同分数并列。
          </p>
        </dialog>
        {!session ? (
          <Home onReady={setSession} />
        ) : result ? (
          <Results
            answers={answers}
            session={session}
            result={result}
            heading={heading}
            onEdit={() => {
              setResult(null);
              setIndex(0);
            }}
            onReset={reset}
          />
        ) : (
          q && (
            <main className="shell flow">
              <p className="eyebrow">
                <Sparkles size={15} /> 偏好问答
              </p>
              <p className="context">{session.decision.prompt}</p>
              <div className="quizbox">
                <div className="cardbar">
                  <div>
                    <Flag size={17} /> 你的偏好
                  </div>
                  <span>
                    {index + 1} / {session.questions.length}
                  </span>
                </div>
                <div className="quizbody">
                  <div
                    className="progress"
                    aria-label={`第 ${index + 1} 题，共 ${session.questions.length} 题`}
                  >
                    {session.questions.map((v, i) => (
                      <i key={v.id} className={i <= index ? "filled" : ""} />
                    ))}
                  </div>
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h1 tabIndex={-1} ref={heading}>
                      {q.text}
                    </h1>
                    <div className="answers">
                      {q.answers.map((a, i) => (
                        <motion.button
                          type="button"
                          disabled={busy}
                          aria-pressed={answers[q.id] === a.id}
                          key={a.id}
                          whileHover={{ rotateY: 2, rotateZ: -0.4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setAnswers({ ...answers, [q.id]: a.id })
                          }
                        >
                          <span className="letter">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <b>{a.text}</b>
                          <span className="tick">
                            {answers[q.id] === a.id && <Check size={16} />}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                  <div className="actions">
                    <button
                      className="secondary"
                      disabled={index === 0 || busy}
                      onClick={() => setIndex(index - 1)}
                    >
                      <ArrowLeft size={16} />
                      上一题
                    </button>
                    <button
                      className="primary"
                      disabled={!answers[q.id] || busy}
                      onClick={next}
                    >
                      {busy ? (
                        <>
                          <LoaderCircle size={18} className="spin" />
                          计算中…
                        </>
                      ) : (
                        <>
                          {index === session.questions.length - 1
                            ? "揭晓结果"
                            : "下一题"}
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                  {error && (
                    <p role="alert" className="error">
                      {error}
                    </p>
                  )}
                </div>
              </div>
              <p className="notice" role="status">
                {session.notice}
              </p>
            </main>
          )
        )}
        <footer>
          <div className="shell foot">
            <span>
              <Zap size={14} fill="currentColor" /> 纠结终结者
            </span>
            <span>别纠结了，让 AI 帮你理清选择。</span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
