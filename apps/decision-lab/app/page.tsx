import DecisionApp from "../components/DecisionApp";
import { aiEnabled } from "../lib/server";
export const dynamic = "force-dynamic";
export default function Page() {
  return <DecisionApp configuredAI={aiEnabled()} />;
}
