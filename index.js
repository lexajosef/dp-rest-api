const config = require('config');
const express = require('express');
const bearerToken = require('express-bearer-token');
const morgan = require('morgan');
const app = express();

app.use(bearerToken());
app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./startup/routes')(app);

const port = process.env.PORT || config.get('port');
app.listen(port, () => { 
  console.log(`Listening on port ${port}...`);
});
