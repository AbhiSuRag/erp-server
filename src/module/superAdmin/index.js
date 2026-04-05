const router = require('express').Router();


router.use('/auth', require('./routes/superadmin'));

module.exports = router;
