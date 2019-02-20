const config = require('config');
const express = require('express');
const bearerToken = require('express-bearer-token');
const morgan = require('morgan');
const cors = require('./middleware/cors');
const app = express();

app.use(bearerToken());
app.use(morgan('dev'));
app.use(cors);

require('./startup/routes')(app);

const port = process.env.PORT || config.get('port');
app.listen(port, () => { 
  console.log(`Listening on port ${port}...`);
});
