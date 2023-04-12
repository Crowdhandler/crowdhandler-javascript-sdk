import { sha256 } from "js-sha256";

export function generateSignature(input: string) {
  const hash = sha256(input);
  return hash;
}
