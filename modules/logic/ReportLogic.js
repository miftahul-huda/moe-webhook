var HttpClient = require('./HttpClient');
const { Op } = require("sequelize");
const { GraphQLClient } = require('graphql-request');
const StudentModel = require("../model/studentmodel");
const MappingModel = require("../model/mappingmodel");
var HomeworkModel = require("../model/homeworkmodel");
var HomeworkStatusModel = require("../model/homeworkstatusmodel")
var HomeworkStudentModel = require("../model/homeworkstudentmodel");
const TeacherStudentModel = require('../model/teacherstudentmodel');

var StudentLogic = require('./StudentLogic')
var BoardLogic = require('./BoardLogic')

class ReportLogic
{

    static async getHomeworkStatuses()
    {
        try{
            let statuses = await HomeworkStatusModel.findAll();
            return statuses;
        }
        catch(err)
        {
            return null;
        }
    }

    static async getAllHomeworksBySubject(subjectName)
    {
        try{
            let homeworks = await HomeworkModel.findAll({
                where: {
                    subject: {
                        [Op.iLike] : "" + subjectName + ""
                    }
                }
            });
            return homeworks;
        }
        catch(err)
        {
            return null;
        }
    }

    static async getAllHomeworksByStatus(status)
    {
        try{
            let homeworkStudents = await HomeworkStudentModel.findAll({
                where: {
                    homeworkStatus: {
                        [Op.iLike] : "" + status + ""
                    }
                }
            });
            let homeworkIds = [];
            homeworkStudents.forEach((item)=>{
                homeworkIds.push(item.homeworkId)
            })

            let homeworks = await HomeworkModel.findAll({
                where: {
                    id : {
                        [Op.in] : homeworkIds
                    }
                }
            })
            return homeworks;
        }
        catch(err)
        {
            return null;
        }
    }

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

    static async getAllHomeworksByBoardGroupHomeworkStatus(boardID, groupID, homeworkId, status)
    {
        try {

            let where = [];
            if(homeworkId != "*")
                where.push({ homeworkId: homeworkId  });
            
            if(status != "*")
                where.push({ homeworkStatus: {[Op.iLike] : status}  });
            
            console.log(where);
            
            if(where.length > 0)
                where = { where : {[Op.and] : where} }
            else
                where = {};

            console.log("getAllHomeworksByBoardGroupHomeworkStatus")
            console.log(JSON.stringify(where))

            let homeworkStudents = await HomeworkStudentModel.findAll(where)
            console.log(homeworkStudents)

            let homeworkIds = [];
            homeworkStudents.forEach((item) => {
                homeworkIds.push(item.homeworkId);
            })

            let homeworks = await HomeworkModel.findAll({
                where: {
                    [Op.and] : [
                        { boardID: "" + boardID },
                        { groupID: "" + groupID },
                        {
                            id: {
                                [Op.in] : homeworkIds
                            }
                        }
                    ]
                }
            })     
            return homeworks;   
        }
        catch (err)
        {
            console.log("ERROR");
            console.log(err);
            return null;
        }
    }

    static async getAllStudentsByBoardGroupHomeworkStatus(boardID, groupID, homeworkId, status)
    {
        try {

            let homeworks = await HomeworkModel.findAll({
                where: {
                    [Op.and] :
                    [
                        {boardID: boardID},
                        {groupID: groupID}
                    ]
                }
            });

            let homeworkIds = [];
            homeworks.forEach((item) => {
                homeworkIds.push(item.id);
            })

            let where = [];
            if(homeworkId != "*")
                where.push({ homeworkId: homeworkId  });
            
            if(status != "*")
                where.push({ homeworkStatus: {[Op.iLike] : status}  });

            where.push({ homeworkId : {
                [Op.in] : homeworkIds
            } })
            
            if(where.length > 0)
                where = { where : {[Op.and] : where} }
            else
                where = {};

            let homeworkStudents = await HomeworkStudentModel.findAll(where)

            console.log("getAllStudentsByBoardGroupHomeworkStatus")
            console.log(homeworkStudents)
            let studentIds = [];
            homeworkStudents.forEach((item) => {
                studentIds.push(item.studentId);
            })

            console.log(studentIds)

            let students = await StudentModel.findAll({
                where: {
                    id:{
                        [Op.in] : studentIds
                    }
                }
            })     
            return students;   
        }
        catch (err)
        {
            console.log("ERROR");
            console.log(err);
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