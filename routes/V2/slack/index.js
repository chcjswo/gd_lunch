const express = require("express");

const router = express.Router();
const ctrl = require("./slack.ctrl");

router.post("/restaurant", ctrl.list);
router.post("/test", ctrl.test);
router.post("/choice", ctrl.choice);

module.exports = router;
