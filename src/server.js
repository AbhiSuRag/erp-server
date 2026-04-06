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


//cors options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests

    // Allow localhost and any LAN IP like 192.168.x.x:3000
    if (
      origin.startsWith("http://localhost:*") ||
      origin.startsWith("http://localhost:5000") ||
      origin.startsWith("http://192.168.29.108:5000") ||
      /^http:\/\/192\.168\.\d+\.\d+:3000$/.test(origin) ||
      /^http:\/\/192\.168\.\d+\.\d+:3001$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};
//apply cors
app.use(cors(corsOptions));

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
