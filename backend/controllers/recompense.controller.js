const db = require("../models");
const Recompense = db.recompenses;
const Op = db.Sequelize.Op;

// Create and Save a new Recompense
exports.create = (req, res) => {

    // Create a Recompense
    const recompense = {
      libelle: req.body.libelle,
      code: req.body.code,
      operateur: req.body.operateur
    };
  
    // Save recompense in the database
    Recompense.create(recompense)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the recompense."
        });
      });
  };

// Retrieve all Recompenses from the database.
exports.findAll = (req, res) => {
    const operateur = req.query.operateur;
    var condition = operateur ? { operateur: { [Op.like]: `%${operateur}%` } } : null;
  
    Recompense.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving recompenses."
        });
      });
  };

// Find a single recompense with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Recompense.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Recompense with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Recompense with id=" + id
        });
      });
  };

// Update a Recompense by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Recompense.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Recompense was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Recompense with id=${id}. Maybe Recompense was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Recompense with id=" + id
        });
      });
  };

// Delete a Recompense with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Recompense.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Recompense was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Recompense with id=${id}. Maybe Recompense was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Recompense with id=" + id
        });
      });
  };

// Delete all Recompenses from the database.
exports.deleteAll = (req, res) => {
    Recompense.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Recompenses were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all recompenses."
        });
      });
  };
