const app = require("./app");
const env = require("./config/env");
const { ensureBucketExists } = require("./config/s3");

async function startServer() {
  await ensureBucketExists();

  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});