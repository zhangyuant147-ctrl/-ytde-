"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  FastForward,
  Flag,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { Outcome } from "./DecisionApp";
import { percent, type Session } from "../lib/model";
const RevealPlayer = dynamic(() => import("./RevealPlayer"), {
  ssr: false,
  loading: () => <p className="playerload">正在准备揭晓动画…</p>,
});
export default function Results({
  session,
  result,
  heading,
  onEdit,
  onReset,
  answers,
}: {
  session: Session;
  result: Outcome;
  heading: React.RefObject<HTMLHeadingElement | null>;
  onEdit: () => void;
  onReset: () => void;
  answers: Record<string, string>;
}) {
  const reduced = useReducedMotion(),
    [skip, setSkip] = useState(false),
    [replay, setReplay] = useState(0);
  const { rows, explanation: e } = result,
    winners = rows.filter((r) => r.rank === 1);
  return (
    <motion.main
      className="shell result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <span className="eyebrow">
        <Trophy size={16} /> 决策结果
      </span>
      <p className="context">{session.decision.prompt}</p>
      <h1 ref={heading} tabIndex={-1}>
        {winners.length === 1 ? "更适合现在的你" : "这些选项并列推荐"}
      </h1>
      <div className="winners">
        {winners.map((w) => (
          <strong key={w.optionId}>{w.name}</strong>
        ))}
      </div>
      <div className="resultgrid">
        <section className="resultcard">
          <div className="cardbar">
            <div>
              <Flag size={17} /> 匹配指数
            </div>
          </div>
          <div className="rbody">
            {rows.map((r, i) => (
              <div className="scorerow" key={r.optionId}>
                <div>
                  <b>
                    <small>#{r.rank}</small> {r.name}
                  </b>
                  <strong>{percent(r.index)}%</strong>
                </div>
                <div className="track">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: r.index + "%" }}
                    transition={{
                      duration: reduced ? 0 : 0.65,
                      delay: reduced ? 0 : i * 0.06,
                    }}
                    style={{
                      background: ["#FFD93D", "#A78BFA", "#FF5A36", "#BDE6C0"][
                        i
                      ],
                    }}
                  />
                </div>
                <small>
                  {r.raw} / {session.questions.length * 5} 分
                </small>
              </div>
            ))}
            <p className="fine">
              匹配指数反映你在本次问答中的偏好，不代表客观正确率。
            </p>
          </div>
        </section>
        {!reduced && (
          <section className="resultcard film">
            <div className="cardbar">
              <div>
                <Sparkles size={17} /> 结果揭晓
              </div>
            </div>
            {skip ? (
              <div className="still">
                <Trophy size={40} />
                <b>揭晓完成</b>
              </div>
            ) : (
              <RevealPlayer key={replay} rows={rows} />
            )}
            <div className="playeractions">
              <button
                onClick={() => {
                  setSkip(false);
                  setReplay((v) => v + 1);
                }}
              >
                <RotateCcw size={16} />
                重播动画
              </button>
              {!skip && (
                <button onClick={() => setSkip(true)}>
                  <FastForward size={16} />
                  跳过动画
                </button>
              )}
            </div>
          </section>
        )}
      </div>
      <section className="resultcard details">
        <h2>为什么这样选？</h2>
        <p className="notice">{result.notice}</p>
        <p>{e.reason}</p>
        <ul>
          {e.evidence.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
        <h3>候选项之间的取舍</h3>
        <p>{e.tradeoff}</p>
        <p>{e.uncertainty}</p>
        <h3>试试下一步</h3>
        <p>{e.next}</p>
        <details>
          <summary>查看逐题评分依据</summary>
          {session.questions.map((q) => {
            const a = q.answers.find((a) => a.id === answers[q.id])!;
            return (
              <div key={q.id}>
                <h4>{q.text}</h4>
                <p>你的回答：{a.text}</p>
                <ul>
                  {a.weights.map((w) => (
                    <li key={w.optionId}>
                      {
                        session.decision.options.find(
                          (o) => o.id === w.optionId,
                        )?.name
                      }{" "}
                      +{w.points}：{w.reason}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </details>
      </section>
      <div className="actions">
        <button className="secondary" onClick={onEdit}>
          <ArrowLeft size={17} />
          修改答案
        </button>
        <button className="primary" onClick={onReset}>
          <RefreshCw size={17} />
          重新开始
        </button>
      </div>
    </motion.main>
  );
}
