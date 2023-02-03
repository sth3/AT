'use strict';
const express = require('express');
const router = express.Router();
const { authorizationCheck, getSession } = require('../auth');
const { roles } = require('../services/user-service');
const {
    getAggregate
} = require('../services/aggregate-service');
const userService = require('../services/user-service');

router.use(express.json());

router.get('/aggregate', async (req, res) => {
    const response = await getAggregate();
    res.json(response);
});


module.exports = router;
