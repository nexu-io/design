import { generateLlmsText } from "../../lib/agent-artifacts";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateLlmsText(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
