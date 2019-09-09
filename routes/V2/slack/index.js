const express = require("express");

const router = express.Router();
const ctrl = require("./slack.ctrl");

router.post("/restaurant", ctrl.list);

module.exports = router;
