const {
  S3Client, //client object to talk to S3 compatible storage
  HeadBucketCommand, //Checks whether a bucket exists and whether we can access it.
  CreateBucketCommand //Creates a bucket if it doesn't exist
} = require("@aws-sdk/client-s3");

const env = require("./env");

const s3Client = new S3Client({
  region: env.s3.region,
  endpoint: env.s3.endpoint, //This tells the AWS SDK to talk to MinIO instead of real AWS S3.
  forcePathStyle: env.s3.forcePathStyle,
  credentials: {
    accessKeyId: env.s3.accessKey,
    secretAccessKey: env.s3.secretKey
  }
});

async function ensureBucketExists() {
  try {
    await s3Client.send(
      new HeadBucketCommand({
        Bucket: env.s3.bucket
      })
    );

    console.log(`S3 bucket ready: ${env.s3.bucket}`);
  } catch (error) {
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: env.s3.bucket
      })
    );

    console.log(`Created S3 bucket: ${env.s3.bucket}`);
  }
}

module.exports = {
  s3Client, //Used later for upload, delete, and signed URLs.
  ensureBucketExists //Used at server startup.
};