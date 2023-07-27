const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Option = sequelize.define("option", {
    optionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Option;
};
