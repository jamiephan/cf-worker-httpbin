import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import type { BinResponse } from "./../interface/BinResponse";
import type { BinRequest } from "./../interface/BinRequest";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// A Post endpoint to receive the form data
app.post("/api/bin", async (c) => {
  const req = await c.req.json<BinRequest>();
  return c.json<BinResponse>({
    bin: uuidv4(),
  });
});

export default app;
