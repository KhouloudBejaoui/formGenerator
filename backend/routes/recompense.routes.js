module.exports = app => {
    const recompenses = require("../controllers/recompense.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Recompense
    router.post("/", recompenses.create);
  
    // Retrieve all Recompenses
    router.get("/", recompenses.findAll);
  
    // Retrieve a single Recompense with id
    router.get("/:id", recompenses.findOne);
  
    // Update a Recompense with id
    router.put("/:id", recompenses.update);
  
    // Delete a Recompense with id
    router.delete("/:id", recompenses.delete);
  
    // Delete all Recompenses
    router.delete("/", recompenses.deleteAll);
  
    app.use('/api/recompenses', router);
  };