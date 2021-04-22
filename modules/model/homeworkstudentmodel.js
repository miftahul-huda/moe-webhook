const { Model, DataTypes } = require('sequelize');

class HomeworkStudentModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            homeworkId: DataTypes.INTEGER,
            studentId: DataTypes.INTEGER,
            submittedDate: DataTypes.DATE,
            boardID: DataTypes.STRING,
            groupID: DataTypes.STRING,
            itemID: DataTypes.STRING,
            homeworkStatus: DataTypes.STRING
        }, 
        { sequelize, modelName: 'homeworkstudent', tableName: 'homeworkstudent', force: force });
    }
}

module.exports = HomeworkStudentModel;