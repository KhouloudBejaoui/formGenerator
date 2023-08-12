const db = require("../models");
const Recompense = db.recompenses;
const Op = db.Sequelize.Op;
const User = db.users;
const nodemailer = require('nodemailer');

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

exports.sendRecompenseByEmail = async (req, res) => {
  const { userId, recompenseId } = req.body;

  try {
    const [user, recompense] = await Promise.all([
      User.findByPk(userId),
      Recompense.findByPk(recompenseId)
    ]);

    if (!user || !recompense) {
      return res.status(404).send({ message: 'User or recompense not found.' });
    }

    if (recompense.sent) {
      return res.status(400).send({ message: 'Recompense has already been sent.' });
    }

    // Continue with the sending logic
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'iace.surveymail@gmail.com',
        pass: 'sovlexpprtmwgula'
      }
    });

    const mailOptions = {
      from: 'iace.surveymail@gmail.com',
      to: user.email,
      subject: 'Reward Code',
      text: `Dear ${user.username},\n\nThanks for your response to our form ! \n\nYou've been rewarded with the recompense: ${recompense.libelle} of the operator ${recompense.operateur} (Code: ${recompense.code}).\n\nThank you!`

    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).send({ message: 'Error sending email.' });
      }

      // Update the isSended flag and userId in the database
      recompense.update({ isSended: true,userId: user.id }).then(() => {
        console.log('Email sent:', info.response);
        res.status(200).send({ message: 'Recompense sent successfully.' });
      });
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ message: 'An error occurred.' });
  }
};