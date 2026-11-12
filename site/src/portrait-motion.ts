export type PortraitPose = "neutral" | "left" | "right" | "up" | "down";

/** A small dead zone and axis hysteresis prevent flickering near the centre/diagonals. */
export function selectPortraitPose(x: number, y: number, previous: PortraitPose = "neutral"): PortraitPose {
  const ax = Math.abs(x), ay = Math.abs(y);
  const threshold = previous === "neutral" ? .3 : .19;
  if (Math.max(ax, ay) < threshold) return "neutral";
  const horizontal = previous === "left" || previous === "right";
  const vertical = previous === "up" || previous === "down";
  if (horizontal && ax > .19 && ay < ax * 1.22) return x < 0 ? "left" : "right";
  if (vertical && ay > .19 && ax < ay * 1.22) return y < 0 ? "up" : "down";
  return ay > ax ? (y < 0 ? "up" : "down") : (x < 0 ? "left" : "right");
}

export function portraitPointer(clientX: number, clientY: number, box: {left: number; top: number; width: number; height: number}) {
  return {
    x: Math.max(-1, Math.min(1, (clientX - (box.left + box.width * .5)) / (box.width * .5))),
    y: Math.max(-1, Math.min(1, (clientY - (box.top + box.height * .35)) / (box.height * .4))),
  };
}
