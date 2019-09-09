const Slack = require('slack-node');
const env = process.env.NODE_ENV || 'development';

const Restaurant = require("../../../models/mongo/Restaurant");
const Lunch = require("../../../models/mongo/Lunch");

const sendSlack = (message, type, id, cb) => {
    let slackUrl = process.env.MOCADEV_SLACK_URL;
    let apiUrl = 'http://localhost:3000';

    if (env !== 'development') {
        slackUrl = process.env.DEV2_SLACK_URL;
        apiUrl = 'http://lunch.mocadev.me';
    }

    const slack = new Slack();
    slack.setWebhook(slackUrl);

    let json = {
        username: '점심 뭐 먹지??',
        icon_emoji: ':rice:',
        mrkdwn: true,
        attachments: [{
            text: message,
            actions: [{
                type: "button",
                text: "점심 선택",
                url: `${apiUrl}/api/v2/lunch/slack/${id}`,
                style: "primary",
            }, {
                type: "button",
                text: "다시 선택",
                url: `${apiUrl}/api/v2/lunch/slack`,
                style: "danger"
            }]
        }]
    };

    if (type === 2) {
        json = {
            username: '점심 뭐 먹지??',
            icon_emoji: ':rice:',
            mrkdwn: true,
            text: message
        };
    }

    slack.webhook(json, cb);
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

module.exports = {
    list
};
