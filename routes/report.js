var express = require('express');
var router = express.Router();


var StudentLogic = require('../modules/logic/StudentLogic')
var BoardLogic = require('../modules/logic/BoardLogic');
const ReportLogic = require('../modules/logic/ReportLogic');

/* GET groups by board id */
router.get('/groups/by-board/:boardID', async function(req, res, next) {
    console.log("======= REST API =====");
    let boardID = req.params.boardID;
    
    let subjects = await ReportLogic.getAllSubjects(boardID);
    res.send({ success: true, payload: subjects });
});

/* GET homeworks by board id and group id */
router.get('/homeworks/by-board-and-group/:boardID/:groupID', async function(req, res, next) {
    console.log("======= REST API =====");
    let boardID = req.params.boardID;
    let groupID = req.params.groupID;
    
    let homeworks = await ReportLogic.getAllHomeworks(boardID, groupID);
    res.send({ success: true, payload: homeworks });
});

/* GET homeworks by board id and group id */
router.get('/students/by-board-and-group/:boardID/:groupID', async function(req, res, next) {
  console.log("======= REST API =====");
  let boardID = req.params.boardID;
  let groupID = req.params.groupID;
  
  let students = await ReportLogic.getAllStudents(boardID, groupID);
  res.send({ success: true, payload: students });
});

/* GET homeworks by board id and group id */
router.get('/homeworkstudents/by-board-and-group/:boardID/:groupID', async function(req, res, next) {
  console.log("======= REST API =====");
  let boardID = req.params.boardID;
  let groupID = req.params.groupID;
  
  let homeworkStudents = await ReportLogic.getAllHomeworkStudents(boardID, groupID);
  res.send({ success: true, payload: homeworkStudents });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ hello: "World" })
});





module.exports = router;
