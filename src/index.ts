const token = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
export function parseCookies(header: string): Record<string, string> {
  const result: Record<string, string> = Object.create(null) as Record<
    string,
    string
  >;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 1) continue;
    const key = part.slice(0, i).trim();
    if (!token.test(key) || Object.hasOwn(result, key)) continue;
    const raw = part.slice(i + 1).trim();
    try {
      result[key] = decodeURIComponent(raw);
    } catch {
      result[key] = raw;
    }
  }
  return result;
}
export interface CookieOptions {
  path?: string;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}
export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): string {
  if (!token.test(name)) throw new TypeError("Invalid cookie name");
  const parts = [name + "=" + encodeURIComponent(value)];
  if (options.path !== undefined) {
    if (!/^[\x20-\x3A\x3C-\x7E]+$/.test(options.path))
      throw new TypeError("Invalid path");
    parts.push("Path=" + options.path);
  }
  if (options.maxAge !== undefined) {
    if (!Number.isSafeInteger(options.maxAge))
      throw new RangeError("Invalid maxAge");
    parts.push("Max-Age=" + options.maxAge);
  }
  if (
    options.sameSite !== undefined &&
    !["Strict", "Lax", "None"].includes(options.sameSite)
  )
    throw new TypeError("Invalid SameSite");
  if (options.sameSite === "None" && !options.secure)
    throw new TypeError("SameSite=None requires Secure");
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push("SameSite=" + options.sameSite);
  return parts.join("; ");
}
