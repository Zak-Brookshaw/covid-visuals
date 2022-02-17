const express = require('express');
const router = express.Router();

const data = require('./data');
const fitting = require('./fitting');

router.use('/data', data);
router.use('/fit', fitting)
module.exports = router;