const models = require('../../../models/mysql');

const getCurrentDate = () => {
    const d = new Date();

    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

/**
 * 식당 리스트
 */
const list = async (req, res) => {
    try {            
        const restaurantList = await models.restaurant.findAll();
        const lunchRestaurant = await models.lunch.findOne({
            where: {
                lunch_date: getCurrentDate()
            }
        });

        return res.json({ 
            restaurantList,
            restaurantName: lunchRestaurant ? lunchRestaurant.restaurant_name : '',
            lunchDate: lunchRestaurant ? lunchRestaurant.lunch_date : ''
        });
    } catch(err) {
        console.error('error ===> ', err);
        return res.status(500).json({
            message: '식당 조회중 에러가 발생했습니다.'
        });
    }
};

/**
 * 새로운 식당 추가
 */
const create = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: '데이터가 없습니다.'
        });
    }

    try {
        const restaurantData = {
            name: req.body.name,
            visitCount: 0
        };
        const data = await models.restaurant.create(restaurantData);

        return res.status(201).json([data]);
    } catch(err) {
        console.error('error ===> ', err);
        return res.status(500).json({
            message: '식당 등록중 에러가 발생했습니다.'
        });
    }
};

/**
 * 식당 삭제
 */
const remove = async (req, res) => {
    const no = req.body.no;

    if (!req.body) {
        return res.status(400).json({
            message: '데이터가 없습니다.'
        });
    }

    try {
        const result = await models.restaurant.destroy({
            where: {
                no 
            }
        });

        if (!result) {
            return res.status(404).json({
                message: '삭제할 식당이 없습니다.'
            });
        }

        return res.status(201).end();
    } catch(err) {        
        console.error('error ==> ', err);
        return res.status(500).json({
            message: '식당 삭제중 에러가 발생했습니다.'
        });
    }
};

/**
 * 랜덤 식당 선택
 */
const choice = async (req, res) => {    
    const restaurantList = await models.restaurant.findAll();
    const index = Math.floor(Math.random() * restaurantList.length);
    const no = restaurantList[index].no;

    try {

        await models.restaurant.update({
            choiceCount: models.sequelize.literal('choiceCount + 1')
        }, {
            where: {
                no
            }
        });

        const result = await models.restaurant.findOne({
            where: {
                no
            }
        });

        if (!result) {
            return res.status(404).json({
                message: '선택할 식당이 없습니다.'
            });
        }

        return res.status(201).json(result);
    } catch(err) {        
        console.error('error ==> ', err);
        return res.status(500).json({
            message: '식당 선택중 에러가 발생했습니다.'
        });
    }
};

/**
 * 식당 결정
 */
const decision = async (req, res) => {
    const no = req.body.no;

    if (!req.body) {
        return res.status(400).json({
            message: '데이터가 없습니다.'
        });
    }

    try {
        const result = await models.restaurant.update({
            visitCount: models.sequelize.literal('visitCount + 1')
        }, {
            where: {
                no
            }
        });

        if (!result) {
            return res.status(404).json({
                message: '선택할 식당이 없습니다.'
            });
        }

        const restaurant = await models.restaurant.findOne({
            where: {
                no
            }
        });

        const restaurantData = {
            lunch_date: getCurrentDate(),
            restaurant_name: restaurant.name
        };
        await models.lunch.create(restaurantData);

        return res.status(201).end();
    } catch(err) {        
        console.error('error ==> ', err);
        return res.status(500).json({
            message: '식당 선택중 에러가 발생했습니다.'
        });
    }
};

module.exports = {
    list,
    create,
    remove,
    choice,
    decision
};
