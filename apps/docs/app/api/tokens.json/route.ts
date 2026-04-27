import { getTokensApi } from "../../../lib/agent-artifacts";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getTokensApi());
}
