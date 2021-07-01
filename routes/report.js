var express = require('express');
var router = express.Router();


var StudentLogic = require('../modules/logic/StudentLogic')
var BoardLogic = require('../modules/logic/BoardLogic');
const ReportLogic = require('../modules/logic/ReportLogic');



/* GET homework statuses */
router.get('/homeworkstatuses', async function(req, res, next) {
  console.log("======= REST API =====");
  let statuses = await ReportLogic.getHomeworkStatuses();
  res.send({ success: true, payload: statuses });
});

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

/* GET homeworks by board id and group id and homeworkID and status*/
router.get('/homeworks/by-board-group-homework-status/:boardID/:groupID/:homeworkId/:status', async function(req, res, next) {
  console.log("======= REST API =====");
  let boardID = req.params.boardID;
  let groupID = req.params.groupID;
  let homeworkId = req.params.homeworkId;
  let status = req.params.status;
  
  let students = await ReportLogic.getAllHomeworksByBoardGroupHomeworkStatus(boardID, groupID, homeworkId, status);
  res.send({ success: true, payload: students });
});

/* GET students by board id and group id */
router.get('/students/by-board-and-group/:boardID/:groupID', async function(req, res, next) {
  console.log("======= REST API =====");
  let boardID = req.params.boardID;
  let groupID = req.params.groupID;
  
  let students = await ReportLogic.getAllStudents(boardID, groupID);
  res.send({ success: true, payload: students });
});

/* GET students by board id and group id and homeworkID and status*/
router.get('/students/by-board-group-homework-status/:boardID/:groupID/:homeworkId/:status', async function(req, res, next) {
  console.log("======= REST API =====");
  let boardID = req.params.boardID;
  let groupID = req.params.groupID;
  let homeworkId = req.params.homeworkId;
  let status = req.params.status;
  
  let students = await ReportLogic.getAllStudentsByBoardGroupHomeworkStatus(boardID, groupID, homeworkId, status);
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
