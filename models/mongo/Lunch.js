var mongoose = require('mongoose');
var schema = mongoose.Schema;

var lunchSchema = schema({
    lunch_date:{
        type: String,
        unique: true
    },
    restaurant_name:{
        type: String
    }
});

module.exports = mongoose.model("Lunch", lunchSchema);
