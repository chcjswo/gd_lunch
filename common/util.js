const Slack = require('slack-node');
const env = process.env.NODE_ENV || 'development';
const { IncomingWebhook } = require('ms-teams-webhook');
const url = process.env.TEAMS_SERVER_TEAM_URL;
const webhook = new IncomingWebhook(url);

const sendSlack = (message, type, id, cb) => {
    let slackUrl = process.env.MOCADEV_SLACK_URL;
    let apiUrl = 'http://localhost:3000';

    if (env !== 'development') {
        slackUrl = process.env.DEV2_SLACK_URL;
        apiUrl = 'http://lunch.mocadev.me';
    }

    if (env !== 'development' && type === 4) {
        slackUrl = process.env.RANDOM_SLACK_URL;
    } else if (env !== 'development' && type === 5) {
        slackUrl = process.env.SERVER_DEV_SLACK_URL;
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

    switch (type) {
        case 2:
            json = {
                username: '점심 뭐 먹지??',
                icon_emoji: ':rice:',
                mrkdwn: true,
                text: message
            };
            break;

        case 3:
            json = message;
            break;

        case 4:
            json = {
                username: '코로나바이러스 현황',
                icon_emoji: ':hospital:',
                mrkdwn: true,
                channel: '#random',
                text: message
            };
            break;

        case 5:
            json = {
                username: '서버 개발팀 알림',
                icon_emoji: ':alert:',
                mrkdwn: true,
                channel: '#서버개발팀',
                text: message
            };
            break;
    }

    slack.webhook(json, cb);
};

const sendTeamsMessage = async (title, subTitle, message) => {
    await webhook.send(JSON.stringify({
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            "summary": title,
            "themeColor": "0078D7",
            "title": title,
            "sections": [
                {
                    "activityTitle": title,
                    "activitySubtitle": subTitle,
                    "activityImage": "https://cdn.pixabay.com/photo/2020/04/28/06/57/medicine-5103043_960_720.jpg",
                    "text": message
                }
            ],
            "markdown": true
        })
    );
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
    makeSlackMessage,
    sendTeamsMessage
};
