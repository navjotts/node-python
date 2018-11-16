const path = require('path');
const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')
const upload = multer({ dest: 'imgs/' })

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
    res.render('index', { title: 'Image Prediction Python/NodeJS App' });
});

// Our prediction endpoint (Receives an image as req.file)
app.post('/predict', upload.single('img'), async function (req, res) {
    const { path } = req.file
    try {
        const prediction = await PythonConnector.invoke('predict_from_img', path);
        res.json(prediction);
    }
    catch (e) {
        console.log(`error in ${req.url}`, e);
        res.sendStatus(404);
    }

    // delete the uploaded file (regardless whether prediction successful or not)
    fs.unlink(path, (err) => {
        if (err) console.error(err)
        console.log('Cleaned up', path)
    })
})

app.use(function (err, req, res, next) {
    if (err.status !== 404) return next(err);
    res.status(500);
    res.render('error', { error: err });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, async () => {
    console.log(`Started listening on port ${PORT} ...`);
    await PythonConnector.invoke('listen');
});
