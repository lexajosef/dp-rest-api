const config = require('config');
const express = require('express');
const bearerToken = require('express-bearer-token');
const auth = require('./middleware/authorization');
const app = express();

app.use(bearerToken());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
require('./startup/routes')(app);

app.get('/', (req, res) => {
  console.log(req.user);
  res.send('Hello world!');
});
app.get('/world', auth, (req, res) => {
  console.log(req.user);
  res.send('The Secret Hello World!');
});

const port = process.env.PORT || config.get('port');
app.listen(port, () => { 
  console.log(`Listening on port ${port}...`);
});
