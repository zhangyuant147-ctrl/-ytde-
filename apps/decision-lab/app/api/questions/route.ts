import { decisionSchema } from "../../../lib/model";
import { generate } from "../../../lib/server";
import { readBody } from "../../../lib/http";
export const maxDuration = 30;
export async function POST(req: Request) {
  const parsed = decisionSchema.safeParse(
    await readBody(req).catch(() => null),
  );
  if (!parsed.success)
    return Response.json(
      { error: "请检查问题和候选项", issues: parsed.error.issues },
      { status: 400 },
    );
  return Response.json(await generate(parsed.data));
}
