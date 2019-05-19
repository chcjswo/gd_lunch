const express = require("express");

const router = express.Router();
const ctrl = require("./lunch.ctrl");

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.delete("/", ctrl.removeLunch);
router.delete("/restaurant", ctrl.removeRestaurant);
router.post("/choice", ctrl.choice);
router.post("/decision", ctrl.decision);

module.exports = router;
