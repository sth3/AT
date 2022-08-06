'use strict'
const express = require('express');
const router = express.Router();
const { authorizationCheck } = require("../auth");
const sql = require("../data/events/dbIndexComponents");
const { roles } = require("../services/user-service");

router.use(express.json());

router.get('/orders', (req, res) => {
    let condition = 1;
    functionForOrders(req, res, condition)
})

router.get('/orders/list', (req, res) => {
    let condition = 2;
    functionForOrders(req, res, condition);
})

router.post('/orders', authorizationCheck(roles.OPERATOR), (req, res) => {
    let condition = 5;
    functionForOrders(req, res, condition);
})

router.put('/orders/:no', authorizationCheck(roles.OPERATOR), (req, res) => {
    let condition = 6;
    functionForOrders(req, res, condition);
})

router.delete('/orders/:no', authorizationCheck(roles.OPERATOR), (req, res) => {

    let condition = 4;
    functionForOrders(req, res, condition);
})

router.get('/orders/:no', (req, res) => {
    let condition = 3;
    functionForOrders(req, res, condition);
})


async function mapComponentsForOrders(orders, recipes) {
    await Promise.all(orders.map(async (o) => {
        o.recipe = await mapComponents(o.recipeNo, recipes.find(r => r.no === o.recipeNo));
    }));
    return orders;
}

async function mapComponents(recipeNo, recipe) {
    return new Promise((resolve, reject) => {
        if (!recipe) {
            resolve(reject(`Recipe ${recipeNo} not found`));
        }
        sql.getDataComponent().then((result) => {
            const components = result[0];
            sql.getdataRecipeBody().then((resultT) => {
                const mapping = resultT[0];

                recipe.components = mapping
                    .filter(c => c.recipeNo === +recipe.no)
                    .map(c => {
                        const component = components.find(r => r.no === +c.componentNo);
                        return {
                            ...component,
                            componentSP: c.componentSP
                        }
                    })
                resolve(recipe);
            }).catch((error) => {
                return console.error(error);
            });
        }).catch((error) => {
            return console.error(error);
        });
    })
}


function functionForOrders(req, res, condition) {
    sql.getdataOrder().then((result) => {       // Select all from table statDose
        let orders = result[0];
        const no = result[3];

        if (condition == 1) {

            sql.getdataRecipeHead().then((result) => {
                const recipes = result[0];
                console.log(recipes);
                mapComponentsForOrders(orders, recipes).then((resultMapComponent) => {
                    res.json(resultMapComponent);
                }).catch((error) => {
                    console.error(error);
                });
            }).catch((error) => {
                console.error(error);
            });
        }

        if (condition == 2) {
            res.json(orders);
        }

        if (condition == 3) {

            const order = orders.find(o => o.no === +req.params.no);
            console.log('finding order: ', order);
            sql.getdataRecipeHead().then((result) => {
                const recipes = result[0];
                const recipe = recipes.find(r => r.no === order.recipeNo)
                console.log('finding recipe: ', recipe);

                mapComponents(order.recipeNo, recipe).then((result) => {
                    order.recipe = result;
                    console.log('returning order: ', order);

                }).then(() => {res.json(order);})
                    .catch((error) => {
                        console.error(error);
                    });
            })

        }
        if (condition == 4) {
            const index = orders.findIndex(o => o.no === +req.params.no);
            orders.splice(index, 1);

            sql.deleteOrders(req.params.no);
            res.status(204);
            res.send();

        }

        if (condition == 5) {

            const newOrder = {
                no,
                lastUpdate: new Date(),
                createdAt: new Date(),
                completedAt: null,
                ...req.body
            }
            orders.push(newOrder);

            sql.addOrders(newOrder['no'], newOrder['id'], newOrder['name'], newOrder['customerName'], newOrder['dueDate'], newOrder['recipeNo'], newOrder['operatorId'], newOrder['operatorName'], newOrder['quantity'], newOrder['idMixer'], newOrder['mixingTime'], newOrder['idPackingMachine']);

            res.json(newOrder);

        }
        if (condition == 6) {

            const index = orders.findIndex(o => o.no === +req.params.no);
            const changedOrder = {
                ...orders[index],
                lastUpdate: new Date(),
                ...req.body
            }

            sql.updateOrders(req.params.no, changedOrder['id'], changedOrder['name'], changedOrder['customerName'], changedOrder['dueDate'], changedOrder['recipeNo'], changedOrder['operatorId'], changedOrder['operatorName'], changedOrder['quantity'], changedOrder['idMixer'], changedOrder['mixingTime'], changedOrder['idPackingMachine']);

            orders[index] = changedOrder;
            res.json(changedOrder);


        }

    }).catch((error) => {
        console.error(error);
    });
}

module.exports = router;
