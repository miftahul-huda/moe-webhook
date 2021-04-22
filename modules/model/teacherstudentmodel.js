const { Model, DataTypes } = require('sequelize');

class TeacherStudentModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            teacherBoardID: DataTypes.STRING,
            teacherGroupID: DataTypes.STRING,
            teacherItemID: DataTypes.STRING,
            studentBoardID: DataTypes.STRING,
            studentGroupID: DataTypes.STRING,
            studentItemID: DataTypes.STRING
        }, 
        { sequelize, modelName: 'teacherstudent', tableName: 'teacherstudent', force: force });
    }
}

module.exports = TeacherStudentModel;