const {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");

const prisma = require("../../config/db");
const env = require("../../config/env");
const { s3Client } = require("../../config/s3");
const ApiError = require("../../utils/apiError");
const {
    createObjectKey,
    createThumbnailKey,
    isImage
} = require("../../utils/fileUtils");

async function uploadObject(key, body, contentType) {
    await s3Client.send(
        new PutObjectCommand({
            Bucket: env.s3.bucket,
            Key: key,
            Body: body,
            ContentType: contentType
        })
    );
}

async function findOwnedFile(userId, fileId) { //This prevents User A from accessing User B’s file.
    const file = await prisma.file.findFirst({  
        where: {
            id: fileId, //Find a file where id equals req file id and owner equals current logged in user
            userId
        }
    });

    if (!file) {
        throw new ApiError(404, "File Not Found");
    }

    return file;
}

exports.uploadFile = async (userId, file) => {
  const objectKey = createObjectKey(userId, file.originalname);
  let thumbnailKey = null;

  await uploadObject(objectKey, file.buffer, file.mimetype);

  console.log(`Uploaded original object: ${objectKey}`);

  if (isImage(file.mimetype)) {
    thumbnailKey = createThumbnailKey(objectKey);

    const thumbnailBuffer = await sharp(file.buffer)
      .resize({
        width: 320,
        height: 320,
        fit: "inside"
      })
      .jpeg({
        quality: 80
      })
      .toBuffer();

    await uploadObject(thumbnailKey, thumbnailBuffer, "image/jpeg");

    console.log(`Uploaded thumbnail object: ${thumbnailKey}`);
  }

  const savedFile = await prisma.file.create({
    data: {
      userId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      objectKey,
      thumbnailKey
    }
  });

  return savedFile;
};

exports.listFiles = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [files, total] = await Promise.all([
    prisma.file.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    }),
    prisma.file.count({
      where: {
        userId
      }
    })
  ]);

  return {
    files,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

exports.getDownloadUrl = async (userId, fileId) => {
  const file = await findOwnedFile(userId, fileId);

  const signedUrl = await getSignedUrl( //Creates a temporary private URL.
    s3Client,
    new GetObjectCommand({ //Points the signed URL to the original object.
      Bucket: env.s3.bucket,
      Key: file.objectKey
    }),
    {
      expiresIn: 300
    }
  );

  console.log(`Generated download signed URL for file: ${file.id}`);

  return signedUrl;
};

exports.getThumbnailUrl = async (userId, fileId) => {
  const file = await findOwnedFile(userId, fileId);

  if (!file.thumbnailKey) {
    throw new ApiError(404, "Thumbnail not available for this file");
  }

  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.s3.bucket,
      Key: file.thumbnailKey
    }),
    {
      expiresIn: 300
    }
  );

  console.log(`Generated thumbnail signed URL for file: ${file.id}`);

  return signedUrl;
};

exports.deleteFile = async (userId, fileId) => {
  const file = await findOwnedFile(userId, fileId);

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.s3.bucket,
      Key: file.objectKey
    })
  );

  if (file.thumbnailKey) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.s3.bucket,
        Key: file.thumbnailKey
      })
    );
  }

  await prisma.file.delete({
    where: {
      id: file.id
    }
  });

  console.log(`Deleted file metadata and objects for file: ${file.id}`);
};