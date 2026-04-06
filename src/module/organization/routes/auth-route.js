const orgController = require('../controller/auth-controller');
const orgmiddleware = require('../middleware/org-middleware');

const router = require('express').Router();

//auth routes
//login
router.post('/login', orgController.login );

//register
router.post('/register',orgmiddleware.verifySuperAdmin, orgController.register );

module.exports = router;
