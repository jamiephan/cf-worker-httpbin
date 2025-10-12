import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import type { BinResponse } from "./../interface/BinResponse";
import type { BinRequest } from "./../interface/BinRequest";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// A Post endpoint to receive the form data
app.post("/api/bin", async (c) => {
  const req = await c.req.json<BinRequest>();
  // Generate a unique bin ID
  const binId = uuidv4();
  // Store the request data in KV
  await c.env.CF_KV.put(binId, JSON.stringify(req));
  return c.json<BinResponse>({
    bin: binId,
  });
});

export default app;
