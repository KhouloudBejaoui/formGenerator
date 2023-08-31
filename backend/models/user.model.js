module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false 
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    hasAnswered: {
      type: Sequelize.BOOLEAN
    }
  });

  return User;
};