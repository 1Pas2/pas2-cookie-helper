import { serializeCookie } from "../dist/index.js";
console.log(
  serializeCookie("session", "value", {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
  }),
);
