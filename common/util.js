const Slack = require('slack-node');
const env = process.env.NODE_ENV || 'development';
const { IncomingWebhook } = require('ms-teams-webhook');
const got = require("got");
const cheerio = require("cheerio");

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

const sendTeamsMessage = async (title, subTitle, message, url, imageUrl) => {
    const webhook = new IncomingWebhook(url);
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

const makeCovidMessage = ($) => {
    const title = `코로나바이러스감염증-19 국내 발생현황 ${$('#content > div > div > div.liveboard_layout > div.liveToggleOuter > div > div.live_left > div.occurrenceStatus > h2 > span').text()}`;
    const confirmed = $('#content > div > div > div.liveboard_layout > div.liveToggleOuter > div > div.live_left > div.occurrenceStatus > div.occur_graph > table > tbody > tr:nth-child(1) > td:nth-child(5) > span').text();
    const vaccinated1Percent = $('#content > div > div > div.liveboard_layout > div.liveToggleOuter > div > div.live_left > div.vaccineNum > div > div > div:nth-child(1) > ul:nth-child(1) > li.percent').text();
    const vaccinated1Sum = $('#content > div > div > div.liveboard_layout > div.liveToggleOuter > div > div.live_left > div.vaccineNum > div > div > div:nth-child(1) > ul:nth-child(2) > li:nth-child(1)').text();
    const vaccinatedCompletedPercent = $('#content > div > div > div.liveboard_layout > div.liveToggleOuter > div > div.live_left > div.vaccineNum > div > div > div:nth-child(2) > ul:nth-child(1) > li.percent').text();
    const vaccinatedCompletedSum = $('#content > div > div > div.liveboard_layout > div.liveToggleOuter > div > div.live_left > div.vaccineNum > div > div > div:nth-child(2) > ul:nth-child(2) > li:nth-child(1)').text();
    const deathSum = $('#content > div > div > div.liveboard_layout > div.liveToggleOuter > div > div.live_left > div.occurrenceStatus > div.occur_num > div:nth-child(1)').text();
    const deathPreviousDay = $('#content > div > div > div.liveboard_layout > div.liveToggleOuter > div > div.live_left > div.occurrenceStatus > div.occur_graph > table > tbody > tr:nth-child(1) > td:nth-child(2) > span').text();

    return `${title}<br>`
        + `확진 수: ${confirmed} 명<br>`
        + `1차접종: ${vaccinated1Percent}<br>`
        + `1차접종 ${vaccinated1Sum} 명<br>`
        + `접종완료: ${vaccinatedCompletedPercent}<br>`
        + `접종완료 ${vaccinatedCompletedSum} 명<br>`
        + `(누적)사망: ${deathSum} 명<br>`
        + `사망: ${deathPreviousDay} 명<br>`;
}

const getCovidMessage = async () => {
    const occurrenceRes = await got('http://ncov.mohw.go.kr', {retries: 5});
    return makeCovidMessage(cheerio.load(occurrenceRes.body));
}

module.exports = {
    sendSlack,
    getCurrentDate,
    makeSlackMessage,
    sendTeamsMessage,
    getCovidMessage
};
