const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host : dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool :{
        max : dbConfig.pool.max,
        min :dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle:dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize,Sequelize);
db.admin = require("./admin.model.js")(sequelize,Sequelize);
db.Form = require("./form.model.js")(sequelize,Sequelize);
db.Question = require("./question.model.js")(sequelize,Sequelize);
db.Option = require("./option.model.js")(sequelize,Sequelize);

// Define the relationship between tables
db.Form.hasMany(db.Question, { as: 'questions', foreignKey: 'formId' });
db.Question.belongsTo(db.Form, { foreignKey: 'formId' });

db.Question.hasMany(db.Option, {
  foreignKey: 'questionId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.Option.belongsTo(db.Question, { foreignKey: 'questionId' });


module.exports = db;