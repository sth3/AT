'use strict';
const express = require('express');
const router = express.Router();
const { authorizationCheck, getSession } = require('../auth');
const { roles } = require('../services/user-service');
const {
    getAllComponents,
    getComponentByNo,
    addComponent,
    updateComponent,
    deleteComponent,
    getActiveComponents,
    addPacking,
    updateComponentPacking,
} = require('../services/component-service');
const userService = require('../services/user-service');

router.use(express.json());

router.get('/components', async (req, res) => {
    const response = await getActiveComponents();
    res.json(response);
});

router.get('/components/all', async (req, res) => {
    const response = await getAllComponents();
    res.json(response);
})

router.get('/components/:no', async (req, res) => {
    const response = await getComponentByNo(+req.params.no);
    res.json(response);
});

router.put('/components/:no', authorizationCheck(roles.TECHNOLOG, false), async (req, res) => {
    const session = getSession(req);
    if (!session) {
        res.send(null);
        return;
    }
    const user = await userService.getUserByUsername(session.username);
    const response = await updateComponent(+req.params.no, req.body, user.id);
    res.json(response);
});
router.put('/componentsPacking/:no', authorizationCheck(roles.TECHNOLOG, false), async (req, res) => {
   
    const response = await updateComponentPacking(+req.params.no, req.body);
    res.json(response);
});

router.delete('/components/:no', authorizationCheck(roles.TECHNOLOG), async (req, res) => {
    await deleteComponent(+req.params.no);
    res.status(204).end();
});

router.post('/components', authorizationCheck(roles.TECHNOLOG),async (req, res) => {    
    
    const component =await addComponent(req.body);       
    await addPacking(req.body, component.no);
    const response =await getComponentByNo(component.no);   
    
    res.status(201).json(response);
});

module.exports = router;
