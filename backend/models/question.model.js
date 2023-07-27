const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Question = sequelize.define("question", {
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    answerKey: {
      type: DataTypes.STRING,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    open: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });


  return Question;
};
