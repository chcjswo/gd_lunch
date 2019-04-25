var mongoose = require('mongoose');
var schema = mongoose.Schema;

var restaurantSchema = schema({
    lunch_date:{
        type: String,
        unique: true
    },
    restaurant_name:{
        type: String,
        unique: true
    }
});

const Restaurant = module.exports = mongoose.model("Restaurant", restaurantSchema);

const getUsers = (query, page, limit, callBack) => {
    Restaurant.paginate(query, { page: page, limit: limit, sort: 'username'}, callBack);
};

const getFavoriteHashTag = (username, callBack) => {
    Restaurant.findOne({username: username}, callBack);
}

const getUserById = (userId, callBack) => {
    Restaurant.findOne({_id: userId }, callBack);
}

const getUserByQuery = (query, callBack) => {
    Restaurant.findOne(query, callBack);
}

module.exports = {
    getUsers,
    getFavoriteHashTag,
    getUserById,
    getUserByQuery
};