const Slack = require('slack-node');
const env = process.env.NODE_ENV || 'development';

const sendSlack = (message, type, id, cb) => {
    let slackUrl = process.env.MOCADEV_SLACK_URL;
    let apiUrl = 'http://localhost:3000';

    if (env !== 'development') {
        slackUrl = process.env.DEV2_SLACK_URL;
        apiUrl = 'http://lunch.mocadev.me';
    }

    if (env !== 'development' && type === 4) {
        slackUrl = process.env.RANDOM_SLACK_URL;
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
    } else if (type === 3)  {
        json = message;
    } else if (type === 4)  {
        json = {
            username: '코로나바이러스 현황',
            icon_emoji: ':alarm:',
            mrkdwn: true,
            channel: '#random',
            text: message
        };
    }

    slack.webhook(json, cb);
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

const makeSlackMessage = (emoji, color, title, value) => ({
    username: '알람',
    icon_emoji: `:${emoji}:`,
    attachments: [{
        fallback: '알람이 도착 했습니다.',
        color,
        fields: [{
            title,
            value,
            short: false,
        }],
    }],
});

module.exports = {
    sendSlack,
    getCurrentDate,
    makeSlackMessage
};
