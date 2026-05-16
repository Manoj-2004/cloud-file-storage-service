const ApiError = require("../utils/apiError");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join(", ");

    throw new ApiError(400, message);
  }

  req.validated = result.data;
  next();
};

module.exports = validate;