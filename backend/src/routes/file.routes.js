const express = require('express');
const { uploadFile, getFiles, getFileMetadata, streamFile, streamThumbnail, renameFile, moveFile, toggleStar, deleteFile, toggleShare, getPublicFileMetadata, streamPublicFile } = require('../controllers/file.controller');
const verifyJWT = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { renameFileSchema, moveFileSchema } = require('../validators/file.validator');

const router = express.Router();

// Public routes (accessible without login)
router.get('/public/:slug', getPublicFileMetadata);
router.get('/public/:slug/stream', streamPublicFile);

router.use(verifyJWT);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:id', getFileMetadata);
router.get('/:id/stream', streamFile);
router.get('/:id/thumbnail', streamThumbnail);
router.patch('/:id', validate(renameFileSchema), renameFile);
router.patch('/:id/move', validate(moveFileSchema), moveFile);
router.patch('/:id/star', toggleStar);
router.patch('/:id/share', toggleShare);
router.delete('/:id', deleteFile);

module.exports = router;
