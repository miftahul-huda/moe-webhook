var HttpClient = require('./HttpClient');
const { Op } = require("sequelize");
const { GraphQLClient } = require('graphql-request');
const StudentModel = require("../model/studentmodel");
const MappingModel = require("../model/mappingmodel");
var HomeworkModel = require("../model/homeworkmodel")
var HomeworkStudentModel = require("../model/homeworkstudentmodel");
const TeacherStudentModel = require('../model/teacherstudentmodel');

var StudentLogic = require('./StudentLogic')
var BoardLogic = require('./BoardLogic')

class ReportLogic
{
    static async getAllSubjects(boardID)
    {
        let board = await BoardLogic.getBoardAndGroupsByBoardId(boardID);
        let subjects = [];
        if(board != null)
        {
            let groups = board.groups;
            groups.map(group => {
                subjects.push({ id: group.id, name: group.title })
            })
        }
        return subjects;
    }

    static async getAllHomeworks(boardID, groupID)
    {
        try {
            let homeworks = await HomeworkModel.findAll({
                where: {
                    [Op.and] : [
                        { boardID: "" + boardID },
                        { groupID: "" + groupID }
                    ]
                }
            })     
            return homeworks;   
        }
        catch (err)
        {
            return null;
        }
        
    }

    static async getAllHomeworkStudents(boardID, groupID)
    {
        try {
            let homeworks = await HomeworkModel.findAll({
                where: {
                    [Op.and] : [
                        { boardID: "" + boardID },
                        { groupID: "" + groupID }
                    ]
                }
            })     

            console.log("homeworks");
            console.log(homeworks);
            
            let homeworkIds = [];
            homeworks.map(homework => {
                homeworkIds.push(homework.id);
            });

            let homeworkStudents = await HomeworkStudentModel.findAll({
                where: {
                    homeworkId : {
                        [Op.in] : homeworkIds
                    }
                }
            }) 

            console.log("homeworkStudents");
            console.log(homeworkStudents);
            return homeworkStudents;
        }
        catch (err)
        {
            return null;
        }
        
    }

    static async getAllStudents(boardID, groupID)
    {
        try {
            let homeworks = await HomeworkModel.findAll({
                where: {
                    [Op.and] : [
                        { boardID: "" + boardID },
                        { groupID: "" + groupID }
                    ]
                }
            })     

            console.log("homeworks");
            console.log(homeworks);
            
            let homeworkIds = [];
            homeworks.map(homework => {
                homeworkIds.push(homework.id);
            });

            let homeworkStudents = await HomeworkStudentModel.findAll({
                where: {
                    homeworkId : {
                        [Op.in] : homeworkIds
                    }
                }
            }) 

            console.log("homeworkStudents");
            console.log(homeworkStudents);

            let studentIds = [];
            homeworkStudents.map(student => {
                studentIds.push(student.studentId);
            });

            let students = await StudentModel.findAll({
                where: {
                    id : {
                        [Op.in] : studentIds
                    }
                }
            }) 

            return students;
        }
        catch (err)
        {
            return null;
        }
        
    }
}

module.exports = ReportLogic;