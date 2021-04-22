var express = require('express');
var router = express.Router();
var BoardLogic = require('../modules/logic/BoardLogic')

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log("From Monday");
  console.log(req.body)

  BoardLogic.handleMessage(req.body);
  console.log("wtf")

  let challenge = req.body.challenge;
  res.send({ challenge: challenge })
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ hello: "World" })
});





module.exports = router;
