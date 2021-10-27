const got = require('got');
const schedule = require('node-schedule');
const util = require('../common/util');
const cheerio = require('cheerio');

const teamsAlarmSchedule = () => {
    schedule.scheduleJob('10 12 * * 1-5', () => {
        got.post('http://lunch.mocadev.me/api/v2/teams/choice/');
        console.log('점심선택 알람을 보냈습니다.');
    });

    /**
     * 코로나 알림
     */
    schedule.scheduleJob('50 09 * * 1-5', async () => {
        const occurrenceRes = await got('http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun=', {retries: 5});

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

        const data = `${title}<br>`
            + `확진환자 누적: ${sum} 명<br>`
            + `전일대비 확진환자 수: ${confirmed} 명<br>`
            + `전일대비 국내발생: ${domestic} 명<br>`
            + `전일대비 해외발생: ${overseas} 명<br>`
            + `격리해제 누적: ${releaseSum} 명<br>`
            + `격리해제 전일대비: ${releasePreviousDay} 명<br>`
            + `격리중 누적: ${progressSum} 명<br>`
            + `격리중 전일대비: ${progressPreviousDay} 명<br>`
            + `사망 누적: ${deathSum} 명<br>`
            + `사망 전일대비: ${deathPreviousDay} 명<br>`;

        util.sendTeamsMessage('코로나 알람',
            '오늘의 코로나 정보',
            data,
            process.env.TEAMS_RANDOM_URL,
            "https://img.lovepik.com/element/45004/7323.png_860.png"
        )
            .then(result => {
                console.log(result);
            }).catch(error => {
            console.error('코로나 알람 에러 발생 ===> ', error);
        });
        console.log('코로나 알람을 보냈습니다.');
    });

    /**
     * 서버 개발팀 알림
     */
    schedule.scheduleJob('0 15 * * 1', () => {
        const message = `서버 개발팀 주간회의 시간입니다.<br>회의실로 모여주세요~~`;
        util.sendTeamsMessage('회의 알람',
            '서버 개발팀 주간회의',
            data,
            process.env.TEAMS_SERVER_TEAM_URL,
            "https://cdn.icon-icons.com/icons2/2387/PNG/512/meetings_meeting_table_people_work_icon_144587.png"
        )
            .then(result => {
                console.log(result);
            }).catch(error => {
            console.error('서버 개발팀 주간회의 알람 에러 발생 ===> ', error);
        });
        console.log('서버 개발팀 알람을 보냈습니다.');
    });

    /**
     * 점심시간 알림
     */
    schedule.scheduleJob('30 12 * * 1-5', () => {
        const message = `신나는 점심 시간 입니다.<br>빨리 엘베 앞으로 고고고~~`;
        util.sendTeamsMessage('점심 알람',
            '점심 뭐 먹지??',
            data,
            process.env.TEAMS_SERVER_TEAM_URL,
            "https://t1.daumcdn.net/cfile/tistory/241104445948D27B09")
            .then(result => {
                console.log(result);
            }).catch(error => {
            console.error('점심 알람 에러 발생 ===> ', error);
        });
        console.log('점심 알람을 보냈습니다.');
    });
};

module.exports = {
    teamsAlarmSchedule
};
