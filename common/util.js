const Slack = require('slack-node');
const env = process.env.NODE_ENV || 'development';

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

        // "attachments": [
        //     {
        //         "fallback": "Plan a vacation",
        //         "author_name": "Owner: rdesoto",
        //         "title": "Plan a vacation",
        //         "text": "I've been working too hard, it's time for a break.",
        //         "actions": [
        //             {
        //                 "name": "action",
        //                 "type": "button",
        //                 "text": "Complete this task",
        //                 "style": "",
        //                 "value": "complete"
        //             },
        //             {
        //                 "name": "tags_list",
        //                 "type": "select",
        //                 "text": "Add a tag...",
        //                 "data_source": "static",
        //                 "options": [
        //                     {
        //                         "text": "Launch Blocking",
        //                         "value": "launch-blocking"
        //                     },
        //                     {
        //                         "text": "Enhancement",
        //                         "value": "enhancement"
        //                     },
        //                     {
        //                         "text": "Bug",
        //                         "value": "bug"
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // ]

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

module.exports = {
    sendSlack
};
