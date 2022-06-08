
'use strict'
var express = require('express');
var router = express.Router();
const sql = require("../src/data/events/dbIndexComponents");

const fs = require('fs');
const bodyParser = require('body-parser');


var allDataFromSelectRecipe , lengthOfSelectRecipe , numberOfSelectRowsRecipe ;

const IDRecipe = [];
const NAMERecipe = [];
const NoRecipe = [];
const RecipeName1 = []; const RecipeSP1 = [];
const RecipeName2 = []; const RecipeSP2 = [];
const RecipeName3 = []; const RecipeSP3 = [];
const RecipeName4 = []; const RecipeSP4 = [];
const RecipeName5 = []; const RecipeSP5 = [];
const RecipeName6 = []; const RecipeSP6 = [];
const RecipeName7 = []; const RecipeSP7 = [];
const RecipeName8 = []; const RecipeSP8 = [];
const RecipeName9 = []; const RecipeSP9 = [];
const RecipeName10 = []; const RecipeSP10 = [];
const RecipeName11 = []; const RecipeSP11 = [];
const RecipeName12 = []; const RecipeSP12 = [];
const RecipeName13 = []; const RecipeSP13 = [];
const RecipeName14 = []; const RecipeSP14 = [];
const RecipeName15 = []; const RecipeSP15 = [];
const RecipeName16 = []; const RecipeSP16 = [];
const RecipeName17 = []; const RecipeSP17 = [];
const RecipeName18 = []; const RecipeSP18 = [];
const RecipeName19 = []; const RecipeSP19 = [];
const RecipeName20 = []; const RecipeSP20 = [];
const RecipeName21 = []; const RecipeSP21 = [];
const RecipeName22 = []; const RecipeSP22 = [];
const RecipeName23 = []; const RecipeSP23 = [];
const RecipeName24 = []; const RecipeSP24 = [];
const RecipeName25 = []; const RecipeSP25 = [];
const RecipeName26 = []; const RecipeSP26 = [];
const RecipeName27 = []; const RecipeSP27 = [];
const RecipeName28 = []; const RecipeSP28 = [];
const RecipeName29 = []; const RecipeSP29 = [];
const RecipeName30 = []; const RecipeSP30 = [];


const recipeArray = [];



router.get('/recipes', (req, res) => {
    fs.readFile('recipes.json',(err, data) => {
        if (err) throw err;
        let recipes = JSON.parse(data);
        console.log(recipes);
        res.json(recipes);
    });
})

router.put('/recipes/:id', (req, res) => {
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

router.delete('/recipes/:id', (req, res) => {
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

router.delete('/data/:id', ((req, res) => {
    // SQL Delete, remove stuff below
    const index = bigArray.findIndex(e => e.id === +req.params.id);
    console.log('delete id: ' + req.params.id + ' at index: ' + index);
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



sql.getdataRecipe().then((result)=>{       // Select all from table Recipe  

    allDataFromSelectRecipe = result[0];
    lengthOfSelectRecipe= result[1];     
    numberOfSelectRowsRecipe = result[2]; 
    
    for ( let i = 0; i < lengthOfSelectRecipe; i++){
       
        NoRecipe[i] = allDataFromSelectRecipe[0][i].No; //    
        IDRecipe[i] = allDataFromSelectRecipe[0][i].ID; // 
        NAMERecipe[i] = allDataFromSelectRecipe[0][i].NAME; // 
        RecipeName1[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_1; RecipeSP1[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_1; //  
        RecipeName2[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_2; RecipeSP2[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_2; //  
        RecipeName3[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_3; RecipeSP3[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_3; //  
        RecipeName4[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_4; RecipeSP4[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_4; //  
        RecipeName5[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_5; RecipeSP5[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_5; //  
        RecipeName6[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_6; RecipeSP6[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_6; //  
        RecipeName7[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_7; RecipeSP7[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_7; //  
        RecipeName8[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_8; RecipeSP8[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_8; //  
        RecipeName9[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_9; RecipeSP9[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_9; //  
        RecipeName10[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_10; RecipeSP10[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_10; //  
        RecipeName11[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_11; RecipeSP11[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_11; //  
        RecipeName12[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_12; RecipeSP12[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_12; //  
        RecipeName13[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_13; RecipeSP13[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_13; //  
        RecipeName14[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_14; RecipeSP14[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_14; //  
        RecipeName15[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_15; RecipeSP15[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_15; //  
        RecipeName16[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_16; RecipeSP16[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_16; //  
        RecipeName17[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_17; RecipeSP17[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_17; //  
        RecipeName18[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_18; RecipeSP18[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_18; //  
        RecipeName19[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_19; RecipeSP19[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_19; //  
        RecipeName20[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_20; RecipeSP20[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_20; //  
        RecipeName21[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_21; RecipeSP21[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_21; //  
        RecipeName22[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_22; RecipeSP22[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_22; //  
        RecipeName23[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_23; RecipeSP23[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_23; //  
        RecipeName24[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_24; RecipeSP24[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_24; //  
        RecipeName25[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_25; RecipeSP25[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_25; //  
        RecipeName26[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_26; RecipeSP26[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_26; //  
        RecipeName27[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_27; RecipeSP27[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_27; //  
        RecipeName28[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_28; RecipeSP28[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_28; //  
        RecipeName29[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_29; RecipeSP29[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_29; //  
        RecipeName30[i] = allDataFromSelectRecipe[0][i].KOMPONENT_NAME_30; RecipeSP30[i]= allDataFromSelectRecipe[0][i].KOMPONENT_SP_30; //  
        
        recipeArray.push({id: i, title: NAMERecipe[i]  + i, value: '' + IDRecipe[i]} )
        //console.log(recipeArray[i]);
    } 
    });  