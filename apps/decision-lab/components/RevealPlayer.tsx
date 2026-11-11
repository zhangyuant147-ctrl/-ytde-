"use client";
import { Player } from "@remotion/player";
import { Reveal } from "./Reveal";
import type { Score } from "../lib/model";
export default function RevealPlayer({ rows }: { rows: Score[] }) {
  return (
    <Player
      component={Reveal}
      inputProps={{ rows }}
      durationInFrames={150}
      fps={30}
      compositionWidth={760}
      compositionHeight={600}
      autoPlay
      moveToBeginningWhenEnded={false}
      controls
      style={{ width: "100%", aspectRatio: "760/600" }}
    />
  );
}
