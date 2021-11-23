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
        const message = await util.getCovidMessage();
        util.sendTeamsMessage('코로나 알람',
            '오늘의 코로나 정보',
            message,
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
     * 서버 개발팀 주간회의 알림
     */
    schedule.scheduleJob('0 15 * * 1', () => {
        const message = `${util.getServerTeamProfile()}<br>서버 개발팀 주간회의 시간입니다.<br>회의실로 모여주세요~~`;
        util.sendTeamsMessage('회의 알람',
            '서버 개발팀 주간회의',
            message,
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
        const message = `신나는 점심 시간 입니다.<br>빨리 엘베 앞으로 고고고~~<br><a href='http://lunch.mocadev.me/'>http://lunch.mocadev.me/</a>`;
        util.sendTeamsMessage('점심 알람',
            '점심 뭐 먹지??',
            message,
            process.env.TEAMS_SERVER_TEAM_URL,
            "https://t1.daumcdn.net/cfile/tistory/241104445948D27B09")
            .then(result => {
                console.log(result);
            }).catch(error => {
            console.error('점심 알람 에러 발생 ===> ', error);
        });
        console.log('점심 알람을 보냈습니다.');
    });

    /**
     * 매일 아사나 정리 알림
     */
    schedule.scheduleJob('30 17 * * 1-5', () => {
        const message = `${util.getServerTeamProfile()}<br>신나는 아사나 정리의 시간 입니다.<br>due date 확인하고 Task 정리 해주세요. 제발~~`;
        util.sendTeamsMessage('아사나 알람',
            '아사나 정리 합시다',
            message,
            process.env.TEAMS_SERVER_TEAM_URL,
            "https://cdn-icons-png.flaticon.com/512/1550/1550191.png")
            .then(result => {
                console.log(result);
            }).catch(error => {
            console.error('아사나 알람 에러 발생 ===> ', error);
        });
        console.log('아사나 알람을 보냈습니다.');
    });
};

module.exports = {
    teamsAlarmSchedule
};
