module.exports = (sequelize, Sequelize) => {
    const Recompense = sequelize.define("recompense", {
      libelle: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.BIGINT
      },
      operateur: {
        type: Sequelize.STRING
      },
      isSended :{
        type: Sequelize.BOOLEAN
      }
    });
  
    return Recompense;
  };