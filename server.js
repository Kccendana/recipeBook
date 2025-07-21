const express = require('express');
const app = express();
const mongodb = require('./data/database')
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000


app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Counter-Type, Accept, Z-key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS');
  next()
});


app.use('/', require('./routes'));

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use( async(err, req, res, next) => {
  console.error(err.stack); // for debugging
  res.status(err.status || 500).json({
    success: false,
    statuscode: err.status,
    message: err.message || 'Internal Server Error',
  });
});


mongodb.initDb((err) => {
  if (err) {
    console.log(err)
  }else {
    app.listen(port, () => {
    console.log(`Database listening and node running on port ${port}`);
});
  }
})

