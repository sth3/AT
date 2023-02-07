'use strict';
const express = require('express');
const router = express.Router();
const {getStat} = require("../services/statistic-service");

router.get('/dose-statistics', async (req, res) => {    
    const response = await getStat();    
    res.json(response);
})

router.use(express.json());


module.exports = router;