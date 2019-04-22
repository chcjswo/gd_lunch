const express = require('express');
const lunch = require('./lunch');

const router = express.Router();

router.use('/api/v1/lunch', lunch);

router.get('/', (req, res) => {
    return res.render('index');
});

module.exports = router;
