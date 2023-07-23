const verify = require('../controllers/verifyToken');

module.exports = app => {
  const admin = require("../controllers/admin.controller.js");

  var router = require("express").Router();

  router.post("/register", admin.register);
  router.post("/login", admin.login);
  router.get("/details", verify, admin.getAdminDetails);
  router.post("/logout", admin.logout);

  app.use('/api/admin', router);
};