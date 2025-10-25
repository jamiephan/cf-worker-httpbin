import { Hono } from "hono";
import { nanoid } from "nanoid";
import { KVBin } from "./../interface/KBBin";
import placeholder from "../placeholders";
import validateTurnstile from "./helpers/turnstile";
import type { BinResponse } from "./../interface/BinResponse";
import type { BinRequestCaptcha } from "../interface/BinRequestCaptcha";

const app = new Hono<{ Bindings: Env }>();

// A Post endpoint to receive the form data
app.post("/api/bin", async (c) => {
  const req = await c.req.json<BinRequestCaptcha>();
  const remoteIp = c.req.header("CF-Connecting-IP") || "";

  try {
    // Validate Turnstile token
    const turnstileToken = req.turnstileToken;

    const r = await validateTurnstile(turnstileToken, remoteIp);
    if (!r.success) {
      return c.json({ error: "Turnstile validation failed" }, 400);
    }
  } catch (e) {
    console.log(e);
    return c.json({ error: "Turnstile validation failed" }, 400);
  }

  // Generate a unique bin ID
  const binId = nanoid();
  const token = nanoid();
  // Store the request data in KV
  await c.env.CF_KV.put(
    binId,
    JSON.stringify({
      method: req.method,
      statusCode: req.statusCode,
      header: req.header,
      body: req.body,
      token: token,
      ipAddress: remoteIp,
    } as KVBin)
  );
  return c.json<BinResponse>({
    bin: binId,
    token: token,
  });
});

// Delete endpoint to remove a bin with ?token=token
app.delete("/api/bin/:binId", async (c) => {
  const { binId } = c.req.param();
  const token = c.req.query("token");
  if (!token) {
    return c.json({ error: "Missing token" }, 400);
  }

  // Get the bin data from KV
  const binData = await c.env.CF_KV.get(binId);
  if (!binData) {
    return c.json({ error: "Bin not found" }, 404);
  }
  const data = JSON.parse(binData) as KVBin;
  if (data.token !== token) {
    return c.json({ error: "Invalid token" }, 403);
  }
  await c.env.CF_KV.delete(binId);
  return c.json({ success: true });
});

app.all("/bin/:binId", async (c) => {
  const { binId } = c.req.param();
  const method = c.req.method;
  const binData = await c.env.CF_KV.get(binId);
  if (!binData) {
    return c.json({ error: "Not found" }, 404);
  }
  const data = JSON.parse(binData) as KVBin;

  // Check if the method matches
  if (data.method !== "ANY" && data.method !== method) {
    return c.json({ error: "Method not allowed" }, 405);
  }

  const body = placeholder(data.body);

  const headers = data.header;
  // Response with the stored status code, headers, and body
  return new Response(body, {
    status: data.statusCode,
    headers: headers.reduce((acc, curr) => {
      acc.append(placeholder(curr.name), placeholder(curr.value));
      return acc;
    }, new Headers()),
  });
});

export default app;
