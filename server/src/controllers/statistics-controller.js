'use strict';
const express = require('express');
const router = express.Router();
const { updateStatSelect} = require("../services/statistic-service");



router.post('/statistics/:type/list',  async (req, res) => {
    
    const updateSelect = await updateStatSelect(+req.params.type, req.body);
    console.log('updateSelect',updateSelect.recordset);   
    res.status(201).json(updateSelect.recordset);
});



router.use(express.json());


module.exports = router;