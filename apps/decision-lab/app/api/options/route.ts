import { readBody } from "../../../lib/http";
import { ideaRequest } from "../../../lib/option-ideas";
import { suggestOptions } from "../../../lib/server";

export const maxDuration = 30;
export async function POST(req: Request) {
  const request = ideaRequest.safeParse(await readBody(req).catch(() => null));
  if (!request.success)
    return Response.json({ error: "请检查难题和已有选项。" }, { status: 400 });
  return Response.json(await suggestOptions(request.data));
}
