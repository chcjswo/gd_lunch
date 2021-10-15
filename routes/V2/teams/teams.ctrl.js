const request = require('request');
const env = process.env.NODE_ENV || 'development';

const util = require('../../../common/util');
const Restaurant = require("../../../models/mongo/Restaurant");
const Lunch = require("../../../models/mongo/Lunch");

/**
 * 랜덤한게 점심 하나를 뽑아서 메시지 보내기
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const choice = async (req, res) => {
    // 랜덤 점심 선택 및 teams 메시지 만들기
    const data = await makeRestaurantTeamsMessage(null, res);

    choiceSend(res, data);
};

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
 * 랜덤 식당 선택 후 teams 메시지 만들기
 * @param userName 유저 이름
 * @param res response
 * @returns {Promise<*>}
 */
const makeRestaurantTeamsMessage = async (userName, res) => {
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

    return JSON.stringify({
        'r@type': 'MessageCard',
        '@context': 'https://schema.org/extensions',
        'summary': '점심 뭐 먹지??',
        'themeColor': '0078D7',
        'title': '점심 뭐 먹지??',
        'sections': [
            {
                'activityTitle': '점심 뭐 먹지??',
                'activitySubtitle': '점심식사 선택의 시간 입니다.',
                'activityImage': 'https://cdn.pixabay.com/photo/2020/04/28/06/57/medicine-5103043_960_720.jpg',
                'text': text
            }
        ],
        'markdown': true
    });
};

const choiceSend = (res, payload) => {
    res.status(200).end();

    request.post({
        url: process.env.TEAMS_SERVER_TEAM_URL,
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

module.exports = {
    choice
}
