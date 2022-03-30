const routes = require('express').Router();


// controller
const userController = require('../controller/userAuthcont');


// routes
routes.post('/login',userController.login);

routes.post('/register',userController.register);

routes.post('/update',userController.update);

routes.post('/verifyotp',userController.verifyotp);




module.exports = routes;