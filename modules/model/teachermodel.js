const { Model, DataTypes } = require('sequelize');

class TeacherModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            studentName: DataTypes.STRING,
            studentNo: DataTypes.STRING,
            boardID: DataTypes.STRING
        }, 
        { sequelize, modelName: 'teacher', tableName: 'teacher', force: force });
    }
}

module.exports = TeacherModel;