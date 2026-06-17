const { z } = require('zod');

const createFolderSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Folder name is required").max(255),
    parentFolder: z.string().nullable().optional(),
  }),
});

const renameFolderSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Folder name is required").max(255),
  }),
});

const moveFolderSchema = z.object({
  body: z.object({
    parentFolder: z.string().nullable().optional(),
  }),
});

module.exports = {
  createFolderSchema,
  renameFolderSchema,
  moveFolderSchema,
};
