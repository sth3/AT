'use strict';
const express = require('express');
const router = express.Router();

const {
    getSapComponents
} = require('../services/component-sap-service');

router.use(express.json());

router.get('/sap-components', async (req, res) => {
    
    const response = await getSapComponents(+req.params.type);
    res.json(response);
});


module.exports = router;