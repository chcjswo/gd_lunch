const express = require('express');
const lunchV1 = require('./V1/lunch');
const lunchV2 = require('./V2/lunch');

const router = express.Router();

router.use('/api/v1/lunch', lunchV1);
router.use('/api/v2/lunch', lunchV2);

router.get('/', (req, res) => {
    return res.render('index');
});

module.exports = router;
