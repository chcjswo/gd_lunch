const models = require('../../models');

const list = async (req, res) => {
    try {
        const data = await models.lunch.findAll();

        return res.json(data);
    } catch(err) {
        console.error('error ===> ', err);
        return res.status(500).json({
            message: '식당 조회중 에러가 발생했습니다.'
        });
    }
};

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
        const data = await models.lunch.create(restaurantData);

        return res.status(201).json([data]);
    } catch(err) {
        return res.status(500).json({
            message: '식당 등록중 에러가 발생했습니다.'
        });
    }
};

const remove = async (req, res) => {
    const no = req.body.no;

    if (!req.body) {
        return res.status(400).json({
            message: '데이터가 없습니다.'
        });
    }

    try {
        const result = await models.lunch.destroy({
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

const choice = async (req, res) => {    
    const restaurantList = await models.lunch.findAll();
    const index = Math.floor(Math.random() * restaurantList.length);
    const no = restaurantList[index].no;

    try {

        await models.lunch.update({
            choiceCount: models.sequelize.literal('choiceCount + 1')
        }, {
            where: {
                no
            }
        });

        const result = await models.lunch.findOne({
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

const decision = async (req, res) => {
    const no = req.body.no;

    if (!req.body) {
        return res.status(400).json({
            message: '데이터가 없습니다.'
        });
    }

    try {
        const result = await models.lunch.update({
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
