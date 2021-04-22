const { Model, DataTypes } = require('sequelize');

class StudentModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            studentName: DataTypes.STRING,
            studentNo: DataTypes.STRING,
            boardID: DataTypes.STRING
        }, 
        { sequelize, modelName: 'student', tableName: 'student', force: force });
    }
}

module.exports = StudentModel;