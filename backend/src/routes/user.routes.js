const express = require('express');
const { updateProfile, updatePassword, getStorageStats } = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyJWT);

router.patch('/profile', updateProfile);
router.patch('/password', updatePassword);
router.get('/storage', getStorageStats);

module.exports = router;
