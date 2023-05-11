'use strict'
const express = require('express');
const router = express.Router();
require('express-async-errors');
const bodyParser = require('body-parser');

const { login, authorizationCheck, logout } = require("./src/auth");
const userController = require('./src/controllers/user-controller');
const componentController = require('./src/controllers/component-controller');
const recipeController = require('./src/controllers/recipe-controller');
const orderController = require('./src/controllers/order-controller');
const statisticsController = require('./src/controllers/statistics-controller');
const aggregateController = require('./src/controllers/aggregate-controller');
const orderSapController = require('./src/controllers/order-sap-controller');
const { roles } = require("./src/services/user-service");


router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.post('/login', login);
router.post('/logout', logout);
router.use(userController);
router.use(componentController);
router.use(recipeController);
router.use(orderController);
router.use(statisticsController);
router.use(aggregateController);
router.use(orderSapController);




// 2 metody na test auth zatial, nedaval som este vsade aby sa ti s tym dalo robit
router.get('/testAuthAdmin', authorizationCheck(roles.ADMIN), (req, res) => {
    res.json({message: 'You are authorized'});
});

router.get('/testAuthOperator', authorizationCheck(roles.OPERATOR), (req, res) => {
    res.json({message: 'You are authorized'});
});

module.exports = router;
