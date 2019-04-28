const mongoose = require('mongoose');
const schema = mongoose.Schema;

const restaurantSchema = schema({
    name:{
        type: String
    },
    visitCount:{
        type: Number,
        default: 0
    },
    choiceCount:{
        type: Number,
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

// const Restaurant = module.exports = mongoose.model("Restaurant", restaurantSchema);
module.exports = mongoose.model("Restaurant", restaurantSchema);

// const getRestaurnatList = (callBack) => {
//     Restaurant
//         .find()
//         .skip(random)
//         .select('name visitCount choiceCount cratedAt')
//         .exec(callBack);
// };

// const getFavoriteHashTag = (username, callBack) => {
//     Restaurant.findOne({username: username}, callBack);
// }

// const getUserById = (userId, callBack) => {
//     Restaurant.findOne({_id: userId }, callBack);
// }

// const getUserByQuery = (query, callBack) => {
//     Restaurant.findOne(query, callBack);
// }

// module.exports = {
//     getRestaurnatList,
//     getFavoriteHashTag,
//     getUserById,
//     getUserByQuery
// };