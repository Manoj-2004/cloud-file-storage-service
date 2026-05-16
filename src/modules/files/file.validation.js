const { z } = require("zod");

const listFilesSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((value) => Number(value || 1))
      .refine((value) => Number.isInteger(value) && value >= 1, {
        message: "Page must be a positive integer"
      }),
    limit: z
      .string()
      .optional()
      .transform((value) => Number(value || 10))
      .refine((value) => Number.isInteger(value) && value >= 1 && value <= 50, {
        message: "Limit must be between 1 and 50"
      })
  })
});

module.exports = {
  listFilesSchema
};