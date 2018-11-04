const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const PythonConnector = require('./PythonConnector.js');

var app = express();

app.set('views', path.join(__dirname, 'client', 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'client', 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', function (req, res) {
    console.log(req.url);
    res.render('index', {title: 'Demo App'});
});

app.get('/test', async function (req, res, next) {
    console.log(req.url);
    var pyRes = await PythonConnector.invoke('test', 'None');
    var data = {result: pyRes}
    res.json(data);
});

app.get('*', function (req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    if (err.status !== 404) {
        return next(err);
    }

    res.status(500);
    res.render('error', { error: err });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Started listening on port ${PORT} ...`));