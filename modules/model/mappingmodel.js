const { Model, DataTypes } = require('sequelize');

class MappingModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            fieldname: DataTypes.STRING,
            map: DataTypes.STRING
        }, 
        { sequelize, modelName: 'mapping', tableName: 'mapping', force: force });
    }
}

module.exports = MappingModel;