module.exports = app => {
  const statistics = require("../controllers/statistics.controller.js");

  var router = require("express").Router();

  router.get('/', statistics.getStatistics);

  app.use('/api/statistics', router);
};