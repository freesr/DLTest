const express = require('express');
const bodyParser = require('body-parser');
const scadaApi = require('./Controller/scadapoints');
const mockedData = require('./model/mockeddata');
const users = require('./model/users');
const session = require('express-session');
const expressCache = require('express-cache');


require('dotenv').config();


const app = express();
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
//app.use(expressCache());


function authenticateUser(username, password) {
    return users.some((user) => user.username === username && user.password === password);
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
})

// app.get('/',(req,res) =>{
//     res.render('index.pug');
// })
// Retrieve the list of RTUs
app.get('/rtus', requireAuthentication, (req, res) => {

  const rtus = mockedData.rtus.map((rtu) => rtu.name);
  res.json(rtus);
});

// Retrieve the points associated with an RTU
app.post('/points', requireAuthentication, (req, res) => {
    const { rtuName } = req.body;

    // Implement your logic to retrieve the points associated with the RTU from mockedData
    const rtu = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    if (rtu) {
      const points = rtu.points.map((point) => point.name);
      res.json(points);
    } else {
      res.status(404).json({ error: 'RTU not found' });
    }
});

// Retrieve the number of points associated with an RTU
app.post('/pointCount', requireAuthentication, (req, res) => {
    const { rtuName } = req.body;

    // Implement your logic to retrieve the number of points associated with the RTU from mockedData
    const rtu = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    if (rtu) {
      const pointCount = rtu.points.length;
      res.json({ count: pointCount });
    } else {
      res.status(404).json({ error: 'RTU not found' });
    }
});

// Retrieve the value of a point
app.post('/pointValue', requireAuthentication, (req, res) => {
    const { rtuName, pointName } = req.body;

    // Implement your logic to retrieve the value of the point from mockedData
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

// Retrieve the timestamp of the last value change
app.post('/lastValueChange', requireAuthentication, (req, res) => {
    const { rtuName, pointName } = req.body;

    // Implement your logic to retrieve the timestamp of the last value change of the point from mockedData
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


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
