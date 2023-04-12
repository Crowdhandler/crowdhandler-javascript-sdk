import { z } from "zod";

//Response structure validation
const RequestObject = z
  .object({
    headers: z.object({}).catchall(z.any()),
  })
  .catchall(z.any());

export function getLang(request: any) {
  let lang: string | undefined;
  let langStr = request.getHeader("accept-language");
  if (langStr) {
    lang = langStr;
  }
  return lang;
}
