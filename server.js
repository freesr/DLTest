const express = require('express');
const bodyParser = require('body-parser');
const scadaApi = require('./Controller/scadapoints');
const mockedData = require('./model/mockeddata');



const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));



// Middleware for client authentication
function authenticate(req, res, next) {
  const { apikey } = req.headers;
 

  // Check the client's API key
  // Replace 'YOUR_API_KEY' with your actual API key
  if (apikey && apikey === 'vikas') {
    next(); // Authentication succeeded
  } else {
    res.status(401).json({ error: 'Unauthorized' }); // Authentication failed
  }
}


app.get('/',(req,res) =>{
    res.render('index.pug');
})
// Retrieve the list of RTUs
app.get('/rtus', authenticate, (req, res) => {

  const rtus = mockedData.rtus.map((rtu) => rtu.name);
  res.json(rtus);
});

// Retrieve the points associated with an RTU
app.post('/points', authenticate, (req, res) => {
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
app.post('/pointCount', authenticate, (req, res) => {
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
app.post('/pointValue', authenticate, (req, res) => {
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
app.post('/lastValueChange', authenticate, (req, res) => {
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
