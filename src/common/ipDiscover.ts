//Get source IP address of the request in node.js
import { z } from "zod";

//Response structure validation
const RequestObject = z
  .object({
    headers: z.object({}).catchall(z.any()),
  })
  .catchall(z.any());

export function getIP(request: any) {
  let ip = request.getHeader("x-forwarded-for") || request.getUserHostAddress();
  if (ip.indexOf(",") > -1) {
    // If there are multiple IPs in the x-forwarded-for header,
    // get the client's IP address, not the proxy addresses
    const ips = ip.split(",");
    ip = ips[0].trim();
  }

  return ip;
}
