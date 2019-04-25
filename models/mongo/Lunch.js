var mongoose = require('mongoose');
var schema = mongoose.Schema;

var lunchSchema = schema({
    lunch_date:{
        type: String,
        unique: true
    },
    restaurant_name:{
        type: String,
        unique: true
    }
});

const Lunch = module.exports = mongoose.model("Lunch", lunchSchema);

const getUsers = (query, page, limit, callBack) => {
    Lunch.paginate(query, { page: page, limit: limit, sort: 'username'}, callBack);
};

const getFavoriteHashTag = (username, callBack) => {
    Lunch.findOne({username: username}, callBack);
}

const getUserById = (userId, callBack) => {
    Lunch.findOne({_id: userId }, callBack);
}

const getUserByQuery = (query, callBack) => {
    Lunch.findOne(query, callBack);
}

module.exports = {
    getUsers,
    getFavoriteHashTag,
    getUserById,
    getUserByQuery
};