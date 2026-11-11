import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";
import { percent, type Score } from "../lib/model";
export const colors = ["#FFD93D", "#A78BFA", "#FF5A36", "#BDE6C0"];
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
export function Reveal({ rows }: { rows: Score[] }) {
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig();
  const flip = spring({
    frame: frame - 18,
    fps,
    config: { damping: 15, stiffness: 110 },
  });
  const winners = rows.filter((r) => r.rank === 1);
  const title =
    winners.length === 1 ? winners[0].name : winners.length + " 项并列推荐";
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#A78BFA",
        backgroundImage: "radial-gradient(#7256a8 1.3px,transparent 1.3px)",
        backgroundSize: "12px 12px",
        color: "#171717",
        fontFamily: "Arial, PingFang SC, sans-serif",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = interpolate(frame, [0, 22], [1, 0], clamp);
        const angle = (i * Math.PI) / 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 82,
              height: 82,
              border: "4px solid",
              background: colors[i % 4],
              borderRadius: i % 2 ? "50%" : 12,
              opacity: interpolate(frame, [18, 27], [1, 0], clamp),
              transform: `translate(${Math.cos(angle) * 300 * t}px,${Math.sin(angle) * 230 * t}px) rotate(${i * 18 + frame * 3}deg)`,
            }}
          />
        );
      })}
      <div
        style={{
          width: "86%",
          padding: "24px 30px",
          border: "4px solid",
          borderRadius: 22,
          background: "#FFFBED",
          boxShadow: "9px 9px #171717",
          transform: `perspective(900px) rotateY(${(1 - flip) * 90}deg) scale(${0.9 + flip * 0.1})`,
          opacity: frame < 18 ? 0 : 1,
        }}
      >
        <div style={{ fontSize: 25, fontWeight: 900 }}>
          ✦ {winners.length > 1 ? "并列揭晓" : "你的推荐"}
        </div>
        <div
          style={{
            fontSize: title.length > 16 ? 31 : title.length > 8 ? 38 : 54,
            fontWeight: 950,
            lineHeight: 1.16,
            margin: "10px 0 15px",
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </div>
        {rows.map((r, i) => {
          const start = 40 + i * 8;
          const gain = interpolate(frame, [start, start + 38], [0, 1], clamp);
          return (
            <div key={r.optionId} style={{ marginTop: 11 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  lineHeight: 1.12,
                  fontWeight: 800,
                  fontSize: r.name.length > 20 ? 26 : 30,
                }}
              >
                <span style={{ overflowWrap: "anywhere" }}>
                  {r.rank}. {r.name}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: 28 }}>
                  {percent(gain * r.index)}%
                </span>
              </div>
              <div
                style={{
                  border: "2px solid",
                  borderRadius: 12,
                  background: "white",
                  height: 14,
                  overflow: "hidden",
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: gain * r.index + "%",
                    background: colors[i],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {Array.from({ length: 22 }, (_, i) => {
        const t = interpolate(frame, [106, 146], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              pointerEvents: "none",
              width: 7 + random("w" + i) * 7,
              height: 14,
              left: random("x" + i) * 100 + "%",
              top: -8 + t * (82 + random("y" + i) * 38) + "%",
              background: colors[i % 4],
              border: "1px solid",
              opacity: frame < 106 ? 0 : 1 - t,
              transform: `rotate(${t * 325 + i * 20}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}
