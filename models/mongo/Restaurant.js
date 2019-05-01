const mongoose = require("mongoose");
const schema = mongoose.Schema;

const restaurantSchema = schema({
    name: {
        type: String
    },
    visitCount: {
        type: Number,
        default: 0
    },
    choiceCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
