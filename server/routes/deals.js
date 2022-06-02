var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('Deals route');
setTimeout(() => {
  let jsonResponse = {
    "handsetCards": [
      { imageName: 'at-logo', title: 'AT - Technology', cols: 1, rows: 1 },
      { imageName: 'Y16-7693-012-Silo-60m3', title: 'Components', cols: 1, rows: 1 },
      { imageName: 'Y-PS.BB-001', title: 'Recipe', cols: 1, rows: 1 },
      { imageName: 'Y-PS.BB-001', title: 'Orders', cols: 1, rows: 1 }
    ],
    "webCards":[
      { imageName: 'at-logo', title: 'AT - Technology', cols: 1, rows: 2 },
      { imageName: 'Y16-7693-012-Silo-60m3', title: 'Components', cols: 1, rows: 2 },
      { imageName: 'Y-PS.BB-001', title: 'Recipe', cols: 1, rows: 2 },
      { imageName: 'Y-PS.BB-001', title: 'Orders', cols: 1, rows: 2 }
    ]
  };
  res.json(jsonResponse);
}, 2000);

  
});

module.exports = router;
