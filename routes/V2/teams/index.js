const express = require("express");

const router = express.Router();
const ctrl = require("./teams.ctrl");

router.post("/choice", ctrl.choice);

module.exports = router;
