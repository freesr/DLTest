const express = require('express');
const bodyParser = require('body-parser');
const scadaApi = require('./Controller/scadapoints');
const mockedData = require('./model/mockeddata');
const users = require('./model/users');
const session = require('express-session');
const apicache = require('apicache');
const cache = apicache.middleware;

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
}));

function authenticateUser(username, password) {
    return users.some((user) => user.username === username && user.password === password);
}

// Custom error handler middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}

app.get('/', requireAuthentication, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

function requireAuthentication(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (authenticateUser(username, password)) {
        req.session.authenticated = true;
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

app.get('/home', requireAuthentication, (req, res) => {
    res.render('index.pug');
});

app.get('/rtus', requireAuthentication, cache('10 seconds'), (req, res) => {
    const rtus = mockedData.rtus.map((rtu) => rtu.name);
    res.json(rtus);
});

app.post('/points', requireAuthentication, cache('10 seconds'), (req, res) => {
    const { rtuName } = req.body;
    const rtu = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    if (rtu) {
        const points = rtu.points.map((point) => point.name);
        res.json(points);
    } else {
        res.status(404).json({ error: 'RTU not found' });
    }
});

app.post('/pointCount', requireAuthentication, cache('10 seconds'), (req, res) => {
    const { rtuName } = req.body;
    const rtu = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    if (rtu) {
        const pointCount = rtu.points.length;
        res.json({ count: pointCount });
    } else {
        res.status(404).json({ error: 'RTU not found' });
    }
});

app.post('/pointValue', requireAuthentication, cache('10 seconds'), (req, res) => {
    const { rtuName, pointName } = req.body;
    const rtu = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    if (rtu) {
        const point = rtu.points.find((point) => point.name === pointName);
        if (point) {
            res.json({ value: point.value });
        } else {
            res.status(404).json({ error: 'Point not found' });
        }
    } else {
        res.status(404).json({ error: 'RTU not found' });
    }
});

app.post('/lastValueChange', requireAuthentication, cache('10 seconds'), (req, res) => {
    const { rtuName, pointName } = req.body;
    const rtu = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    if (rtu) {
        const point = rtu.points.find((point) => point.name === pointName);
        if (point) {
            res.json({ timestamp: point.timestamp });
        } else {
            res.status(404).json({ error: 'Point not found' });
        }
    } else {
        res.status(404).json({ error: 'RTU not found' });
    }
});

// Error handler middleware for routes that are not found
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler middleware for all other errors
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
