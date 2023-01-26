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
    addOrderPacking
} = require('../services/order-service');

router.use(express.json());

router.get('/orders', async (req, res) => {
    const response = await getOrders();
    res.json(response);
});

router.get('/orders/list', async (req, res) => {
    const response = await getOrdersList();
    res.json(response);
});

router.post('/orders', authorizationCheck(roles.OPERATOR), async (req, res) => {
    const order = await addOrder(req.body);
    const response = await getOrderByNo(order.no);
    res.status(201).json(response);
});
router.post('/packingOrderDetail', async (req, res) => {
    await addOrderPacking(req.body);
    // const response = await getOrderByNo(order.no);
    // res.status(201).json(response);
});

router.put('/orders/:no', authorizationCheck(roles.OPERATOR), async (req, res) => {
    const response = await updateOrder(+req.params.no, req.body);
    res.json(response);
});

router.delete('/orders/:no', authorizationCheck(roles.OPERATOR), async (req, res) => {
    await deleteOrder(+req.params.no);
    res.status(204).end();
});

router.get('/orders/:no', async (req, res) => {
    const response = await getOrderByNo(+req.params.no);
    res.json(response);
});

module.exports = router;
