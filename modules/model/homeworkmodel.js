const { Model, DataTypes } = require('sequelize');

class HomeworkModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            homeworkTitle: DataTypes.STRING,
            homeworkStatus: DataTypes.STRING,
            subject: DataTypes.STRING,
            homeworkDueDate: DataTypes.STRING,
            boardID: DataTypes.STRING,
            groupID: DataTypes.STRING,
            itemID: DataTypes.STRING
        }, 
        { sequelize, modelName: 'homework', tableName: 'homework', force: force });
    }
}

module.exports = HomeworkModel;