const router = require('express').Router();
const orgController = require('../controller/org-controller');

//get all org
router.get('/getall', orgController.getAllOrg);

//search
router.get('/search', orgController.search);


//export
module.exports = router
