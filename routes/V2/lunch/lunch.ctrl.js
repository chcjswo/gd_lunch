const Slack = require('slack-node');

const Restaurant = require("../../../models/mongo/Restaurant");
const Lunch = require("../../../models/mongo/Lunch");

const randomRestaurant = async () => {
    const restaurantList = await Restaurant.find();
    const index = Math.floor(Math.random() * restaurantList.length);
    const restaurantData = restaurantList[index];

    await Lunch.deleteOne({
        lunch_date: getCurrentDate()
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

const getCurrentDate = () => {
    const d = new Date();

    return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
};

/**
 * 식당 리스트
 */
const list = async (req, res) => {
    try {
        const restaurantList = await Restaurant.find().sort({
            visitCount: -1,
            choiceCount: -1
        });
        const lunchRestaurant = await Lunch.findOne({
            lunch_date: getCurrentDate()
        });

        return res.json({
            restaurantList,
            restaurant: lunchRestaurant
        });
    } catch (err) {
        console.error("error ===> ", err);
        return res.status(500).json({
            message: "식당 조회중 에러가 발생했습니다."
        });
    }
};

/**
 * 새로운 식당 추가
 */
const create = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "데이터가 없습니다."
        });
    }

    try {
        const newRestaurant = new Restaurant({
            name: req.body.name
        });
        const data = await newRestaurant.save();

        return res.status(201).json([data]);
    } catch (err) {
        console.error("error ===> ", err);
        return res.status(500).json({
            message: "식당 등록중 에러가 발생했습니다."
        });
    }
};

/**
 * 오늘의 점심 삭제
 */
// const removeLunch = async (req, res) => {
//     try {
//         const lunchId = req.body.lunchId || null;

//         const result = await Lunch.remove({
//             _id: lunchId
//         });

//         if (!result) {
//             return res.status(404).json({
//                 message: "삭제할 오늘의 식당이 없습니다."
//             });
//         }

//         return res.status(201).end();
//     } catch (err) {
//         console.error("error ==> ", err);
//         return res.status(500).json({
//             message: "식당 재설정중 에러가 발생했습니다."
//         });
//     }
// };

/**
 * 식당 삭제
 */
const removeRestaurant = async (req, res) => {
    const no = req.body.no;

    if (!no) {
        return res.status(400).json({
            message: "데이터가 없습니다."
        });
    }

    try {
        const result = await Restaurant.deleteOne({
            _id: no
        });

        if (!result) {
            return res.status(404).json({
                message: "삭제할 식당이 없습니다."
            });
        }

        return res.status(201).end();
    } catch (err) {
        console.error("error ==> ", err);
        return res.status(500).json({
            message: "식당 삭제중 에러가 발생했습니다."
        });
    }
};

/**
 * 랜덤 식당 선택
 */
const choice = async (req, res) => {
    try {
        const restaurantData = await randomRestaurant();

        if (!restaurantData) {
            return res.status(404).json({
                message: "선택할 식당이 없습니다."
            });
        }

        if (!restaurantData) {
            return res.status(404).json({
                message: "선택할 식당이 없습니다."
            });
        }

        return res.status(201).json(restaurantData);
    } catch (err) {
        console.error("error ==> ", err.message);
        return res.status(500).json({
            message: "식당 선택중 에러가 발생했습니다."
        });
    }
};

/**
 * 식당 결정
 */
const decision = async (req, res) => {
    const no = req.body.no;

    if (!no) {
        return res.status(400).json({
            message: "데이터가 없습니다."
        });
    }

    try {
        await Lunch.deleteOne({
            lunch_date: getCurrentDate()
        });

        // 방문수 업데이트
        const result = await Restaurant.updateOne(
            {
                _id: no
            },
            {
                $inc: {
                    visitCount: 1
                }
            }
        );

        if (!result) {
            return res.status(404).json({
                message: "선택할 식당이 없습니다."
            });
        }

        // 결정된 식당 조회
        const restaurant = await Restaurant.findOne({
            _id: no
        });

        const newLunch = new Lunch({
            lunch_date: getCurrentDate(),
            restaurant_name: restaurant.name
        });

        // 오늘의 식당 입력
        const resultRestaurant = await newLunch.save();

        return res.status(201).json({result: resultRestaurant});
    } catch (err) {
        console.error("error ==> ", err);
        return res.status(500).json({
            message: "식당 선택중 에러가 발생했습니다."
        });
    }
};

