const Slack = require('slack-node');
const request = require('request');
const env = process.env.NODE_ENV || 'development';

const util = require('../../../common/util');
const Restaurant = require("../../../models/mongo/Restaurant");
const Lunch = require("../../../models/mongo/Lunch");

const randomRestaurant = async () => {
    const restaurantList = await Restaurant.find();
    const index = Math.floor(Math.random() * restaurantList.length);
    const restaurantData = restaurantList[index];

    await Lunch.deleteOne({
        lunch_date: util.getCurrentDate()
    });

    // 선택 카운트 업데이트
    restaurantData.choiceCount++;

    await Restaurant.updateOne({
        _id: restaurantData._id
    }, {
        $inc: {
            choiceCount: 1
        }
    });

    return restaurantData;
};

/**
 * 슬랙으로 메시지 보내기
 * @param message 보낼 메시지 내용
 * @param cb 콜백 함수
 */
const sendSlack = (message, cb) => {
    let slackUrl = process.env.MOCADEV_SLACK_URL;

    if (env !== 'development') {
        slackUrl = process.env.DEV2_SLACK_URL;
    }

    const slack = new Slack();
    slack.setWebhook(process.env.MOCADEV_SLACK_URL);

    slack.webhook(message, cb);
};

/**
 * slash command /lunch 식당 리스트
 */
const list = async (req, res) => {
    try {
        const restaurantList = await Restaurant.find().sort({
            visitCount: -1,
            choiceCount: -1
        });

        const restaurantData = [];

        restaurantList.forEach(item => {
            restaurantData.push({
                "title": item.name,
                "value": `${item.choiceCount}번 선택 ${item.visitCount}번 방문`,
                short: false
            });
        });

        return res.json({
            text: "선택 가능한 식당",
            "attachments": [{
                "fields": restaurantData,
                "color": "#F35A00"
            }]
        });
    } catch (err) {
        console.error("error ===> ", err);
        return res.status(500).json({
            message: "식당 조회중 에러가 발생했습니다."
        });
    }
};

/**
 * 랜덤 식당 선택 후 슬랙 메시지 만들기
 * @param userName 유저 이름
 * @returns {Promise<*>}
 */
const makeRestaurantSlackMessage = async (userName) => {
    // 랜점 점심 선택
    const restaurantData = await randomRestaurant();

    if (!restaurantData) {
        return res.status(404).json({
            message: "선택할 식당이 없습니다."
        });
    }

    let text = `${util.getCurrentDate()} 오늘의 점심은 *${restaurantData.name}* 어떠세요?`;
    if (userName !== null) {
        text = `${util.getCurrentDate()} 오늘의 점심은 ${userName}님이 선택한 *${restaurantData.name}* 어떠세요?`;
    }

    return {
        username: '점심 뭐 먹지??',
        icon_emoji: ':rice:',
        mrkdwn: true,
        attachments: [
            {
                text,
                fallback: "You are unable to choose a lunch",
                callback_id: "lunch",
                color: "#3AA3E3",
                attachment_type: "default",
                actions: [
                    {
                        name: "lunch",
                        text: "점심 선택",
                        type: "button",
                        value: restaurantData._id
                    },
                    {
                        name: "lunch",
                        text: "다시 선택",
                        style: "danger",
                        type: "button",
                        value: "resend",
                        confirm: {
                            title: "점심 다시 선택??",
                            text: `${restaurantData.name} 말고 다시 선택 하시겠습니까?`,
                            ok_text: "다시 선택",
                            dismiss_text: "그냥 먹을래"
                        }
                    }
                ]
            }
        ]
    };
};

const choiceSend = (res, data, responseUrl = null) => {
    // sendSlack(data, (err) => {
    //     if (err) {
    //         console.error('에러 발생 ===> ', err);
    //         res.status(500).end(err);
    //     }
    //     res.status(200).end('');
    // });
    res.status(200).end();

    const slackUrl = env !== 'development'
                    ? process.env.MOCADEV_SLACK_URL
                    : process.env.DEV2_SLACK_URL;

    if (responseUrl === null) {
        responseUrl = process.env.MOCADEV_SLACK_URL;
    }

    const postOptions = {
        uri: process.env.MOCADEV_SLACK_URL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: data
    };
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })

};

/**
 * 랜덤한게 점심 하나를 뽑아서 메시지 보내기
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const choice = async (req, res) => {
    // 랜덤 점심 선택 및 슬랙 메시지 만들기
    const data = await makeRestaurantSlackMessage(null);

    choiceSend(res, data);
};

/**
 * 점심 삭제
 */
const removeLunch = () => {
    Lunch.deleteOne({
        lunch_date: util.getCurrentDate()
    });
};

/**
 * 방문수 업데이트
 * @param no 고유번호
 */
const updateVisitCount = (no) => {
    return Restaurant.updateOne({
        _id: no
    }, {
        $inc: {
            visitCount: 1
        }
    });
};

/**
 * 점심 선택
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const decision = async (req, res) => {
    const payload = JSON.parse(req.body.payload);
    const userName = payload.user.name;
    const value = payload.actions[0].value;
    const responseUrl = payload.response_url;

    console.log('responseUrl => ', responseUrl);

    // 재선택인 경우
    if (value === 'resend') {
        // 랜덤 점심 선택 및 슬랙 메시지 만들기
        const data = await makeRestaurantSlackMessage(userName);

        return choiceSend(res, data, responseUrl);
    }

    //  점심 삭제
    await removeLunch();

    // 방문수 업데이트
    await updateVisitCount(value);

    // 결정된 식당 조회
    const restaurant = await Restaurant.findOne({
        _id: value
    });

    const newLunch = new Lunch({
        lunch_date: util.getCurrentDate(),
        restaurant_name: restaurant.name,
        user_name: userName
    });

    // 오늘의 식당 입력
    await newLunch.save();

    const data = {
        username: '점심 뭐 먹지??',
        icon_emoji: ':rice:',
        mrkdwn: true,
        text: `${util.getCurrentDate()} 오늘의 점심은 ${userName}님이 선택한 *${restaurant.name}* 입니다.`
    };

    return choiceSend(res, data, responseUrl);
};

module.exports = {
    list,
    decision,
    choice
};
