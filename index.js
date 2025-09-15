// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  bookings;
  constructor() {
    this.bookings = /* @__PURE__ */ new Map();
  }
  async getBooking(id) {
    return this.bookings.get(id);
  }
  async getAllBookings() {
    return Array.from(this.bookings.values()).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async createBooking(insertBooking) {
    const id = randomUUID();
    const booking = {
      ...insertBooking,
      id,
      registrationNumber: insertBooking.registrationNumber || null,
      message: insertBooking.message || null,
      nationalIdImage: insertBooking.nationalIdImage || null,
      goldCardImage: insertBooking.goldCardImage || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  wilaya: text("wilaya").notNull(),
  commune: text("commune").notNull(),
  businessType: text("business_type").notNull(),
  // commercant, artisan, fellah
  registrationNumber: text("registration_number"),
  // conditional field
  truckModel: text("truck_model").notNull(),
  // 3.5 or 6
  message: text("message"),
  nationalIdImage: text("national_id_image"),
  // صورة بطاقة التعريف الوطنية
  goldCardImage: text("gold_card_image"),
  // صورة الواجهة الأمامية للبطاقة الذهبية
  createdAt: timestamp("created_at").defaultNow()
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
}).extend({
  firstName: z.string().min(1, "Le pr\xE9nom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  phone: z.string().min(1, "Le t\xE9l\xE9phone est requis"),
  email: z.string().email("Email invalide"),
  wilaya: z.string().min(1, "La wilaya est requise"),
  commune: z.string().min(1, "La commune est requise"),
  businessType: z.enum(["commercant", "artisan", "fellah"], {
    required_error: "Le type d'activit\xE9 est requis"
  }),
  registrationNumber: z.string().optional(),
  truckModel: z.enum(["3.5", "6"], {
    required_error: "Le mod\xE8le de camion est requis"
  }),
  message: z.string().optional(),
  nationalIdImage: z.string().optional(),
  goldCardImage: z.string().optional()
});

// server/routes.ts
import { z as z2 } from "zod";
async function sendTelegramNotification(booking) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram credentials not configured");
    return;
  }
  const message = `
\u{1F69B} *\u0637\u0644\u0628 \u062D\u062C\u0632 \u062C\u062F\u064A\u062F - New Booking Request*

\u{1F464} *\u0627\u0644\u0627\u0633\u0645 / Name:* ${booking.firstName} ${booking.lastName}
\u{1F4DE} *\u0627\u0644\u0647\u0627\u062A\u0641 / Phone:* ${booking.phone}  
\u2709\uFE0F *\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A / Email:* ${booking.email}
\u{1F4CD} *\u0627\u0644\u0648\u0644\u0627\u064A\u0629 / Wilaya:* ${booking.wilaya}
\u{1F3D8}\uFE0F *\u0627\u0644\u0628\u0644\u062F\u064A\u0629 / Commune:* ${booking.commune}
\u{1F4BC} *\u0646\u0648\u0639 \u0627\u0644\u0646\u0634\u0627\u0637 / Business Type:* ${booking.businessType}
${booking.registrationNumber ? `\u{1F4CB} *\u0631\u0642\u0645 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 / Registration:* ${booking.registrationNumber}` : ""}
\u{1F69A} *\u0646\u0645\u0648\u0630\u062C \u0627\u0644\u0634\u0627\u062D\u0646\u0629 / Truck Model:* ${booking.truckModel} \u0637\u0646
${booking.message ? `\u{1F4AC} *\u0627\u0644\u0631\u0633\u0627\u0644\u0629 / Message:* ${booking.message}` : ""}
  `.trim();
  try {
    const textResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });
    if (!textResponse.ok) {
      throw new Error(`Failed to send text message: ${textResponse.statusText}`);
    }
    if (booking.nationalIdImage) {
      const imageBuffer = Buffer.from(booking.nationalIdImage.split(",")[1], "base64");
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("photo", new Blob([imageBuffer], { type: "image/jpeg" }), "national_id.jpg");
      formData.append("caption", "\u{1F4CB} \u0635\u0648\u0631\u0629 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062A\u0639\u0631\u064A\u0641 \u0627\u0644\u0648\u0637\u0646\u064A\u0629 - National ID Card");
      const idResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        body: formData
      });
      if (!idResponse.ok) {
        console.warn(`Failed to send national ID image: ${idResponse.statusText}`);
      }
    }
    if (booking.goldCardImage) {
      const imageBuffer = Buffer.from(booking.goldCardImage.split(",")[1], "base64");
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("photo", new Blob([imageBuffer], { type: "image/jpeg" }), "business_registration.jpg");
      formData.append("caption", "\u{1F4B3} \u0635\u0648\u0631\u0629 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062A\u062C\u0627\u0631\u064A - Business Registration");
      const regResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        body: formData
      });
      if (!regResponse.ok) {
        console.warn(`Failed to send business registration image: ${regResponse.statusText}`);
      }
    }
    console.log("Telegram notification sent successfully");
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}
async function registerRoutes(app2) {
  app2.get("/api/bookings", async (req, res) => {
    try {
      const bookings2 = await storage.getAllBookings();
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Erreur lors de la r\xE9cup\xE9ration des r\xE9servations" });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      if (validatedData.businessType === "commercant" && !validatedData.registrationNumber) {
        return res.status(400).json({
          message: "Le num\xE9ro de registre du commerce est requis pour les commer\xE7ants"
        });
      }
      if (validatedData.businessType === "artisan" && !validatedData.registrationNumber) {
        return res.status(400).json({
          message: "Le num\xE9ro de carte d'artisan est requis pour les artisans"
        });
      }
      if (validatedData.businessType === "fellah" && !validatedData.registrationNumber) {
        return res.status(400).json({
          message: "Le num\xE9ro de carte fellah est requis pour les fellahs/\xE9leveurs"
        });
      }
      const existingBookings = await storage.getAllBookings();
      const isDuplicate = existingBookings.some(
        (booking) => booking.email === validatedData.email && booking.phone === validatedData.phone
      );
      if (isDuplicate) {
        return res.status(400).json({
          message: "Une r\xE9servation avec ce t\xE9l\xE9phone et email existe d\xE9j\xE0. Les inscriptions en double sont automatiquement annul\xE9es."
        });
      }
      const newBooking = await storage.createBooking(validatedData);
      await sendTelegramNotification(newBooking);
      res.status(201).json({
        message: "R\xE9servation cr\xE9\xE9e avec succ\xE8s",
        booking: newBooking
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Donn\xE9es invalides",
          errors: error.errors
        });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Erreur lors de la cr\xE9ation de la r\xE9servation" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
