const express = require("express");

const router = express.Router();
const ctrl = require("./lunch.ctrl");

router.get("/", ctrl.list);
router.post("/", ctrl.create);
// router.delete("/", ctrl.removeLunch);
router.delete("/restaurant", ctrl.removeRestaurant);
router.post("/choice", ctrl.choice);
router.post("/decision", ctrl.decision);
router.get("/slack/:no", ctrl.choiceSlack);
router.get("/slack", ctrl.sendSlack);
router.post("/slack", ctrl.checkSlack);

module.exports = router;
