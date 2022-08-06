'use strict'
const express = require('express');
const router = express.Router();
const { authorizationCheck } = require("../auth");
const sql = require("../data/events/dbIndexComponents");
const { roles } = require("../services/user-service");

router.use(express.json());

// toto spravi join medzi tabulkami, je to klasicky manyToMany mapping
router.get('/recipes', (req, res) => {
    let condition = 1;
    functionForRecipes(req, res, condition);
})


router.put('/recipes/:no', authorizationCheck(roles.TECHNOLOG), (req, res) => {
    let condition = 2;
    functionForRecipes(req, res, condition);
})

router.delete('/recipes/:no', authorizationCheck(roles.TECHNOLOG), (req, res) => {
    let condition = 3;
    functionForRecipes(req, res, condition);
})


router.post('/recipes', authorizationCheck(roles.TECHNOLOG), (req, res) => {
    let condition = 4;
    functionForRecipes(req, res, condition);
})

function functionForRecipes(req, res, condition) {
    sql.getdataRecipeHead().then(async (result) => {       // Select all from table statDose
        let recipes = result[0];
        const no = result[3];
        if (condition === 1) {

            sql.getDataComponent().then((result) => {
                const components = result[0];
                sql.getdataRecipeBody().then((result) => {
                    const mapping = result[0];

                    recipes = recipes.map(r => {
                        const selectedComponents = mapping.filter(m => m.recipeNo === r.no);
                        return {
                            ...r,
                            components: selectedComponents.map(c => {
                                const component = components.find(s => s.no === c.componentNo);
                                return {
                                    ...component,
                                    componentSP: c.componentSP
                                }
                            })
                        }
                    })
                    res.json(recipes);

                }).catch((error) => {
                    return console.error(error);
                });
            }).catch((error) => {
                return console.error(error);
            });
        }

        if (condition === 2) {
            const index = recipes.findIndex(c => c.no === +req.params.no);
            console.log('BODY:', req.body);
            const changedRecipe = {
                no: recipes[index].no,
                id: req.body.id,
                name: req.body.name,
                lastUpdate: new Date(),
            };
            recipes[index] = changedRecipe;

            sql.updateRecipeH(changedRecipe.id, changedRecipe.name, req.params.no);
            await changeComponents(+req.params.no, req.body.components);
            res.json(changedRecipe);
        }

        if (condition === 3) {
            const index = recipes.findIndex(c => c.no === +req.params.no);
            recipes.splice(index, 1);

            sql.deleteRecipeH(req.params.no);
            sql.deleteRecipeB(req.params.no);
            res.status(204);
            res.send();
        }
        if (condition === 4) {

            const newRecipe = {
                no,
                id: req.body.id,
                name: req.body.name,
                lastUpdate: new Date(),
            }
            sql.addRecipeH(newRecipe['no'], newRecipe['id'], newRecipe['name']);

            recipes.push(newRecipe);
            res.json(newRecipe);

            req.body.components?.forEach(c => {
                console.log(no, c.no, parseFloat(c.componentSP));

                sql.addRecipeB(parseInt(no), parseInt(c.no), parseFloat(c.componentSP));
            });
        }

    }).catch((error) => {
        return console.error(error);
    });
}

async function changeComponents(no, components) {
    sql.deleteRecipeB(no).then(() => {
        components?.forEach(c => {
            console.log(no, c.no, parseFloat(c.componentSP));

            sql.addRecipeB(parseInt(no), parseInt(c.no), parseFloat(c.componentSP));
        });
    }).catch((error) => {
        return console.error(error);
    });
}

module.exports = router;
