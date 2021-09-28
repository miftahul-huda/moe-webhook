const { Sequelize, Model, DataTypes } = require('sequelize');


//console.log(sequelize)

var StudentModel = require("../model/studentmodel")
var TeacherModel = require("../model/teachermodel")
var TeacherStudentModel = require("../model/teacherstudentmodel")
var MappingModel = require("../model/mappingmodel")
var HomeworkModel = require("../model/homeworkmodel")
var HomeworkstudentModel = require("../model/homeworkstudentmodel")
var HomeworkStatusModel = require("../model/homeworkstatusmodel")

class Initialization
{
    static async initialize()
    {

        const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
            host: process.env.DBHOST,
            dialect: 'postgresql'  ,
            logging: false
        });

        console.log("Initialize database")
        StudentModel.initialize(sequelize, false);
        TeacherModel.initialize(sequelize, false);
        MappingModel.initialize(sequelize, false);
        HomeworkModel.initialize(sequelize, false);
        HomeworkstudentModel.initialize(sequelize, false);
        TeacherStudentModel.initialize(sequelize, false);
        HomeworkStatusModel.initialize(sequelize, false);

        await sequelize.sync();
    }
}

module.exports = Initialization;