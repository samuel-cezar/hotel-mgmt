const express = require('express');
const routes = require('./routers/route');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

const port = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);

app.use(
    express.urlencoded({
      extended: true
    })
);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, function(){
        console.log(`Servidor no http://localhost:${port}`);
    });
}

module.exports = app;
