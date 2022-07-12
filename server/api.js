'use strict'
const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');
const sql = require("./src/data/events/dbIndexComponents");
const { addRecipeH } = require('./src/data/events/dbIndexComponents');
const { Console } = require('console');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var allDataFromSelectKomponent, lengthOfSelectKomponent, numberOfSelectRowsKomponent;
var allDataFromSelectRecipeH, lengthOfSelectRecipeH, numberOfSelectRowsRecipeH;
var allDataFromSelectRecipeB, lengthOfSelectRecipeB, numberOfSelectRowsRecipeB;
var allDataFromSelectOrder, lengthOfSelectOrder, numberOfSelectRowsOrder;

const IDKomponent = [], 
NAMEKomponent = [], 
NoKomponent = [], 
komponentArray = [], 
lastUpdate = [], 
RecipeHArray = [], 
RecipeBArray = [], 
orderArray= [], 
doseArray = [];


var total = 1, missingKomponent, missingRecipe, missingOrder;



router.get('/dose-statistics', (req, res) => {
            
        sql.getStatDose().then((result) => {       // Select all from table KOMPONENT  
    
            let allDataFromSelectDose =  JSON.parse(JSON.stringify(result[0]));    
            
            res.json(allDataFromSelectDose);
        }).catch((error) => {
            console.error(error);
        });
              
})


router.get('/components', (req, res) => {
    fs.readFile('components.json', (err, data) => {
        if (err) throw err;
        const components = JSON.parse(data);
        res.json(components);
    });
    
    //res.json(komponentArray);
})

router.put('/components/:no', (req, res) => {
    fs.readFile('components.json', (err, data) => {
        if (err) throw err;
        const components = JSON.parse(data);
        //const components = komponentArray;
        
        const index = components.findIndex(c => c.no === +req.params.no);
        const changedComponent = {
            ...components[index],
            ...req.body,
            lastUpdate: new Date()
        };
        components[index] = changedComponent;

        //sql.updateComponent(changedComponent.id, changedComponent.name, req.params.no);

        fs.writeFile('components.json', JSON.stringify(components), (err) => {
            if (err) throw err;
            console.log('Component ' + changedComponent.no + ' changed: ', changedComponent);
            res.json(changedComponent);
        });
    });
})

router.delete('/components/:no', (req, res) => {
    fs.readFile('components.json', (err, data) => {
        if (err) throw err;

        const components = JSON.parse(data);
        //const components = komponentArray;
        
        const index = components.findIndex(c => c.no === +req.params.no);
        components.splice(index, 1);

        //sql.deleteComponent(req.params.no);

        fs.writeFile('components.json', JSON.stringify(components), (err) => {
            if (err) throw err;
            console.log('Component ' + req.params.no + ' removed');
            res.status(204);
            res.send();
        });
    });
})

router.post('/components', (req, res) => {
    fs.readFile('components.json', (err, data) => {
        if (err) throw err;

        const components =  JSON.parse(data);
        //const components =  komponentArray;
        //const no = missingKomponent;
        const no = Math.max(...components.map(o => o.no)) + 1;

        const newRecipe = {
            no,
            lastUpdate: new Date(),
            ...req.body
        }
        components.push(newRecipe);

        //sql.addComponent(newRecipe['no'], newRecipe['id'], newRecipe['name']);
        
        fs.writeFile('components.json', JSON.stringify(components), (err) => {
            if (err) throw err;
            console.log('New component added: ', newRecipe);
            res.json(newRecipe);
        });
    })
})

// toto spravi join medzi tabulkami, je to klasicky manyToMany mapping
router.get('/recipes', (req, res) => {
    fs.readFile('recipes.json', (err, recipesData) => {
        if (err) throw err;

        let recipes = JSON.parse(recipesData);
        //let recipes = RecipeHArray;

        fs.readFile('components.json', (err, componentsData) => {
            if (err) throw err;

            const components = JSON.parse(componentsData);
            //const components = komponentArray;

            fs.readFile('recipe-components.json', (err, mappingData) => {
                if (err) throw err;

                const mapping = JSON.parse(mappingData);
                //const mapping = RecipeBArray;

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
            })
        })
    });
})


