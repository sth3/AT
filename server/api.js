'use strict'
const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');
const sql = require("./src/data/events/dbIndexComponents");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/dose-statistics', (req, res) => {
    sql.getStatDose().then((result) => {       // Select all from table statDose  
        console.log(result[0]);
        res.json(result[0]);
    }).catch((error) => {
        console.error(error);
    });
})

router.get('/components', (req, res) => {
    // fs.readFile('components.json', (err, data) => {
    //     if (err) throw err;
    //     const components = JSON.parse(data);
    //     res.json(components);
    // });
    getAllDataC(res);
})

router.put('/components/:no', (req, res) => {
    let condition = 1;
    functionForComponents(req, res, condition);

    // fs.readFile('components.json', (err, data) => {
    //     if (err) throw err;
    //     const components = JSON.parse(data);
    //     const index = components.findIndex(c => c.no === +req.params.no);
    //     const changedComponent = {
    //         ...components[index],
    //         ...req.body,
    //         lastUpdate: new Date()
    //     };
    //     components[index] = changedComponent;

    // fs.writeFile('components.json', JSON.stringify(components), (err) => {
    //     if (err) throw err;
    //     console.log('Component ' + changedComponent.no + ' changed: ', changedComponent);
    //     res.json(changedComponent);
    // });
    // });    
})

router.delete('/components/:no', (req, res) => {
    let condition = 2;
    functionForComponents(req, res, condition);

    // fs.readFile('components.json', (err, data) => {
    //     if (err) throw err;
    //     const components = JSON.parse(data);
    //     const index = components.findIndex(c => c.no === +req.params.no);
    //     components.splice(index, 1);

    //     fs.writeFile('components.json', JSON.stringify(components), (err) => {
    //         if (err) throw err;
    //         console.log('Component ' + req.params.no + ' removed');
    //         res.status(204);
    //         res.send();
    //     });    
    // });
})

router.post('/components', (req, res) => {
    let condition = 3;
    functionForComponents(req, res, condition);
    // fs.readFile('components.json', (err, data) => {
    //     if (err) throw err;
    //     const components = JSON.parse(data);
    //     const no = Math.max(...components.map(o => o.no)) + 1;

    //     const newRecipe = {
    //         no,
    //         lastUpdate: new Date(),
    //         ...req.body
    //     }
    //     components.push(newRecipe);

    //     fs.writeFile('components.json', JSON.stringify(components), (err) => {
    //         if (err) throw err;
    //         console.log('New component added: ', newRecipe);
    //         res.json(newRecipe);
    //     });
    // })
})

// toto spravi join medzi tabulkami, je to klasicky manyToMany mapping
router.get('/recipes', (req, res) => {
    let condition = 1;
    functionForRecipes(req, res, condition);

    // fs.readFile('recipes.json', (err, recipesData) => {
    //     if (err) throw err;
    //     let recipes = JSON.parse(recipesData);     

    //     fs.readFile('components.json', (err, componentsData) => {
    //         if (err) throw err;
    //         const components = JSON.parse(componentsData);           

    //         fs.readFile('recipe-components.json', (err, mappingData) => {
    //             if (err) throw err;
    //             const mapping = JSON.parse(mappingData);
    //             recipes = recipes.map(r => {
    //                 const selectedComponents = mapping.filter(m => m.recipeNo === r.no);
    //                 return {
    //                     ...r,
    //                     components: selectedComponents.map(c => {
    //                         const component = components.find(s => s.no === c.componentNo);
    //                         return {
    //                             ...component,
    //                             componentSP: c.componentSP
    //                         }
    //                     })
    //                 }
    //             })
    //             res.json(recipes);
    //         })
    //     })
    // });
})


