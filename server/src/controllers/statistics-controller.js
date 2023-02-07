'use strict';
const express = require('express');
const router = express.Router();
const sql = require("../data/events/dbIndexComponents");

router.get('/dose-statistics', (req, res) => {
    sql.getStatDose().then((result) => {       // Select all from table statDose  
        console.log(result[0]);
        res.json(result[0]);
    }).catch((error) => {
        console.error(error);
    });
})

router.use(express.json());


module.exports = router;