router.put('/recipes/:no', (req, res) => {
    fs.readFile('recipes.json', (err, data) => {
        if (err) throw err;
        const recipes = JSON.parse(data);
        //const recipes = RecipeHArray;
        const index = recipes.findIndex(c => c.no === +req.params.no);
        console.log('BODY:', req.body);
        const changedRecipe = {
            no: recipes[index].no,
            id: req.body.id,
            name: req.body.name,
            lastUpdate: new Date(),
        };
        recipes[index] = changedRecipe;

        //sql.updateRecipeH(changedRecipe.id, changedRecipe.name, req.params.no);

        fs.writeFile('recipes.json', JSON.stringify(recipes), async (err) => {
            if (err) throw err;
            console.log('Recipe ' + changedRecipe.no + ' changed: ', changedRecipe);
            await changeComponents(+req.params.no, req.body.components);
            res.json(changedRecipe);
        });
    });
})

router.delete('/recipes/:no', (req, res) => {
    fs.readFile('recipes.json', (err, data) => {
        if (err) throw err;
        const recipes =JSON.parse(data);
        //const recipes =RecipeHArray;
        const index = recipes.findIndex(c => c.no === +req.params.no);
        recipes.splice(index, 1);

        //sql.deleteRecipeH(req.params.no);

        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if (err) throw err;
            console.log('Recipe ' + req.params.no + ' removed');
            removeComponents(req.params.no);
            res.status(204);
            res.send();
        });
    });
})


router.post('/recipes', (req, res) => {
    fs.readFile('recipes.json', (err, data) => {
        if (err) throw err;
        const recipes = JSON.parse(data);
        //const recipes = RecipeHArray;
        const no = Math.max(...recipes.map(o => o.no)) + 1;
        //const no = missingRecipe;
        const newRecipe = {
            no,
            id: req.body.id,
            name: req.body.name,
            lastUpdate: new Date(),
        }
        //sql.addRecipeH(newRecipe['no'], newRecipe['id'], newRecipe['name']);

        recipes.push(newRecipe);
        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if (err) throw err;
            console.log('New recipe added: ', newRecipe);
            addComponentsToRecipe(+newRecipe.no, req.body.components);
            res.json(newRecipe);
        });
    })
})


router.get('/orders', (req, res) => {
    fs.readFile('orders.json', (err, data) => {
        if (err) throw err;
        const orders = JSON.parse(data);
        //const orders = orderArray;
        fs.readFile('recipes.json', async (err, recipesData) => {
            if (err) throw err;
            const recipes = JSON.parse(recipesData);
            const result = await mapComponentsForOrders(orders, recipes);
            res.json(result);
        });
    })
})

router.get('/orders/list', (req, res) => {
    fs.readFile('orders.json', (err, data) => {
        if (err) throw err;
        const orders = JSON.parse(data);
        res.json(orders);
    })
    //res.json(orderArray);
})

router.post('/orders', (req, res) => {
    fs.readFile('orders.json', (err, data) => {
        if (err) throw err;
        const orders = JSON.parse(data);
        //const orders = orderArray;
        const no = Math.max(...orders.map(o => o.no)) + 1;
        //const no = missingOrder;
        const newOrder = {
            no,
            lastUpdate: new Date(),
            createdAt: new Date(),
            completedAt: null,
            ...req.body
        }
        orders.push(newOrder);

        //sql.addOrders(newOrder['no'], newOrder['id'], newOrder['name'], newOrder['customerName'], newOrder['dueDate'], newOrder['recipeNo'], newOrder['operatorId'], newOrder['operatorName'], newOrder['quantity'], newOrder['idMixer'], newOrder['mixingTime'], newOrder['idPackingMachine']);
        
        fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
            if (err) throw err;
            console.log('New order added: ', newOrder);
            res.json(newOrder);
        });
    })
})

router.put('/orders/:no', (req, res) => {
    fs.readFile('orders.json', (err, data) => {
        if (err) throw err;
        const orders = JSON.parse(data);
        //const orders = orderArray;
        const index = orders.findIndex(o => o.no === +req.params.no);
        const changedOrder = {
            ...orders[index],
            lastUpdate: new Date(),
            ...req.body
        }

        //sql.updateOrders(req.params.no, changedOrder['id'], changedOrder['name'], changedOrder['customerName'], changedOrder['dueDate'], changedOrder['recipeNo'], changedOrder['operatorId'], changedOrder['operatorName'], changedOrder['quantity'], changedOrder['idMixer'], changedOrder['mixingTime'], changedOrder['idPackingMachine']);
        
        orders[index] = changedOrder;
        fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
            if (err) throw err;
            console.log('Order ' + changedOrder.no + ' changed: ', changedOrder);
            res.json(changedOrder);
        })
    })
})

