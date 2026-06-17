const express = require('express');
const { createFolder, getFolderContents, renameFolder, moveFolder, deleteFolder } = require('../controllers/folder.controller');
const verifyJWT = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createFolderSchema, renameFolderSchema, moveFolderSchema } = require('../validators/folder.validator');

const router = express.Router();

router.use(verifyJWT);

router.post('/', validate(createFolderSchema), createFolder);
router.get('/:id/contents', getFolderContents);
router.patch('/:id', validate(renameFolderSchema), renameFolder);
router.patch('/:id/move', validate(moveFolderSchema), moveFolder);
router.delete('/:id', deleteFolder);

module.exports = router;
