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

module.exports = {
    choice
}
