const express = require('express');
const router = express.Router();
const { getGameInitState } = require('../../socket');

router.get('/', getGameInitState);

module.exports = router;
