//imports
const express = require('express');
const config = require('./core/config');
const logger = require('./core/services/logger');
const { connectToDB } = require('./core/services/db-service');
const organizationModule = require('./module/organization/index');
const requestLogger = require('./core/middleware/request-logger');

//db connection
connectToDB();


//app
const app = express();


//middlewares
app.use(express.json());
app.use(requestLogger);


//routes
app.get('/', (_, res) => {
    res.send('Hello World!');
});

app.use('/api/v1/org/', organizationModule);

//start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT} (env=${config.env})`);
});
