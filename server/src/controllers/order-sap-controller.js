'use strict';
const express = require('express');
const router = express.Router();
const {getOrdersSap, getOrderSapByNo, addOrderSap} = require('../services/order-sap-service');

router.use(express.json());

router.get('/orders-sap/0', async (req, res) => {
    const response = await getOrdersSap();
    res.json(response);
});

router.get('/orders-sap/0/:recipeRowID', async (req, res) => {
    const response = await getOrderSapByNo(+req.params.recipeRowID);
    res.json(response);
});


router.post('/orders-sap/0', async (req, res) => {   
    
    const order = await addOrderSap(req.body);
    console.log("🚀 ~ file: order-sap-controller.js:22 ~ router.post ~ order:", order)
    const response = await getOrderSapByNo(order.recipeRowID);
   res.status(201).json(response);
});
module.exports = router;