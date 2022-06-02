const express = require('express');
const router = express.Router();

const bigArray = prepareData();

router.get('/filter', (req, res) => {
    console.log('request: ', req.query.input);
    res.json({response: 'yes'});
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

module.exports = router;