router.delete('/orders/:no', (req, res) => {
    fs.readFile('orders.json', (err, data) => {
        if (err) throw err;
        const orders = JSON.parse(data);
        //const orders = orderArray;
        const index = orders.findIndex(o => o.no === +req.params.no);
        orders.splice(index, 1);

        //sql.deleteOrders(req.params.no);

        fs.writeFile('orders.json', JSON.stringify(orders), (err) => {
            if (err) throw err;
            console.log('Order ' + req.params.no + ' removed');
            res.status(204);
            res.send();
        });
    });
})

router.get('/orders/:no', (req, res) => {
    fs.readFile('orders.json', (err, data) => {
        if (err) throw err;
        const orders = JSON.parse(data);
        //const orders = orderArray;
        const order = orders.find(o => o.no === +req.params.no);
        fs.readFile('recipes.json', async (err, recipeData) => {
            if (err) throw err;
            //const recipe = JSON.parse(recipeData).find(r => r.no === order.recipeNo)
            const recipe = RecipeHArray.find(r => r.no === order.recipeNo)
            console.log('finding recipe: ', recipe);
            order.recipe = await mapComponents(order.recipeNo, recipe);
            console.log('returning order: ', order);
            res.json(order);
        })
    })
})

function removeComponents(no) {
    return new Promise((resolve, reject) => {
        fs.readFile('recipe-components.json', (err, data) => {
            if (err) throw err;
            let mapping = JSON.parse(data);
            //let mapping = RecipeBArray;
            mapping = mapping.filter(c => c.recipeNo !== no);
            //sql.deleteRecipeB(no);
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
        let mapping =JSON.parse(data); 
        //let mapping =RecipeBArray; 
        components?.forEach(c => {
            mapping.push({
                recipeNo: no,
                componentNo: c.no,
                componentSP: c.componentSP
            });

        //sql.addRecipeB(no, c.no, c.componentSP);    
        });
        fs.writeFile('recipe-components.json', JSON.stringify(mapping), (err) => {
            if (err) throw err;
            console.log('Components mappings for recipe ' + no + ' added');
        })
    })
}

async function changeComponents(no, components) {
    await removeComponents(no);
    //await sql.deleteRecipeB(no);
    addComponentsToRecipe(no, components);
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
        fs.readFile('components.json', (err, data) => {
            if (err) throw err;
            const components =  JSON.parse(data);
            // const components =  komponentArray;
            fs.readFile('recipe-components.json', (err, mappingData) => {
                if (err) throw err;
                let mapping =JSON.parse(mappingData);
                //let mapping =RecipeBArray;
                
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
            })
        })
    })
}


// sql.getdataKomponent().then((result) => {       // Select all from table KOMPONENT  

//     allDataFromSelectKomponent = result[0];
//     lengthOfSelectKomponent = result[1];
//     numberOfSelectRowsKomponent = result[2];

//     for (let i = 0; i < lengthOfSelectKomponent; i++) {
//         NoKomponent[i] = allDataFromSelectKomponent[0][i].No; //    
//         IDKomponent[i] = allDataFromSelectKomponent[0][i].ID; // 
//         NAMEKomponent[i] = allDataFromSelectKomponent[0][i].NAME.trim(); // 
//         lastUpdate[i] = allDataFromSelectKomponent[0][i].lastUpdate; // 

//         komponentArray.push({ no: NoKomponent[i], id: IDKomponent[i], name: NAMEKomponent[i], lastUpdate: lastUpdate[i] })
//         //console.log(komponentArray[i]);
//     }
//     // ID Number - if it's missing, put the missing number in the No

//     for (let k = 1; k <= 2147483647; k++) {
//         if (NoKomponent[k - 1] != k) {
//             missingKomponent = k;
//             console.log('missing component ' + missingKomponent);
//             break;
//         }
//     };
// }).catch((error) => {
//     console.error(error);
//   });;

// sql.getdataRecipeHead().then((result) => {       // Select all from table recipe head  

//     allDataFromSelectRecipeH = result[0];
//     lengthOfSelectRecipeH = result[1];
//     numberOfSelectRowsRecipeH = result[2];
//     let noSql = [], idSql = [], nameSql = [], lastUpdateSql = [];
//     for (let i = 0; i < lengthOfSelectRecipeH; i++) {

