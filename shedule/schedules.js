const got = require('got');
const schedule = require('node-schedule');
const util = require('../common/util');
const cheerio = require('cheerio');

/**
 * 점심 선택 알림
 */
const lunchChoiceSchedule = () => {
    schedule.scheduleJob('10 12 * * 1-5', () => {
        got.post('http://lunch.mocadev.me/api/v2/slack/choice/');
        console.log('점심선택 알람을 보냈습니다.');
    });

    /**
     * 점심시간 알림
     */
    schedule.scheduleJob('30 12 * * 1-5', () => {
        const message = util.makeSlackMessage(
            'meow_bread',
            '#CF2511',
            '점심 알림',
            '신나는 점심 시간 입니다.\n빨리 엘베 앞으로 고고고~~'
        );

        util.sendSlack(message, 3, null, (err) => {
            if (err) {
                console.error('에러 발생 ===> ', err);
            }
        });
        console.log('점심 알람을 보냈습니다.');
    });

    /**
     * 코로나 알림
     */
    schedule.scheduleJob('50 09 * * 1-5', async () => {
        const message = await util.getCovidMessage();

        util.sendSlack(message, 4, null, (err) => {
            if (err) {
                console.error('에러 발생 ===> ', err);
            }
        });
        console.log('코로나 알람을 보냈습니다.');
    });

    /**
     * 서버 개발팀 알림
     */
    schedule.scheduleJob('0 14 * * 1', () => {
        const message = '서버 개발팀 주간회의 시간입니다.\n회의실로 모여주세요~~';
        util.sendSlack(message, 5, null, (err) => {
            if (err) {
                console.error('에러 발생 ===> ', err);
            }
        });
        console.log('서버 개발팀 알람을 보냈습니다.');
    });
};

module.exports = {
    lunchChoiceSchedule
};
