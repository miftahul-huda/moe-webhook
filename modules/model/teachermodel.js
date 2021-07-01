const { Model, DataTypes } = require('sequelize');

class TeacherModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            teacherName: DataTypes.STRING,
            teacherNo: DataTypes.STRING,
            boardID: DataTypes.STRING
        }, 
        { sequelize, modelName: 'teacher', tableName: 'teacher', force: force });
    }
}

module.exports = TeacherModel;