//         noSql[i] = allDataFromSelectRecipeH[0][i].no; //    
//         idSql[i] = allDataFromSelectRecipeH[0][i].id; // 
//         nameSql[i] = allDataFromSelectRecipeH[0][i].name.trim(); // 
//         lastUpdateSql[i] = allDataFromSelectRecipeH[0][i].lastUpdate; // 

//         RecipeHArray.push({ no: noSql[i], id: idSql[i], name: nameSql[i], lastUpdate: lastUpdateSql[i] });
//         //console.log(RecipeHArray[i]);
//     }
//     // ID Number - if it's missing, put the missing number in the No

//     for (let k = 1; k <= 2147483647; k++) {
//         if (noSql[k - 1] != k) {
//             missingRecipe = k;
//             console.log('missing recipe ' + missingRecipe);
//             break;
//         }
//     };

// }).catch((error) => {
//     console.error(error);
//   });;

// sql.getdataRecipeBody().then((result) => {       // Select all from table recipe body  

//     allDataFromSelectRecipeB = result[0];
//     lengthOfSelectRecipeB = result[1];
//     numberOfSelectRowsRecipeB = result[2];
//     let recipeNo = [], componentNo = [], componentSP = [], lastUpdateSql = [];
//     for (let i = 0; i < lengthOfSelectRecipeB; i++) {

//         recipeNo[i] = allDataFromSelectRecipeB[0][i].recipeNo; //    
//         componentNo[i] = allDataFromSelectRecipeB[0][i].componentNo; // 
//         componentSP[i] = allDataFromSelectRecipeB[0][i].componentSP; //             

//         RecipeBArray.push({ recipeNo: recipeNo[i], componentNo: componentNo[i], componentSP: componentSP[i].toFixed(3) });
//        // console.log(RecipeBArray[i]);
//     }

// }).catch((error) => {
//     console.error(error);
//   });;

// sql.getdataOrder().then((result) => {       // Select all from table recipe body  

//     allDataFromSelectOrder = result[0];
//     lengthOfSelectOrder= result[1];
//     numberOfSelectRowsOrder = result[2];

//     let no = [], id = [], name = [], customerName = [], dueDate = [], recipeNo = [], 
//     operatorId = [], operatorName = [], quantity = [], idMixer = [], mixingTime = [], 
//     idPackingMachine = [], createdAt = [], lastUpdate = [], completedAt = [];

//     for (let i = 0; i < lengthOfSelectOrder; i++) {

//         no[i] = allDataFromSelectOrder[0][i].no; //    
//         id[i] = allDataFromSelectOrder[0][i].id; // 
//         name[i] = allDataFromSelectOrder[0][i].name.trim(); //             
//         customerName[i] = allDataFromSelectOrder[0][i].customerName.trim(); //             
//         dueDate[i] = allDataFromSelectOrder[0][i].dueDate.split('T'); //             
//         recipeNo[i] = allDataFromSelectOrder[0][i].recipeNo; //             
//         operatorId[i] = allDataFromSelectOrder[0][i].operatorId; //             
//         operatorName[i] = allDataFromSelectOrder[0][i].operatorName; //             
//         quantity[i] = allDataFromSelectOrder[0][i].quantity; //             
//         idMixer[i] = allDataFromSelectOrder[0][i].idMixer; //             
//         mixingTime[i] = allDataFromSelectOrder[0][i].mixingTime; //             
//         idPackingMachine[i] = allDataFromSelectOrder[0][i].idPackingMachine; //             
//         createdAt[i] = allDataFromSelectOrder[0][i].createdAt; //             
//         lastUpdate[i] = allDataFromSelectOrder[0][i].lastUpdate; //             
//         completedAt[i] = allDataFromSelectOrder[0][i].completedAt; //             

//         orderArray.push({ no: no[i], id: id[i], name: name[i], customerName: customerName[i], dueDate: dueDate[i][0], 
//             recipeNo: recipeNo[i], operatorId: operatorId[i], operatorName: operatorName[i], quantity: quantity[i].toFixed(3) ,
//             idMixer: idMixer[i] , mixingTime: mixingTime[i], idPackingMachine: idPackingMachine[i], createdAt: createdAt[i]
//             , lastUpdate: lastUpdate[i], completedAt: completedAt[i]   });
//         console.log(orderArray[i]);
//     }

//     for (let k = 1; k <= 2147483647; k++) {
//         if (no[k - 1] != k) {
//             missingOrder = k;
//             console.log('missing Order ' + missingOrder);
//             break;
//         }
//     };

// }).catch((error) => {
//     console.error(error);
//   });;




module.exports = router;
