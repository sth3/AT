'use strict'
const express = require('express');
const router = express.Router();
const { authorizationCheck } = require("../auth");
const sql = require('../data/events/dbIndexComponents');
const { roles } = require("../services/user-service");

router.use(express.json());

router.get('/components', (req, res) => {
    getAllDataC(res);
})

router.put('/components/:no', authorizationCheck(roles.TECHNOLOG), (req, res) => {
    let condition = 1;
    functionForComponents(req, res, condition);
})

router.delete('/components/:no', authorizationCheck(roles.TECHNOLOG), (req, res) => {
    let condition = 2;
    functionForComponents(req, res, condition);
})

router.post('/components', authorizationCheck(roles.TECHNOLOG), (req, res) => {
    let condition = 3;
    functionForComponents(req, res, condition);
})
function functionForComponents(req, res, condition) {
    sql.getDataComponent().then((result) => {       // Select all from table statDose
        const components = result[0];
        const no = result[3];

        console.log(condition);
        if (condition === 1) { // Update Component

            const index = components.findIndex(c => c.no === +req.params.no);
            const changedComponent = {
                ...components[index],
                ...req.body,
                lastUpdate: new Date()
            };
            components[index] = changedComponent;

            sql.updateComponent(changedComponent.id, changedComponent.name, req.params.no);
            res.json(components);
        }
        if (condition === 2) { // Remove Component

            const index = components.findIndex(c => c.no === +req.params.no);
            components.splice(index, 1);
            sql.deleteComponent(req.params.no);

            res.status(204);
            res.send();
        }
        if (condition === 3) { //ADD Component

            const newRecipe = {
                no,
                lastUpdate: new Date(),
                ...req.body
            }
            components.push(newRecipe);

            sql.addComponent(newRecipe['no'], newRecipe['id'], newRecipe['name']);
            res.json(newRecipe);
        }

    }).catch((error) => {
        return console.error(error);
    });
}

function getAllDataC(res) {
    sql.getDataComponent().then((result) => {   // Select all from table statDose
        return res.json(result[0]);
    }).catch((error) => {
        return console.error(error);
    });
}


module.exports = router;
