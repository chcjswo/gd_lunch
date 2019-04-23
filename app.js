const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// //////////// router 설정 //////////////////////
app.use(router);
// //////////////////////////////////////////////

app.listen(3000,  () => {
    console.log('GD Lunch app listening on port 3000!');
});