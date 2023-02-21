'use strict';
const express = require('express');
const router = express.Router();
const { authorizationCheck, getSession } = require('../auth');
const { roles } = require('../services/user-service');
const {
    getAggregates
} = require('../services/aggregate-service');
const userService = require('../services/user-service');

router.use(express.json());

router.get('/aggregates/:type', async (req, res) => {
    
    const response = await getAggregates(+req.params.type);
    res.json(response);
});


module.exports = router;
