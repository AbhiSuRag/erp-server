const router = require('express').Router();
const superAdminController = require('../controller/superadmin');

//login
router.post('/login', superAdminController.login);


module.exports = router;
