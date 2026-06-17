const express = require('express');
const { register, login, logout, refreshAccessToken, getCurrentUser, generateTelegramLinkToken } = require('../controllers/auth.controller');
const verifyJWT = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', verifyJWT, logout);
router.post('/refresh', refreshAccessToken);
router.get('/me', verifyJWT, getCurrentUser);
router.post('/link-token', verifyJWT, generateTelegramLinkToken);

module.exports = router;
