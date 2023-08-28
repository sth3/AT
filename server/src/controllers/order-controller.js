'use strict';
const express = require('express');
const router = express.Router();
const { authorizationCheck } = require('../auth');
const { roles } = require('../services/user-service');
const {
    getOrders,
    getOrdersList,
    getOrderByNo,
    addOrder,
    updateOrder,
    deleteOrder,
    addTypeOfOrder,
    getTypeOfOrder
    
} = require('../services/order-service');

router.use(express.json());

router.get('/orders/:done', async (req, res) => {
    console.log(+req.params.done);
    const response = await getOrders(+req.params.done);
    
    res.json(response);
});
router.get('/orders', async (req, res) => {    
    const response = await getTypeOfOrder();    
    res.json(response);
});

router.get('/orders/0/list', async (req, res) => {
    const response = await getOrdersList(0);
    res.json(response);
});

router.post('/orders/0', authorizationCheck(roles.OPERATOR), async (req, res) => {
    const order = await addOrder(req.body);
    const response = await getOrderByNo(order.no);
    res.status(201).json(response);
});

router.post('/orders', authorizationCheck(roles.OPERATOR), async (req, res) => {
    const typeOfOrder = await addTypeOfOrder(req.body);
    //console.log("🚀 ~ file: order-controller.js:40 ~ router.post ~ typeOfOrder:", typeOfOrder)
    const response = await getTypeOfOrder();
    res.status(201).json(response);
});

router.put('/orders/0/:no', authorizationCheck(roles.OPERATOR), async (req, res) => {
    const response = await updateOrder(+req.params.no, req.body);
    res.json(response);
});

router.delete('/orders/0/:no', authorizationCheck(roles.OPERATOR), async (req, res) => {
    await deleteOrder(+req.params.no);
    res.status(204).end();
});

router.get('/orders/0/:no', async (req, res) => {
    const response = await getOrderByNo(+req.params.no);
    res.json(response);
});

module.exports = router;
