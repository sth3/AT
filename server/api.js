'use strict'
const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/components', (req, res) => {
    fs.readFile('components.json', (err, data) => {
        if (err) throw err;
        const components = JSON.parse(data);
        console.log(components);
        res.json(components);
    });
})

router.put('/components/:id', (req, res) => {
    fs.readFile('components.json', (err, data) => {
        if (err) throw err;
        const components = JSON.parse(data);
        const index = components.findIndex(c => c.id === req.params.id);
        const changedComponent = {
            ...components[index],
            ...req.body,
            lastUpdate: new Date()
        };
        components[index] = changedComponent;
        fs.writeFile('components.json', JSON.stringify(components), (err) => {
            if (err) throw err;
            console.log('Component ' + changedComponent.id + ' changed: ', changedComponent);
            res.json(changedComponent);
        });
    });
})

router.delete('/components/:id', (req, res) => {
    fs.readFile('components.json', (err, data) => {
        if (err) throw err;
        const components = JSON.parse(data);
        const index = components.findIndex(c => c.id === req.params.id);
        components.splice(index, 1);
        fs.writeFile('components.json', JSON.stringify(components), (err) => {
            if (err) throw err;
            console.log('Component ' + req.params.id + ' removed');
            res.status(204);
            res.send();
        });
    });
})

router.post('/components', (req, res) => {
    fs.readFile('components.json', (err, data) => {
        if (err) throw err;
        const components = JSON.parse(data);
        const no = Math.max(...components.map(o => o.no)) + 1;
        const newRecipe = {
            no,
            lastUpdate: new Date(),
            ...req.body
        }
        components.push(newRecipe);
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
        fs.readFile('components.json', (err, componentsData) => {
            if (err) throw err;
            const components = JSON.parse(componentsData);
            fs.readFile('recipe-components.json', (err, mappingData) => {
                if (err) throw err;
                const mapping = JSON.parse(mappingData);
                recipes = recipes.map(r => {
                    const selectedComponents = mapping.filter(m => m.recipeId === r.id);
                    return {
                        ...r,
                        components: selectedComponents.map(c => {
                            const component = components.find(s => s.id === c.componentId);
                            return {
                                ...component,
                                componentSP: c.componentSP
                            }
                        })
                    }
                })
                console.log(recipes);
                res.json(recipes);
            })
        })
    });
})


router.put('/recipes/:id', (req, res) => {
    fs.readFile('recipes.json', (err, data) => {
        if (err) throw err;
        const recipes = JSON.parse(data);
        const index = recipes.findIndex(c => c.id === req.params.id);
        const changedRecipe = {
            no: recipes[index].no,
            id: req.body.id,
            name: req.body.name,
            lastUpdate: new Date(),
        };
        recipes[index] = changedRecipe;
        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if (err) throw err;
            console.log('Recipe ' + changedRecipe.id + ' changed: ', changedRecipe);
            changeComponents(req.params.id, req.body.components);
            res.json(changedRecipe);
        });
    });
})

router.delete('/recipes/:id', (req, res) => {
    fs.readFile('recipes.json', (err, data) => {
        if (err) throw err;
        const recipes = JSON.parse(data);
        const index = recipes.findIndex(c => c.id === req.params.id);
        recipes.splice(index, 1);
        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if (err) throw err;
            console.log('Recipe ' + req.params.id + ' removed');
            removeComponents(req.params.id);
            res.status(204);
            res.send();
        });
    });
})


router.post('/recipes', (req, res) => {
    fs.readFile('recipes.json', (err, data) => {
        if (err) throw err;
        const recipes = JSON.parse(data);
        const no = Math.max(...recipes.map(o => o.no)) + 1;
        const newRecipe = {
            no,
            id: req.body.id,
            name: req.body.name,
            lastUpdate: new Date(),
        }
        recipes.push(newRecipe);
        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if (err) throw err;
            console.log('New recipe added: ', newRecipe);
            addComponentsToRecipe(newRecipe.id, req.body.components);
            res.json(newRecipe);
        });
    })
})

function removeComponents(id) {
    return new Promise((resolve, reject) => {
        fs.readFile('recipe-components.json', (err, data) => {
            if (err) throw err;
            let mapping = JSON.parse(data);
            mapping = mapping.filter(c => c.recipeId !== id);
            fs.writeFile('recipe-components.json', JSON.stringify(mapping), (err) => {
                if (err) throw err;
                console.log('Components mappings for recipe ' + id + ' removed');
                resolve();
            });
        });
    });
}

function addComponentsToRecipe(id, components) {
    fs.readFile('recipe-components.json', (err, data) => {
        if (err) throw err;
        let mapping = JSON.parse(data);
        components.forEach(c => {
            mapping.push({
                recipeId: id,
                componentId: c.id,
                componentSP: c.componentSP
            });
        });
        fs.writeFile('recipe-components.json', JSON.stringify(mapping), (err) => {
            if (err) throw err;
            console.log('Components mappings for recipe ' + id + ' added');
        })
    })
}

async function changeComponents(id, components) {
    await removeComponents(id);
    addComponentsToRecipe(id, components);
}

module.exports = router;
