import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiApp from "./artifacts/api-server/src/app";

async function startServer() {
  const PORT = Number(process.env.PORT || 3000);
  const app = express();

  // Mount API server router (handles all /api/* routes)
  app.use(apiApp);

  // Development vs Production static/Vite handling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: path.resolve(process.cwd(), "artifacts/unihub/vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "artifacts/unihub/dist/public");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UniHub] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[UniHub] Failed to start server:", err);
  process.exit(1);
});
