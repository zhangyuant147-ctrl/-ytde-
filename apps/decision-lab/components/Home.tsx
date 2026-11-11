"use client";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CirclePlus,
  Compass,
  CornerDownRight,
  Lightbulb,
  LoaderCircle,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { decisionSchema, type Decision, type Session } from "../lib/model";
import { presets } from "../lib/demo";
import Balance from "./Balance";

const icons = [Compass, Utensils, BookOpen];
const captions = ["周末出行", "今天吃点啥", "学习与生活"];
export default function Home({ onReady }: { onReady: (s: Session) => void }) {
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<Decision["options"]>([
    { id: "first", name: "" },
    { id: "second", name: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [active, setActive] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const reduce = useReducedMotion(),
    x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x),
    sy = useSpring(y);
  function edit() {
    setErrors({});
    setActive("");
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    const parsed = decisionSchema.safeParse({ prompt, options });
    if (!parsed.success) {
      const found = Object.fromEntries(
        parsed.error.issues.map((issue) => [
          issue.path.join("."),
          issue.message,
        ]),
      );
      setErrors(found);
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    lock.current = true;
    setBusy(true);
    setErrors({});
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw Error();
      onReady(await response.json());
    } catch {
      setErrors({ form: "暂时连不上服务，请再试一次。" });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <motion.main
      className="shell home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <div className="workspace">
        <section
          className="intro"
          onPointerMove={(e) => {
            if (reduce || e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            x.set(((e.clientX - r.left) / r.width - 0.5) * 9);
            y.set(((e.clientY - r.top) / r.height - 0.5) * 7);
          }}
          onPointerLeave={() => {
            x.set(0);
            y.set(0);
          }}
        >
          <motion.span
            className="eyebrow"
            initial={{ rotate: -9, scale: 0.94 }}
            animate={{ rotate: -3, scale: 1 }}
          >
            <Sparkles size={15} fill="currentColor" /> AI 决策助手
          </motion.span>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            别纠结了<span className="bang">!</span>
          </motion.h1>
          <p className="subtitle">
            你的大脑已经开了 <strong>800</strong> 个会，
            <br />
            今天让 AI 帮你理清选择。
          </p>
          <motion.div
            className="art"
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.i
              aria-hidden="true"
              className="art-texture"
              style={{ x: sx, y: sy }}
            />
            <motion.div style={{ x: sx, y: sy }}>
              <Balance />
            </motion.div>
          </motion.div>
        </section>
        <section className="workcard">
          <div className="cardbar">
            <div>
              <SlidersHorizontal size={18} /> 决策工作台
            </div>
            <span className="windowdots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
          <form noValidate onSubmit={submit} aria-busy={busy}>
            <fieldset disabled={busy}>
              <label className="formlabel" htmlFor="prompt">
                <span className="num">01</span>你在纠结什么？
              </label>
              <input
                id="prompt"
                autoComplete="off"
                maxLength={120}
                placeholder="比如：这个周末去哪里？"
                value={prompt}
                aria-invalid={!!errors.prompt}
                aria-describedby={errors.prompt ? "prompt-err" : undefined}
                onChange={(e) => {
                  edit();
                  setPrompt(e.target.value);
                }}
              />
              {errors.prompt && (
                <p className="error" id="prompt-err">
                  {errors.prompt}
                </p>
              )}
              <div className="optionlabel">
                <span className="formlabel">
                  <span className="num lilac">02</span>有哪些选项？
                </span>
                <span className="count">{options.length} / 4</span>
              </div>
              <div className="options">
                {options.map((o, i) => {
                  const key = "options." + i + ".name";
                  return (
                    <div key={o.id}>
                      <div className="optionrow">
                        <label htmlFor={key} className="letter">
                          {String.fromCharCode(65 + i)}
                        </label>
                        <input
                          id={key}
                          aria-label={"选项 " + String.fromCharCode(65 + i)}
                          aria-invalid={!!errors[key]}
                          aria-describedby={
                            errors[key] ? key + "-err" : undefined
                          }
                          maxLength={36}
                          placeholder={
                            i === 0
                              ? "输入第一个选项"
                              : i === 1
                                ? "输入第二个选项"
                                : "输入候选选项"
                          }
                          value={o.name}
                          onChange={(e) => {
                            edit();
                            setOptions(
                              options.map((v) =>
                                v.id === o.id
                                  ? { ...v, name: e.target.value }
                                  : v,
                              ),
                            );
                          }}
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            className="remove"
                            aria-label={
                              "删除选项 " + String.fromCharCode(65 + i)
                            }
                            onClick={() => {
                              edit();
                              setOptions(options.filter((v) => v.id !== o.id));
                            }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      {errors[key] && (
                        <p className="error" id={key + "-err"}>
                          {errors[key]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {options.length < 4 && (
                <button
                  type="button"
                  className="add"
                  onClick={() => {
                    edit();
                    setOptions([
                      ...options,
                      { id: crypto.randomUUID(), name: "" },
                    ]);
                  }}
                >
                  <CirclePlus size={16} /> 添加选项
                </button>
              )}
              {errors.form && (
                <p role="alert" className="error">
                  {errors.form}
                </p>
              )}
              <motion.button
                className="primary start"
                whileTap={{ scale: 0.98 }}
                disabled={busy}
              >
                {busy ? (
                  <>
                    <LoaderCircle className="spin" size={19} /> 正在生成问答…
                  </>
                ) : (
                  <>
                    开始决策 <ArrowRight size={22} />
                  </>
                )}
              </motion.button>
            </fieldset>
          </form>
        </section>
      </div>
      <section className="examples">
        <div className="examples-title">
          <Lightbulb size={23} />
          <h2>试试这些难题</h2>
          <span className="dashline" />
        </div>
        <div className="examplegrid">
          {presets.map((p, i) => {
            const Icon = icons[i];
            return (
              <button
                key={p.id}
                disabled={busy}
                className={
                  "example ex" + i + (active === p.id ? " active" : "")
                }
                onClick={() => {
                  setPrompt(p.prompt);
                  setOptions(p.options.map((o) => ({ ...o })));
                  setActive(p.id);
                  setErrors({});
                  document.getElementById("prompt")?.focus();
                }}
              >
                <span className="exicon">
                  <Icon size={23} />
                </span>
                <span>
                  <small>{captions[i]}</small>
                  <b>{p.prompt}</b>
                </span>
                {active === p.id ? (
                  <CornerDownRight size={19} />
                ) : (
                  <ArrowUpRight size={19} />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </motion.main>
  );
}