router.put('/recipes/:no', (req, res) => {
    let condition = 2;
    functionForRecipes(req, res, condition);
    // fs.readFile('recipes.json', (err, data) => {
    //     if (err) throw err;
    //     const recipes = JSON.parse(data);        
    //     const index = recipes.findIndex(c => c.no === +req.params.no);
    //     console.log('BODY:', req.body);

    //     const changedRecipe = {
    //         no: recipes[index].no,
    //         id: req.body.id,
    //         name: req.body.name,
    //         lastUpdate: new Date(),
    //     };
    //     recipes[index] = changedRecipe;        

    //     fs.writeFile('recipes.json', JSON.stringify(recipes), async (err) => {
    //         if (err) throw err;
    //         console.log('Recipe ' + changedRecipe.no + ' changed: ', changedRecipe);
    //         await changeComponents(+req.params.no, req.body.components);
    //         res.json(changedRecipe);
    //     });
    // });    
})

router.delete('/recipes/:no', (req, res) => {
    let condition = 3;
    functionForRecipes(req, res, condition);
    // fs.readFile('recipes.json', (err, data) => {
    //     if (err) throw err;
    //     const recipes = JSON.parse(data);        
    //     const index = recipes.findIndex(c => c.no === +req.params.no);
    //     recipes.splice(index, 1);        

    //     fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
    //         if (err) throw err;
    //         console.log('Recipe ' + req.params.no + ' removed');
    //         removeComponents(req.params.no);
    //         res.status(204);
    //         res.send();
    //     });
    // });
})


router.post('/recipes', (req, res) => {
    let condition = 4;
    functionForRecipes(req, res, condition);
    // fs.readFile('recipes.json', (err, data) => {
    //     if (err) throw err;
    //     const recipes = JSON.parse(data);        
    //     const no = Math.max(...recipes.map(o => o.no)) + 1;
        
    //     const newRecipe = {
    //         no,
    //         id: req.body.id,
    //         name: req.body.name,
    //         lastUpdate: new Date(),
    //     }       

    //     recipes.push(newRecipe);
    //     fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
    //         if (err) throw err;
    //         console.log('New recipe added: ', newRecipe);
    //         addComponentsToRecipe(+newRecipe.no, req.body.components);
    //         res.json(newRecipe);
    //     });
    // })
})


router.get('/orders', (req, res) => {
    let condition = 1;
    functionForOrders(req, res, condition)
    // fs.readFile('orders.json', (err, data) => {
    //     if (err) throw err;
    //     const orders = JSON.parse(data);
    //     fs.readFile('recipes.json', async (err, recipesData) => {
    //         if (err) throw err;
    //         const recipes = JSON.parse(recipesData);
    //         const result = await mapComponentsForOrders(orders, recipes);
    //         res.json(result);
    //     });
    // })
})

router.get('/orders/list', (req, res) => {
    let condition = 2;
    functionForOrders(req, res, condition);
    // fs.readFile('orders.json', (err, data) => {
    //     if (err) throw err;
    //     const orders = JSON.parse(data);
    //     res.json(orders);
    // })
})

router.post('/orders', (req, res) => {
    let condition = 5;
    functionForOrders(req, res, condition);
    // fs.readFile('orders.json', (err, data) => {
    //     if (err) throw err;
    //     const orders = JSON.parse(data);        
    //     const no = Math.max(...orders.map(o => o.no)) + 1;        
    //     const newOrder = {
    //         no,
    //         lastUpdate: new Date(),
    //         createdAt: new Date(),
    //         completedAt: null,
    //         ...req.body
    //     }
    //     orders.push(newOrder);        

    //     fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
    //         if (err) throw err;
    //         console.log('New order added: ', newOrder);
    //         res.json(newOrder);
    //     });
    // })
})

