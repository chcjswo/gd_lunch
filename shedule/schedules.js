const got = require('got');
const schedule = require('node-schedule');
const util = require('../common/util');

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
};

module.exports = {
    lunchChoiceSchedule
};
