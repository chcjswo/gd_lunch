const express = require("express");
const lunchV1 = require("./V1/lunch");
const lunchV2 = require("./V2/lunch");
const slackV2 = require("./V2/slack");
const teamsV2 = require("./V2/teams");

const router = express.Router();

router.use("/api/v1/lunch", lunchV1);
router.use("/api/v2/lunch", lunchV2);
router.use("/api/v2/slack", slackV2);
router.use("/api/v2/teams", teamsV2);

router.get("/", (req, res) => {
    return res.render("index");
});
router.get("/map", (req, res) => {
    return res.render("map", {q: req.query.q});
});

module.exports = router;
