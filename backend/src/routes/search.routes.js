const express = require('express');
const { searchItems } = require('../controllers/search.controller');
const verifyJWT = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyJWT, searchItems);

module.exports = router;
