const request = require('request');
const Slack = require('slack-node');

const mongoose = require("mongoose");

console.log('url ', process.env.MONGO_URI);

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


const Restaurant = require("../models/mongo/Restaurant");
const Lunch = require("../models/mongo/Lunch");

const getCurrentDate = () => {
    const d = new Date();

    return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
};

const randomRestaurant = async () => {
    console.log('cccccc');
    return new Promise(async (resolve) => {
        const restaurantList = await Restaurant.find();
        const index = Math.floor(Math.random() * restaurantList.length);
        const restaurantData = await restaurantList[index];

        console.log('restaurantData ===> ', restaurantData);

        Lunch.deleteOne({
            lunch_date: getCurrentDate()
        });

        // 선택 카운트 업데이트
        restaurantData.choiceCount++;

        Restaurant.updateOne({
            _id: restaurantData._id
        }, {
            $inc: {
                choiceCount: 1
            }
        });

        // return restaurantData;

        resolve(restaurantData);
    });
};


/**
 * 랜덤 식당 선택 후 슬랙으로 메시지 보내기
 */
// const sendSlack = async () => {
//     console.log('bbbbbb');
//     try {
//         const restaurantData = await randomRestaurant();
//
//         if (!restaurantData) {
//             return res.status(404).json({
//                 message: "선택할 식당이 없습니다."
//             });
//         }
//
//         console.log(restaurantData);
//
//         const data = {
//             username: '점심 뭐 먹지??',
//             text: `${getCurrentDate()} 오늘의 점심은 ${restaurantData.name} 어떠세요?`,
//             icon_emoji: ':rice:'
//         };
//
//         const options = {
//             url: process.env.MOCADEV_SLACK_URL,
//             method: 'POST',
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
//                 'Content-type': 'application/json'
//             },
//             json: data
//         };
//
//         request(options);
//     } catch (err) {
//         console.error("식당 선택중 에러가 발생했습니다. error ==> ", err.message);
//     }
// };

const sendSlack = ((msg) => {
    console.log('msg => ', msg);
    const slack = new Slack();
    slack.setWebhook(process.env.MOCADEV_SLACK_URL);

    slack.webhook({
        channel: '#_personal-projects',
        username: '점심 뭐 먹지??',
        text: `${getCurrentDate()} 오늘의 점심은 ${msg.name} 어떠세요?`,
        icon_emoji: ':rice:'
    }, (err, res) => {
        if (err) {
            console.error('에러 발생 ===> ', err);
        }
        console.log(res);
    });
});

// randomRestaurant().then(msg => {
//     console.log('msg => ', msg);
//     const slack = new Slack();
//     slack.setWebhook(process.env.MOCADEV_SLACK_URL);
//
//     slack.webhook({
//         channel: '#_personal-projects',
//         username: '점심 뭐 먹지??',
//         text: `${getCurrentDate()} 오늘의 점심은 ${msg.name} 어떠세요?`,
//         icon_emoji: ':rice:'
//     }, (err, res) => {
//         if (err) {
//             console.error('에러 발생 ===> ', err);
//         }
//         console.log(res);
//     });
// });

function hello() {
    console.log('hello');
    Restaurant.find(function (err, book) {
        console.log(err);
        console.log(book);
    });
}
hello();
