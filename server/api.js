const express = require('express');
const router = express.Router();

const bigArray = [];
for (let i = 0; i < 10000; i++) {
    bigArray.push({
        id: i,
        title: 'title' + i,
        value: '' + Math.floor(Math.random() * 500)
    })
}
router.get('/filter', (req, res) => {
    console.log('request: ', req.query.input);
    res.json({response: 'yes'});
})

router.get('/data', (req, res) => {
    // console.log('query: ', req.query)
    const filterId = req.query.search?.value | null; // filter value (from search field)
    // console.log('filter ', filterId);
    let bigData = []
    if (filterId) {
        bigData = bigArray.filter(e => e.value.indexOf(filterId) > -1);
    } else {
        bigData = bigArray;
    }
    // SELECT * FROM ... LIMIT = req.query.length OFFSET = req.query.start
    const data = JSON.stringify(bigData.slice(req.query.start, +req.query.start + +req.query.length));
    const recordsTotal = bigArray.length; // from DB
    const recordsFiltered = bigData.length;
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

module.exports = router;
