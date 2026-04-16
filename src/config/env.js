require("dotenv").config()

const env = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    s3: {
        endpoint: process.env.S3_ENDPOINT,
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_KEY,
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION || "us-east-1",
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true"
    }
};

module.exports = env;