require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const router = require("./routes");
const mongoose = require("mongoose");
const favicon = require("serve-favicon");
const teamsSchedules = require('./shedule/teamsSchedules');

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;

// MongoDB 데이터베이스 접속하기
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        poolSize: 10,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    })
    .then(() => {
        console.log("Successfully connected to MongoDB");
    })
    .catch(e => {
        console.error("Connection error: ", e);
    });

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));

// //////////// router 설정 //////////////////////
app.use(router);
// //////////////////////////////////////////////

// 알람 실행
teamsSchedules.lunchChoiceSchedule();

// heroku port 설정
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("GD Lunch app listening on port 3000!");
});
