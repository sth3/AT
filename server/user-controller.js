'use strict'
const express = require('express');
const router = express.Router();
const userService = require('./user-service');
const { getSession, authorizationCheck } = require("./auth");

router.use(express.json());

// cannot be guarded, because it would refresh cookie
router.get('/currentUser', (req, res) => {
    const session = getSession(req);
    res.json(userService.getUserByUsername(session.username));
});

router.get('/users/:id', authorizationCheck(userService.roles.ADMIN), (req, res) => {
    res.json(userService.getUserById(+req.params.id));
});

router.get('/users', authorizationCheck(userService.roles.ADMIN), (req, res) => {
    res.json(userService.getUsers());
});

router.post('/users', authorizationCheck(userService.roles.ADMIN), (req, res) => {
    userService.createUser(req.body);
    res.status(201).end();
});

router.delete('/users/:id', authorizationCheck(userService.roles.ADMIN), (req, res) => {
    userService.deleteUser(+req.params.id);
    res.status(204).end();
});

module.exports = router;

// todo these will have to be Promises with DB
