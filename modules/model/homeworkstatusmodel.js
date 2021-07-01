const { Model, DataTypes } = require('sequelize');

class HomeworkStatusModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            homeworkStatus: DataTypes.STRING,
            color: DataTypes.STRING
        }, 
        { sequelize, modelName: 'homeworkstatus', tableName: 'homeworkstatus', force: force });
    }
}

module.exports = HomeworkStatusModel;