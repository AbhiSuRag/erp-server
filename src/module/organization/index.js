const router = require('express').Router();
const authFeature = require('./features/auth/routes/auth-route');


//features
router.use('/auth', authFeature);



module.exports = router;
