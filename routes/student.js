var express = require('express');
var router = express.Router();
var StudentLogic = require('../modules/logic/StudentLogic')

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log("===================================From Monday Student=================================");
  console.log(req.body)

  StudentLogic.handleMessage(req.body);


  let challenge = req.body.challenge;
  res.send({ challenge: challenge })
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ hello: "World" })
});





module.exports = router;
