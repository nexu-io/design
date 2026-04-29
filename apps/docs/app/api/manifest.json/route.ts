import { getAgentManifest } from "../../../lib/agent-artifacts";

export const dynamic = "force-static";

export function GET() {
  return Response.json(getAgentManifest());
}
