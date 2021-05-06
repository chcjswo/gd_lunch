const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../config/sequelize.json'))[env];
const Op = Sequelize.Op;
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, {
        host: config.host,
        dialect: config.dialect,
        logging: config.logging,
        // operatorsAliases: {
        //     $and: Op.and,
        //     $or: Op.or,
        //     $eq: Op.eq,
        //     $gt: Op.gt,
        //     $lt: Op.lt,
        //     $lte: Op.lte,
        //     $like: Op.like,
        //     $not: Op.not,
        //     $in: Op.in,
        //     $notIn: Op.notIn,
        //     $between: Op.between,
        // },
    },
);
const db = {};

fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
