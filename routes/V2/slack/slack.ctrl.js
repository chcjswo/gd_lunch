const Slack = require('slack-node');
const env = process.env.NODE_ENV || 'development';

const Restaurant = require("../../../models/mongo/Restaurant");
const Lunch = require("../../../models/mongo/Lunch");

const sendSlack = (message, cb) => {
    let slackUrl = process.env.MOCADEV_SLACK_URL;

    if (env !== 'development') {
        slackUrl = process.env.DEV2_SLACK_URL;
    }

    const slack = new Slack();
    slack.setWebhook("https://hooks.slack.com/services/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");

    slack.webhook(message, cb);
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

const test = async (req, res) => {
    const data = {
        username: '점심 뭐 먹지??',
        icon_emoji: ':rice:',
        mrkdwn: true,
        "attachments": [
            {
                "text": "오늘의 점심을 선택해주세요",
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
    sendSlack(data, (err) => {
        if (err) {
            console.error('에러 발생 ===> ', err);
            return res.status(500).end(err);
        }
        return res.status(201).json(data);
    });
};

const choice = async(req, res) => {
    const payload = req.body.payload;
    console.log(payload);
    return res.json({payload});
};

module.exports = {
    list,
    test,
    choice
};
