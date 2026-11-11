import { registerRoot, Composition } from "remotion";
import { Reveal } from "../components/Reveal";
import { demoQuestions, presets } from "../lib/demo";
import { score } from "../lib/model";
const sample = presets[0];
const questions = demoQuestions(sample);
const rows = score(
  sample,
  questions,
  questions.map((q) => ({ questionId: q.id, answerId: q.answers[0].id })),
);
const Root = () => (
  <Composition
    id="DecisionReveal"
    component={Reveal}
    width={760}
    height={600}
    fps={30}
    durationInFrames={150}
    defaultProps={{ rows }}
  />
);
registerRoot(Root);
