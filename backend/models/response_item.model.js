const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Response_Item = sequelize.define("response_item", {
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        optionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        textResponse: {
            type: DataTypes.STRING,
            allowNull: true,
          },
    });

    return Response_Item;
};
