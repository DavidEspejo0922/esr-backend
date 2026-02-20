import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseLogging: false,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3001",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9001",
      authCors: process.env.AUTH_CORS || "http://localhost:9001,http://localhost:3001",
      jwtSecret: process.env.JWT_SECRET || "esr-jwt-secret-dev",
      cookieSecret: process.env.COOKIE_SECRET || "esr-cookie-secret-dev",
    },
    workerMode: (process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server") || "shared",
  },
  admin: {
    disable: process.env.DISABLE_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9001",
  },
  modules: [
    // Custom modules
    { resolve: "./src/modules/brand" },
    { resolve: "./src/modules/device" },
    { resolve: "./src/modules/content" },
    { resolve: "./src/modules/review" },
    { resolve: "./src/modules/wishlist" },
    { resolve: "./src/modules/navigation" },
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    // DLocal payment provider
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/dlocal",
            id: "dlocal",
            options: {
              apiUrl: process.env.DLOCAL_API_URL,
              xLogin: process.env.DLOCAL_X_LOGIN,
              xTransKey: process.env.DLOCAL_X_TRANS_KEY,
              secretKey: process.env.DLOCAL_SECRET_KEY,
              mock: process.env.DLOCAL_MOCK === "true",
            },
          },
        ],
      },
    },
    // Cloudinary file provider
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "./src/modules/cloudinary",
            id: "cloudinary",
            options: {
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET,
              folder: process.env.CLOUDINARY_FOLDER || "esr",
            },
          },
        ],
      },
    },
  ],
})
