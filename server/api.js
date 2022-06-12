'use strict'
const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');

const bigArray = prepareData();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/filter', (req, res) => {
    console.log('request: ', req.query.input);
    res.json({response: 'yes'});
})

router.get('/components', (req, res) => {
    fs.readFile('components.json',(err, data) => {
        if (err) throw err;
        const components = JSON.parse(data);
        console.log(components);
        res.json(components);
    });
})

router.put('/components/:ID', (req, res) => {
    fs.readFile('components.json',(err, data) => {
        if (err) throw err;
        const components = JSON.parse(data);
        const index = components.findIndex(c => c.id === req.params.id);
        const changedComponent = {
            ...components[index],
            ...req.body
        };
        components[index] = changedComponent;
        fs.writeFile('components.json', JSON.stringify(components), (err) => {
            if (err) throw err;
            console.log('Component ' + changedComponent.id + ' changed: ', changedComponent);
            res.json(changedComponent);
        });
    });
})

router.delete('/components/:ID', (req, res) => {
    fs.readFile('components.json',(err, data) => {
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
        const id = Math.max(...components.map(o => parseInt(o.id))) + 1;
        const no = Math.max(...components.map(o => o.no)) + 1;
        const newRecipe = {
            no,
            id: String(id).padStart(10, '0'),
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

router.get('/recipes', (req, res) => {
    fs.readFile('recipes.json',(err, data) => {
        if (err) throw err;
        let recipes = JSON.parse(data);
        console.log(recipes);
        res.json(recipes);
    });
})

router.put('/recipes/:ID', (req, res) => {
    fs.readFile('recipes.json',(err, data) => {
        if (err) throw err;
        const recipes = JSON.parse(data);
        const index = recipes.findIndex(c => c.id === req.params.id);
        const changedRecipe = {
            id: recipes[index].id,
            no: recipes[index].no,
            ...req.body
        };
        recipes[index] = changedRecipe;
        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if (err) throw err;
            console.log('Recipe ' + changedRecipe.id + ' changed: ', changedRecipe);
            res.json(changedRecipe);
        });
    });
})

router.delete('/recipes/:ID', (req, res) => {
    fs.readFile('recipes.json',(err, data) => {
        if (err) throw err;
        const recipes = JSON.parse(data);
        const index = recipes.findIndex(c => c.id === req.params.id);
        recipes.splice(index, 1);
        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if (err) throw err;
            console.log('Recipe ' + req.params.id + ' removed');
            res.status(204);
            res.send();
        });
    });
})

router.post('/recipes', (req, res) => {
    fs.readFile('recipes.json', (err, data) => {
        if (err) throw err;
        const recipes = JSON.parse(data);
        const id = Math.max(...recipes.map(o => parseInt(o.id))) + 1;
        const no = Math.max(...recipes.map(o => o.no)) + 1;
        const newRecipe = {
            no,
            id: String(id).padStart(10, '0'),
            ...req.body
        }
        recipes.push(newRecipe);
        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if (err) throw err;
            console.log('New recipe added: ', newRecipe);
            res.json(newRecipe);
        });
    })
})

router.get('/data', (req, res) => {
    // console.log('query: ', req.query)
    const filterId = req.query.search?.value | null; // filter value (from search field)
    // console.log('filter ', filterId);
    let data;
    if (filterId) {
        data = bigArray.filter(e => e.value.indexOf(filterId) > -1);
    } else {
        data = bigArray;
    }
    // SELECT * FROM ... LIMIT = req.query.length OFFSET = req.query.start
    if (req.query.start != null && req.query.length != null) {
        data = JSON.stringify(data.slice(req.query.start, +req.query.start + +req.query.length));
    } else {
        data = JSON.stringify(data);
    }
    const recordsTotal = bigArray.length; // from DB
    const recordsFiltered = data.length;
    res.json({
        'draw': parseInt(req.query.draw),
        'recordsFiltered': recordsFiltered,
        'recordsTotal': recordsTotal,
        'data': JSON.parse(data) // needs to be JSON array
    })
})

router.delete('/data/:ID', ((req, res) => {
    // SQL Delete, remove stuff below
    const index = bigArray.findIndex(e => e.id === +req.params.id);
    console.log('delete ID: ' + req.params.id + ' at index: ' + index);
    bigArray.splice(index, 1);
    console.log(bigArray.slice(0, 10)); // just to check first 10
    res.send()
}))

function prepareData() {
    const arr = [];
    let obj;
    for (let i = 0; i < 10000; i++) {
        obj = {
            no: i,
            id: String(i).padStart(5, '0'),
            name: 'name' + i
        }
        for (let j = 0; j < Math.floor(Math.random() * (30 - 1 + 1)) + 1; j++) {
            obj['componentName' + j] = 'component' + j;
            obj['componentSP' + j] = j;
        }
        arr.push(obj)
    }
    return arr;
}

module.exports = router;
