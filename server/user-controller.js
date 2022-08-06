'use strict'
const express = require('express');
const router = express.Router();
const userService = require('./user-service');
const { getSession, authorizationCheck } = require("./auth");

router.use(express.json());

// cannot be guarded, because it would refresh cookie
router.get('/currentUser', async (req, res) => {
    const session = getSession(req);
    if (!session) {
        res.send(null);
        return;
    }
    const user = await userService.getUserByUsername(session.username);
    res.json(user);
});

router.get('/users/:id', authorizationCheck(userService.roles.ADMIN), async (req, res) => {
    const user = await userService.getUserById(+req.params.id);
    res.json(user);
});

router.get('/users', authorizationCheck(userService.roles.ADMIN), async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);
});

router.post('/users', authorizationCheck(userService.roles.ADMIN), async (req, res) => {
    const response = await userService.createUser(req.body);
    res.status(201).json(response);
});

router.delete('/users/:id', authorizationCheck(userService.roles.ADMIN), async (req, res) => {
    await userService.deleteUser(+req.params.id);
    res.status(204).end();
});

router.put('/users/:id', authorizationCheck(userService.roles.ADMIN), async (req, res) => {
    console.log('update user: ', req.body);
    await userService.updateUser(+req.params.id, req.body);
    res.status(204).end();
});

router.put('/users/:id/password', authorizationCheck(userService.roles.ADMIN), async (req, res) => {
    try {
        await userService.changePassword(+req.params.id, req.body.oldPassword, req.body.newPassword);
    } catch (err) {
        res.status(403).json({ message: 'Invalid old password.' });
        return;
    }
    res.status(204).end();
});

module.exports = router;
