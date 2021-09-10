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
        const occurrenceRes = await got('http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun=', { retries: 5 });

        let $ = cheerio.load(occurrenceRes.body);
        const title = `코로나바이러스감염증-19 국내 발생현황 ${$('#content > div > h5:nth-child(4) > span').text()}`;
        const sum = $('#content > div > div.caseTable > div:nth-child(1) > ul > li:nth-child(1) > dl > dd').text();
        const confirmed = $('#content > div > div.caseTable > div:nth-child(1) > ul > li:nth-child(2) > dl > dd > ul > li:nth-child(1) > p').text();
        const domestic = $('#content > div > div.caseTable > div:nth-child(1) > ul > li:nth-child(2) > dl > dd > ul > li:nth-child(2) > p').text();
        const overseas = $('#content > div > div.caseTable > div:nth-child(1) > ul > li:nth-child(2) > dl > dd > ul > li:nth-child(3) > p').text();
        const releaseSum = $('#content > div > div.caseTable > div:nth-child(2) > ul > li:nth-child(1) > dl > dd').text();
        const releasePreviousDay = $('#content > div > div.caseTable > div:nth-child(2) > ul > li:nth-child(2) > dl > dd > span').text();
        const progressSum = $('#content > div > div.caseTable > div:nth-child(3) > ul > li:nth-child(1) > dl > dd').text();
        const progressPreviousDay = $('#content > div > div.caseTable > div:nth-child(3) > ul > li:nth-child(2) > dl > dd > span').text();
        const deathSum = $('#content > div > div.caseTable > div:nth-child(4) > ul > li:nth-child(1) > dl > dd').text();
        const deathPreviousDay = $('#content > div > div.caseTable > div:nth-child(4) > ul > li:nth-child(2) > dl > dd > span').text();

        const data = `${title}\n`
            + `확진환자 누적: ${sum} 명\n`
            + `전일대비 확진환자 수: ${confirmed} 명\n`
            + `전일대비 국내발생: ${domestic} 명\n`
            + `전일대비 해외발생: ${overseas} 명\n`
            + `격리해제 누적: ${releaseSum} 명\n`
            + `격리해제 전일대비: ${releasePreviousDay} 명\n`
            + `격리중 누적: ${progressSum} 명\n`
            + `격리중 전일대비: ${progressPreviousDay} 명\n`
            + `사망 누적: ${deathSum} 명\n`
            + `사망 전일대비: ${deathPreviousDay} 명\n`;

        util.sendSlack(data, 4, null, (err) => {
            if (err) {
                console.error('에러 발생 ===> ', err);
            }
        });
        console.log('코로나 알람을 보냈습니다.');
    });

    /**
     * 서버 개발팀 알림
     */
    schedule.scheduleJob('0 15 * * 2', () => {
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
