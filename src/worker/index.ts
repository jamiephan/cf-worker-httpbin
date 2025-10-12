import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import type { BinResponse } from "./../interface/BinResponse";
import type { BinRequest } from "./../interface/BinRequest";

const app = new Hono<{ Bindings: Env }>();

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

// Delete endpoint to remove a bin
app.delete("/api/bin/:binId", async (c) => {
  const { binId } = c.req.param();
  await c.env.CF_KV.delete(binId);
  return c.json({ success: true });
});

app.all("/bin/:binId", async (c) => {
  const { binId } = c.req.param();
  const binData = await c.env.CF_KV.get(binId);
  if (!binData) {
    return c.json({ error: "Not found" }, 404);
  }
  const data = JSON.parse(binData) as BinRequest;

  const headers = data.header;
  // Response with the stored status code, headers, and body
  return new Response(data.body, {
    status: data.statusCode,
    headers: headers.reduce((acc, curr) => {
      acc.append(curr.name, curr.value);
      return acc;
    }, new Headers()),
  });
});

export default app;
