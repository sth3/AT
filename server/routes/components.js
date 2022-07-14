'use strict'
var express = require('express');
var router = express.Router();
const sql = require("../src/data/events/dbIndexComponents");

const fs = require('fs');
const bodyParser = require('body-parser');


var allDataFromSelectKomponent , lengthOfSelectKomponent , numberOfSelectRowsKomponent ;
const IDKomponent = [];
const NAMEKomponent = [];
const NoKomponent = [];
const komponentArray = [];


var total=1 , missing;
//const bigArray = prepareData();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/components', (req, res) => {
//      fs.readFile('components.json',(err, data) => {
//          if (err) throw err;          
//         const components = JSON.parse(data);       
//         res.json(components);
//    });
res.json(komponentArray);
})

router.put('/components/:ID', (req, res) => {
    fs.readFile('components.json',(err, data) => {
        if (err) throw err;
        const components = Object.values(allDataFromSelectKomponent[0]);// JSON.parse(data);
        const index = components.findIndex(c => c.ID === req.params.id);
        const changedComponent = {
            ...components[index],
            ...req.body
        };
        components[index] = changedComponent;
        
        sql.updateComponent(changedComponent.id, changedComponent.name, changedComponent.No);
        
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
        const components = Object.values(allDataFromSelectKomponent[0]);// JSON.parse(data);
        const index = components.findIndex(c => c.ID === req.params.id);
        console.log(req.params.id);
        components.splice(index, 1);
        sql.deleteComponent(req.params.id);
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
        const components = Object.values(allDataFromSelectKomponent[0]);// JSON.parse(data);
        console.log('typeALL: '+ typeof components);       
        const id = Math.max(...components.map(o => parseInt(o.ID))) + 1;  
        
        const no = missing;// Math.max(...components.map(o => o.No)) + 1;       
        const newRecipe = {
            no,
            id: String(id).padStart(10, '0'),
            ...req.body
        }
        components.push(newRecipe);
        
        //console.log(typeof newRecipe['No']);
        sql.addComponent(newRecipe['no'], newRecipe['id'], newRecipe['name']);
        fs.writeFile('components.json', JSON.stringify(components), (err) => {
            if (err) throw err;
            console.log('New component added: ', newRecipe);
            res.json(newRecipe);
        });
    })
})

// sql.getDataComponent().then((result)=>{       // Select all from table KOMPONENT  
    
//     allDataFromSelectKomponent = result[0];
//     lengthOfSelectKomponent = result[1];     
//     numberOfSelectRowsKomponent = result[2]; 
      
//     for ( let i = 0; i < lengthOfSelectKomponent; i++){
//         NoKomponent[i] = allDataFromSelectKomponent[0][i].No; //    
//         IDKomponent[i] = allDataFromSelectKomponent[0][i].ID; // 
//         NAMEKomponent[i] = allDataFromSelectKomponent[0][i].NAME; // 
        
//         komponentArray.push({no: NoKomponent[i], id: IDKomponent[i], name: NAMEKomponent[i]} )
//         console.log(komponentArray[i]);
//             } 
//     // ID Number - if it's missing, put the missing number in the No
//     let n = NoKomponent.length;
//     let k;    
   
//         for (k = 1; k<= 2147483647; k++){
//             if (NoKomponent[k-1] != k){
//                 missing = k;
//                 console.log(missing);
//                 break;        
//         }};          
//     }); 
  

module.exports = router;
