const express = require("express");

const router = express.Router();
const ctrl = require("./slack.ctrl");

router.post("/restaurant", ctrl.list);
router.post("/decision", ctrl.decision);
router.post("/choice", ctrl.choice);
router.post("/test", ctrl.test);
router.get("/auth", ctrl.auth);
router.post("/slash-command/restaurant", ctrl.commandAddRestaurant);
router.post("/slash-command/choice", ctrl.commandChoiceRestaurant);

module.exports = router;
