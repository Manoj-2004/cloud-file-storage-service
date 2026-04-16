const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const env = require("../config/env");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required");
  }

  const token = header.split(" ")[1];

  const payload = jwt.verify(token, env.jwtSecret);

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new ApiError(401, "Invalid authentication token");
  }

  req.user = user;

  next();
});

module.exports = authMiddleware;