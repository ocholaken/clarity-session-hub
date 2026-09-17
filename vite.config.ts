import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { getContentForHour } from "./src/data/contentPool";

const messagesPath = path.resolve(__dirname, "messages.json");
type StoredMessage = { id?: string; name: string; email: string; subject: string; message: string; date: string; isRead?: boolean };

const readMessages = () => {
  try {
    const contents = fs.readFileSync(messagesPath, "utf8");
    return JSON.parse(contents) as StoredMessage[];
  } catch {
    return [];
  }
};

const sendJson = (response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void }, statusCode: number, body: unknown, headers: Record<string, string> = {}) => {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  Object.entries(headers).forEach(([name, value]) => response.setHeader(name, value));
  response.end(JSON.stringify(body));
};

const contentApi = () => ({
  name: "hourly-content-api",
  configureServer(server: { middlewares: { use: (path: string, handler: (request: { method?: string }, response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void }, next: () => void) => void) => void } }) {
    server.middlewares.use("/api/content/now", (request, response, next) => {
      if (request.method !== "GET") return next();
      const now = new Date();
      const hour = now.getHours();
      const nextHour = new Date(now);
      nextHour.setHours(hour + 1, 0, 0, 0);
      const { currentArticle, currentGuide } = getContentForHour(hour);
      const addWatermark = (piece: typeof currentArticle) => piece ? { ...piece, watermark: piece.premium ? "CLARITY SESSIONS PREMIUM" : null } : null;
      console.log(`Content rotated for hour ${hour}`);
      return sendJson(response, 200, {
        currentArticle: addWatermark(currentArticle),
        currentGuide: addWatermark(currentGuide),
        nextIn: nextHour.getTime() - now.getTime(),
        hour,
        isNewHour: now.getMinutes() === 0,
      }, { "Cache-Control": "public, max-age=3600" });
    });
  },
});

const contactApi = () => ({
  name: "contact-api",
  configureServer(server: { middlewares: { use: (path: string, handler: (request: { method?: string; url?: string; on: (event: string, callback: (chunk: Buffer) => void) => void }, response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void }, next: () => void) => void) => void } }) {
    server.middlewares.use("/api/contact", (request, response, next) => {
      if (request.method !== "POST") return next();

      let body = "";
      request.on("data", (chunk) => { body += chunk.toString(); });
      request.on("end", () => {
        try {
          const payload = JSON.parse(body) as Record<string, unknown>;
          const name = typeof payload.name === "string" ? payload.name.trim() : "";
          const email = typeof payload.email === "string" ? payload.email.trim() : "";
          const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
          const message = typeof payload.message === "string" ? payload.message.trim() : "";

          if (!name || !email || !subject || !message) {
            return sendJson(response, 400, { success: false, error: "All fields are required" });
          }

          const savedMessage = { id: crypto.randomUUID(), name, email, subject, message, date: new Date().toISOString(), isRead: false };
          const messages = [...readMessages(), savedMessage];
          fs.writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
          console.log("Contact message received:", savedMessage);
          return sendJson(response, 200, { success: true });
        } catch {
          return sendJson(response, 400, { success: false, error: "Invalid request" });
        }
      });
    });

    server.middlewares.use("/api/messages", (request, response, next) => {
      const match = request.url?.match(/(?:^\/api\/messages|^\/)(?:\/)?([^/?]+)$/);
      const messageId = match ? decodeURIComponent(match[1]) : null;
      const messages = readMessages();

      if (request.method === "GET") {
        return sendJson(response, 200, messages.map((item, index) => ({ ...item, id: item.id ?? `${item.date}-${index}`, isRead: item.isRead ?? false })));
      }

      if (!messageId || (request.method !== "PATCH" && request.method !== "DELETE")) return next();
      const index = messages.findIndex((item, itemIndex) => (item.id ?? `${item.date}-${itemIndex}`) === messageId);
      if (index === -1) return sendJson(response, 404, { success: false, error: "Message not found" });

      if (request.method === "DELETE") {
        messages.splice(index, 1);
        fs.writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
        return sendJson(response, 200, { success: true });
      }

      let body = "";
      request.on("data", (chunk) => { body += chunk.toString(); });
      request.on("end", () => {
        try {
          const payload = JSON.parse(body) as { isRead?: unknown };
          if (typeof payload.isRead !== "boolean") return sendJson(response, 400, { success: false, error: "isRead must be boolean" });
          messages[index] = { ...messages[index], isRead: payload.isRead };
          fs.writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
          return sendJson(response, 200, { success: true });
        } catch {
          return sendJson(response, 400, { success: false, error: "Invalid request" });
        }
      });
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), contentApi(), contactApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