/**
 * 랜덤 식당 선택 후 슬랙으로 메시지 보내기
 */
const sendSlack = async (req, res) => {
    try {
        const restaurantData = await randomRestaurant();

        if (!restaurantData) {
            return res.status(404).json({
                message: "선택할 식당이 없습니다."
            });
        }

        // const options = {
        //     method: 'POST',
        //     headers: {
        //         'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
        //         'Content-type': 'application/json'
        //     },
        //     json: data
        // };
        //
        // request(process.env.DEV2_SLACK_URL, options, () => {
        //     return res.status(201).end();
        // });

        const slack = new Slack();
        slack.setWebhook(process.env.DEV2_SLACK_URL);

        slack.webhook({
            // username: '점심 뭐 먹지??',
            // text: `${getCurrentDate()} 오늘의 점심은 ${restaurantData.name} 어떠세요?`,
            username: '점심 뭐 먹지??',
            icon_emoji: ':rice:',
            "mrkdwn": true,
            // "attachments": [
            //     {
            //         "fallback": "Required plain-text summary of the attachment.",
            //         "color": "#2eb886",
            //         "pretext": "Optional text that appears above the attachment block",
            //         "author_name": "Bobby Tables",
            //         "author_link": "http://flickr.com/bobby/",
            //         "author_icon": "http://flickr.com/icons/bobby.jpg",
            //         "title": "Slack API Documentation",
            //         "title_link": "https://api.slack.com/",
            //         "text": "Optional text that appears within the attachment",
            //         "fields": [
            //             {
            //                 "title": "Priority",
            //                 "value": "High",
            //                 "short": false
            //             }
            //         ],
            //         "image_url": "http://my-website.com/path/to/image.jpg",
            //         "thumb_url": "http://example.com/path/to/thumb.png",
            //         "footer": "Slack API",
            //         "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
            //         "ts": 123456789
            //     }
            // ]
            // "attachments": [
            //     {
            //         "text": "Choose a game to play",
            //         "fallback": "You are unable to choose a game",
            //         "callback_id": "wopr_game",
            //         "color": "#3AA3E3",
            //         "attachment_type": "default",
            //         "actions": [
            //             {
            //                 "name": "game",
            //                 "text": "Chess",
            //                 "type": "button",
            //                 "value": "chess"
            //             },
            //             {
            //                 "name": "game",
            //                 "text": "Falken's Maze",
            //                 "type": "button",
            //                 "value": "maze"
            //             },
            //             {
            //                 "name": "game",
            //                 "text": "Thermonuclear War",
            //                 "style": "danger",
            //                 "type": "button",
            //                 "value": "war",
            //                 "confirm": {
            //                     "title": "Are you sure?",
            //                     "text": "Wouldn't you prefer a good game of chess?",
            //                     "ok_text": "Yes",
            //                     "dismiss_text": "No"
            //                 }
            //             }
            //         ]
            //     }
            // ]
            "attachments": [{
                "text": `${getCurrentDate()} 오늘의 점심은 *${restaurantData.name}* 어떠세요?`,
                // "fallback": "Book your flights at https://flights.example.com/book/r123456",
                "actions": [{
                    "type": "button",
                    "text": "점심 선택?",
                    "url": "http://lunch.mocadev.me"
                }, {
                    "type": "button",
                    "text": "다시 선택",
                    "url": "http://lunch.mocadev.me/api/v2/lunch/slack"
                }]
            }]

        }, (err, resultRes) => {
            if (err) {
                console.error('에러 발생 ===> ', err);
                return res.status(500).end(err);
            }
            return res.status(201).end();
        });
    } catch (err) {
        console.error("error ==> ", err.message);
        return res.status(500).json({
            message: "식당 선택중 에러가 발생했습니다."
        });
    }
};

module.exports = {
    list,
    create,
    // removeLunch,
    removeRestaurant,
    choice,
    decision,
    sendSlack
};
