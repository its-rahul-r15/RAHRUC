const express = require('express');
const { getTrashContents, restoreItem, deleteItemPermanently, emptyTrash } = require('../controllers/trash.controller');
const verifyJWT = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router.get('/', getTrashContents);
router.patch('/:id/restore', restoreItem);
router.delete('/empty', emptyTrash);
router.delete('/:id', deleteItemPermanently);

module.exports = router;
