const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Response = sequelize.define("response", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        formId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        responseDuration: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        percentageAnswered: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });


    return Response;
};
