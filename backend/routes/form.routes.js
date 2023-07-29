module.exports = app => {
  const form = require("../controllers/form.controller.js");

  var router = require("express").Router();

  router.post("/save", form.saveForm);
  router.get("/get_all_files", form.getAllFiles);
  router.get("/get_all_forms", form.getAllFormsFromDB);
  router.get('/get_form/:id', form.getFormById);
  router.get('/get_form_json/:id', form.getFormFromJSON);
  router.delete('/:formId', form.deleteFormById);

  app.use('/api/forms', router);
};