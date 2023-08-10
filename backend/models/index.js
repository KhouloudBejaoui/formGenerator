const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.admin = require("./admin.model.js")(sequelize, Sequelize);
db.Form = require("./form.model.js")(sequelize, Sequelize);
db.Question = require("./question.model.js")(sequelize, Sequelize);
db.Option = require("./option.model.js")(sequelize, Sequelize);
db.Response = require("./response.model.js")(sequelize, Sequelize);
db.Response_Item = require("./response_item.model.js")(sequelize, Sequelize);
db.recompenses = require("./recompense.model.js")(sequelize, Sequelize);

// Define the relationship between tables
db.Form.hasMany(db.Question, { as: 'questions', foreignKey: 'formId' });
db.Question.belongsTo(db.Form, { foreignKey: 'formId', as: 'form' });

db.Question.hasMany(db.Option, { foreignKey: 'questionId', as: 'options' });
db.Option.belongsTo(db.Question, { foreignKey: 'questionId', as: 'question' });

db.Form.hasMany(db.Response, { as: 'responses', foreignKey: 'formId' });
db.users.hasMany(db.Response, { as: 'responses', foreignKey: 'userId' });

db.Question.belongsToMany(db.Response, { through: db.Response_Item, foreignKey: 'questionId', as: 'responses', });
db.Response.belongsToMany(db.Question, { through: db.Response_Item, foreignKey: 'responseId', as: 'questions', });
db.Response_Item.belongsTo(db.Question, { foreignKey: 'questionId', as: 'question' });

db.Response.belongsTo(db.users, { foreignKey: 'userId' });
db.Response.belongsTo(db.Form, { foreignKey: 'formId' });

db.Response.hasMany(db.Response_Item, { foreignKey: 'responseId', as: 'responseItems' });
db.Response_Item.belongsTo(db.Response, { foreignKey: 'responseId', as: 'response' });

db.users.hasMany(db.recompenses, { foreignKey: 'userId' });
db.recompenses.belongsTo(db.users, { foreignKey: 'userId' });

module.exports = db;