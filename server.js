const path = require('path');
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

app.post('/predict', upload.single('img'), async function (req, res) {
  // Our prediction endpoint. Receives an image as req.file
  const { path } = req.file
  const prediction = await PythonConnector.invoke('predict_from_img', path)
  const { predict } = JSON.parse(prediction)
  res.json({ predict })
})

app.get('*', function (req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    if (err.status !== 404) return next(err);
    res.status(500);
    res.render('error', { error: err });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Started listening on port ${PORT} ...`));
