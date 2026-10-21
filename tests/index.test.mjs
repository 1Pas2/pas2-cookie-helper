import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as api from "../dist/index.js";
test("parse duplicates and encoding", () => {
  const c = api.parseCookies("a=hello%20world; a=second; b=%XX");
  assert.equal(c.a, "hello world");
  assert.equal(c.b, "%XX");
});
test("serialize flags", () =>
  assert.equal(
    api.serializeCookie("sid", "a b", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    }),
    "sid=a%20b; HttpOnly; Secure; SameSite=Lax",
  ));
test("injection and insecure None", () => {
  assert.throws(() => api.serializeCookie("a", "b", { path: "/;evil" }));
  assert.throws(() => api.serializeCookie("a", "b", { sameSite: "None" }));
});
