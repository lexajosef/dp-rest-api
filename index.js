const config = require('config');
const express = require('express');
const bearerToken = require('express-bearer-token');
const authorization = require('./middleware/authorization');
const app = express();

app.use(bearerToken());
require('./startup/routes')(app);

app.get('/', (req, res) => {
  console.log(req.user);
  res.send('Hello world!');
});

const port = process.env.PORT || config.get('port');
app.listen(port, () => { 
  console.log(`Listening on port ${port}...`);
});
