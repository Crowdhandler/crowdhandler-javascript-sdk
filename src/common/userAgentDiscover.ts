import { z } from "zod";

//Response structure validation
const RequestObject = z
  .object({
    headers: z.object({}).catchall(z.any()),
  })
  .catchall(z.any());

export function getUserAgent(request: any) {
  let userAgent: string | undefined;
  let userAgentStr = request.getHeader("user-agent");
  if (userAgentStr) {
    userAgent = userAgentStr;
  }
  return userAgent;
}
