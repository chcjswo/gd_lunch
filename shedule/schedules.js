const got = require('got');
const schedule = require('node-schedule');

/**
 * 점심 선택 알림
 */
const lunchChoiceSchedule = () => {
    schedule.scheduleJob('27 12 * * 1-5', () => {
        got.post('http://lunch.mocadev.me/api/v2/slack/choice/');
        console.log('점심선택 알람을 보냈습니다.');
    });
};

module.exports = {
    lunchChoiceSchedule
};
