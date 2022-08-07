'use strict';
const express = require('express');
const router = express.Router();
const { authorizationCheck, getSession } = require('../auth');
const { roles } = require('../services/user-service');
const { getAllRecipes, getRecipeByNo, addRecipe, deleteRecipe, updateRecipe } = require('../services/recipe-service');
const userService = require('../services/user-service');

router.use(express.json());

router.get('/recipes', async (req, res) => {
    const response = await getAllRecipes();
    res.json(response);
});

router.get('/recipes/:no', async (req, res) => {
    const response = await getRecipeByNo(+req.params.no);
    res.json(response);
});

router.put('/recipes/:no', authorizationCheck(roles.TECHNOLOG, false), async (req, res) => {
    const session = getSession(req);
    if (!session) {
        res.send(null);
        return;
    }
    const user = await userService.getUserByUsername(session.username);
    const response = await updateRecipe(+req.params.no, req.body, user.id);
    res.json(response);
});

router.delete('/recipes/:no', authorizationCheck(roles.TECHNOLOG), async (req, res) => {
    await deleteRecipe(+req.params.no);
    res.status(204).send();
});

router.post('/recipes', authorizationCheck(roles.TECHNOLOG), async (req, res) => {
    const recipeNo = await addRecipe(req.body);
    const response = await getRecipeByNo(recipeNo);
    res.status(201).json(response);
});

module.exports = router;
