const { z } = require('zod');

const renameFileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "File name is required").max(255),
  }),
});

const moveFileSchema = z.object({
  body: z.object({
    folderId: z.string().nullable().optional(),
  }),
});

module.exports = {
  renameFileSchema,
  moveFileSchema,
};
