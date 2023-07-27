const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Form = sequelize.define("form", {
    documentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentDescription: {
      type: DataTypes.STRING,
    },
  });

  return Form;
};
