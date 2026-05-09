import "dotenv/config";
import app from "./app";

const PORT: number = 2000;

const server = app.listen(PORT, () => {
  console.log("Server running in port : ", PORT);
});

const shutdown = (signal: string): void => {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error.message);
  shutdown("uncaughtException");
});
