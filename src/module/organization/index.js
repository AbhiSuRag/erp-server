const router = require('express').Router();
const orgMiddleware = require('./middleware/org-middleware');
const authRoute = require('./routes/auth-route');
const orgRoute = require('./routes/org-route');


//orgs
router.use('/', orgMiddleware.verifySuperAdmin, orgRoute);

//auth
router.use('/auth', authRoute);


module.exports = router;
