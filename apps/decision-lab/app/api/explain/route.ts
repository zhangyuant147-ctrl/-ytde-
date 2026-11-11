import { z } from "zod";
import { sessionSchema, responseSchema } from "../../../lib/model";
import { summarize } from "../../../lib/server";
import { readBody } from "../../../lib/http";
export const maxDuration = 30;
const schema = z.object({
  session: sessionSchema,
  choices: z.array(responseSchema).min(3).max(5),
});
export async function POST(req: Request) {
  try {
    const { session, choices } = schema.parse(await readBody(req));
    return Response.json(await summarize(session, choices));
  } catch {
    return Response.json(
      { error: "题目或回答不完整，请返回检查。" },
      { status: 400 },
    );
  }
}
