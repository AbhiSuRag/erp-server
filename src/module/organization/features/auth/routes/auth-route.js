const { login, register } = require('../controller/auth-controller');

const router = require('express').Router();

//auth routes
//login
router.post('/login', login );

//register
router.post('/register', register );


module.exports = router;
