//imports
const express = require('express');
const config = require('./core/config');
const logger = require('./core/services/logger');
const { connectToDB } = require('./core/services/db-service');
const organizationModule = require('./module/organization/index');
const superadminModule = require('./module/superAdmin/index');
const requestLogger = require('./core/middleware/request-logger');
const tenantMiddleware = require('./core/middleware/tenant-middleware');
const cors = require('cors');

//db connection
connectToDB();



//app
const app = express();

//apply cors
app.use(cors(
    options = {
        origin: {
            '*': true,
            'localhost:*': true,
        }, // allow all origins for now; adjust in production
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

//middlewares
app.use(express.json());
app.use(requestLogger);
// tenant middleware: verifies token and attaches per-org DB connection (req.dbConn)
app.use(tenantMiddleware);


//routes
//home
app.get('/', (_, res) => {
    res.send('Hello World!');
});
//org
app.use('/api/v1/org/', organizationModule);
//superadmin
app.use('/api/v1/superadmin/', superadminModule);

//start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server is running on port ${PORT} (env=${config.env})`);
});
