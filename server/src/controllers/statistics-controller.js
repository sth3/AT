'use strict';
const express = require('express');
const router = express.Router();
const {getStat, updateStatSelect} = require("../services/statistic-service");

router.get('/statistics/:type', async (req, res) => {    
    const response = await getStat(+req.params.type);    
    res.json(response);
})

router.post('/statistics/:type/list',  async (req, res) => {
    console.log('req.body Controller',req.body);
    console.log('req.body Controller',+req.params.type);
    const updateSelect = await updateStatSelect(+req.params.type, req.body);
   // console.log('updateSelect',updateSelect.recordset);
    //const response = await getOrderByNo(order.no);
    res.status(201).json(updateSelect.recordset);
});



router.use(express.json());


module.exports = router;