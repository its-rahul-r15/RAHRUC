const express = require('express');
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const folderRouter = require('./folder.routes');
const fileRouter = require('./file.routes');
const searchRouter = require('./search.routes');
const trashRouter = require('./trash.routes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/folders', folderRouter);
router.use('/files', fileRouter);
router.use('/search', searchRouter);
router.use('/trash', trashRouter);

module.exports = router;
