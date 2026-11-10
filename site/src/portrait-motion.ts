export type PortraitPose = "neutral" | "left" | "right" | "up" | "down" | "happy";

export function selectPortraitPose(x: number, y: number, nearFace: boolean): PortraitPose {
  if (nearFace) return "happy";
  if (Math.max(Math.abs(x), Math.abs(y)) < 0.28) return "neutral";
  if (Math.abs(y) > Math.abs(x)) return y < 0 ? "up" : "down";
  return x < 0 ? "left" : "right";
}

export function portraitPointer(clientX: number, clientY: number, box: {left: number; top: number; width: number; height: number}) {
  const offsetX = clientX - (box.left + box.width * 0.5);
  const offsetY = clientY - (box.top + box.height * 0.35);
  return {
    x: Math.max(-1, Math.min(1, offsetX / (box.width * 0.42))),
    y: Math.max(-1, Math.min(1, offsetY / (box.height * 0.3))),
    nearFace: Math.abs(offsetX) < box.width * 0.18 && Math.abs(offsetY) < box.height * 0.14,
  };
}
