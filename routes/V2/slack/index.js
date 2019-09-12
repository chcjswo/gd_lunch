const express = require("express");

const router = express.Router();
const ctrl = require("./slack.ctrl");

router.post("/restaurant", ctrl.list);
router.post("/decision", ctrl.decision);
router.post("/choice", ctrl.choice);

module.exports = router;