router.put('/orders/:no', (req, res) => {
    let condition = 6;
    functionForOrders(req, res, condition);
    // fs.readFile('orders.json', (err, data) => {
    //     if (err) throw err;
    //     const orders = JSON.parse(data);        
    //     const index = orders.findIndex(o => o.no === +req.params.no);
    //     const changedOrder = {
    //         ...orders[index],
    //         lastUpdate: new Date(),
    //         ...req.body
    //     }
       
    //     orders[index] = changedOrder;
    //     fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
    //         if (err) throw err;
    //         console.log('Order ' + changedOrder.no + ' changed: ', changedOrder);
    //         res.json(changedOrder);
    //     })
    // })
})

router.delete('/orders/:no', (req, res) => {

    let condition = 4;
    functionForOrders(req, res, condition);

    // fs.readFile('orders.json', (err, data) => {
    //     if (err) throw err;
    //     const orders = JSON.parse(data);        
    //     const index = orders.findIndex(o => o.no === +req.params.no);
    //     orders.splice(index, 1);


    //     fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
    //         if (err) throw err;
    //         console.log('Order ' + req.params.no + ' removed');
    //         res.status(204);
    //         res.send();
    //     });
    // });
})

router.get('/orders/:no', (req, res) => {
    let condition = 3;
    functionForOrders(req, res, condition);
    // fs.readFile('orders.json', (err, data) => {
    //     if (err) throw err;
    //     const orders = JSON.parse(data);
    //     const order = orders.find(o => o.no === +req.params.no);

    //     fs.readFile('recipes.json', async (err, recipeData) => {
    //         if (err) throw err;
    //         const recipe = JSON.parse(recipeData).find(r => r.no === order.recipeNo)
    //         console.log('finding recipe: ', recipe);
    //         order.recipe = await mapComponents(order.recipeNo, recipe);
    //         console.log('returning order: ', order.recipe);
    //         res.json(order);
    //     })
    // })
})

function removeComponents(no) {
    return new Promise((resolve, reject) => {
        fs.readFile('recipe-components.json', (err, data) => {
            if (err) throw err;
            let mapping = JSON.parse(data);
            mapping = mapping.filter(c => c.recipeNo !== no);
            fs.writeFile('recipe-components.json', JSON.stringify(mapping), (err) => {
                if (err) throw err;
                console.log('Components mappings for recipe ' + no + ' removed');
                resolve();
            });
        });
    });
}

function addComponentsToRecipe(no, components) {
    fs.readFile('recipe-components.json', (err, data) => {
        if (err) throw err;
        let mapping = JSON.parse(data);
        components?.forEach(c => {
            mapping.push({
                recipeNo: no,
                componentNo: c.no,
                componentSP: c.componentSP
            });
        });
        fs.writeFile('recipe-components.json', JSON.stringify(mapping), (err) => {
            if (err) throw err;
            console.log('Components mappings for recipe ' + no + ' added');
        })
    })
}

async function changeComponents(no, components) {
    // await removeComponents(no);    
    // addComponentsToRecipe(no, components);

    sql.deleteRecipeB(no).then(() => {
        components?.forEach(c => {
            console.log(no, c.no, parseFloat(c.componentSP));

            sql.addRecipeB(parseInt(no), parseInt(c.no), parseFloat(c.componentSP));
        });
    }).catch((error) => {
        return console.error(error);
    });
}

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
        // fs.readFile('components.json', (err, data) => {
        //     if (err) throw err;
        //     const components = JSON.parse(data);
            
        //     fs.readFile('recipe-components.json', (err, mappingData) => {
        //         if (err) throw err;
        //         let mapping = JSON.parse(mappingData);
                

        //         recipe.components = mapping
        //             .filter(c => c.recipeNo === +recipe.no)
        //             .map(c => {
        //                 const component = components.find(r => r.no === +c.componentNo);
        //                 return {
        //                     ...component,
        //                     componentSP: c.componentSP
        //                 }
        //             })
        //         resolve(recipe);
        //     })
        // })
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

function getAllDataC(res) {
    sql.getDataComponent().then((result) => {   // Select all from table statDose             
        return res.json(result[0]);
    }).catch((error) => {
        return console.error(error);
    });
}

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
