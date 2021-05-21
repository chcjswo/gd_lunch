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
                replace_original: false,
                fallback: "점심식사 선택의 시간 입니다.",
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

const choiceSend = (res, payload, responseUrl = null) => {
    res.status(200).end();

    const slackUrl = env === 'production'
        ? process.env.DEV2_SLACK_URL
        : process.env.MOCADEV_SLACK_URL;

    if (responseUrl === null) {
        responseUrl = process.env.MOCADEV_SLACK_URL;
    }

    request.post({
        url: slackUrl,
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json"
        }
    }, (err, res) => {
        if (err) {
            console.log(err);
        }
        if (res) {
            console.log('body ==> ', res.body);
        }
    });
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

    // 재선택인 경우
    if (value === 'resend') {
        // 랜덤 점심 선택 및 슬랙 메시지 만들기
        const data = await makeRestaurantSlackMessage(userName);
        choiceSend(res, data, responseUrl);

        return;
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
        text: `${util.getCurrentDate()} 오늘의 점심은 ${userName}님이 선택한 *${restaurant.name}* 입니다.`
    };

    choiceSend(res, data, responseUrl);
};

const test = async (req, res) => {
    res.status(200).end();

    const payload = {
        "text": "Would you like to play a game?",
        "attachments": [
            {
                "text": "Choose a game to play",
                "fallback": "You are unable to choose a game",
                "callback_id": "wopr_game",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "game",
                        "text": "Chess",
                        "type": "button",
                        "value": "chess"
                    },
                    {
                        "name": "game",
                        "text": "Falken's Maze",
                        "type": "button",
                        "value": "maze"
                    },
                    {
                        "name": "game",
                        "text": "Thermonuclear War",
                        "style": "danger",
                        "type": "button",
                        "value": "war",
                        "confirm": {
                            "title": "Are you sure?",
                            "text": "Wouldn't you prefer a good game of chess?",
                            "ok_text": "Yes",
                            "dismiss_text": "No"
                        }
                    }
                ]
            }
        ]
    };

    request.post({
        url: process.env.MOCADEV_SLACK_URL,
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json"
        }
    }, (err, res) => {
        if (err) {
            console.log(err);
        }
        if (res) {
            console.log('body ==> ', res.body);
        }
    });
};

/**
 * auth
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const auth = async (req, res) => {
    console.log(res.body);
    res.status(200).json(res.body);
};

const commandAddRestaurant = async (req, res) => {
    console.log(req.body);
    res.status(200).json(res.body);
};

const commandChoiceRestaurant = async (req, res) => {
    console.log(req.body);
    res.status(200).json(res.body);
};

module.exports = {
    list,
    decision,
    choice,
    test,
    auth,
    commandAddRestaurant,
    commandChoiceRestaurant
};
