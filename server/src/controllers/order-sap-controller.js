'use strict';
const express = require('express');
const router = express.Router();
const {getOrdersSap} = require('../services/order-sap-service');

router.use(express.json());

router.get('/orders-sap', async (req, res) => {
    const response = await getOrdersSap();
    res.json(response);
});

module.exports = router;