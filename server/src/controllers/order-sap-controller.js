'use strict';
const express = require('express');
const router = express.Router();
const {getOrdersSap, getOrderSapByNo} = require('../services/order-sap-service');

router.use(express.json());

router.get('/orders-sap/0', async (req, res) => {
    const response = await getOrdersSap();
    res.json(response);
});

router.get('/orders-sap/0/:recipeRowID', async (req, res) => {
    const response = await getOrderSapByNo(+req.params.recipeRowID);
    res.json(response);
});

module.exports = router;