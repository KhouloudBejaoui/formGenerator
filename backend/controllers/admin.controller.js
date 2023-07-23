const db = require("../models");
const Admin = db.admin;
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verify = require('./verifyToken');

exports.register = async (req, res) => {
  try {
    // Checking if the admin is already in the database
    const emailExist = await Admin.findOne({ where: { email: req.body.email } });
    if (emailExist) return res.status(400).send('Email already exists');

    // Hash passwords
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const adminData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      number: req.body.number
    };

    const admin = await Admin.create(adminData);

    const payload = { subject: admin.id };
    const token = jwt.sign(payload, 'secretKey');

    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.login = async (req, res, next) => {
  try {
    let emailFound = false;
    // Use parameterized query with Sequelize to find the admin by email
    const admin = await Admin.findOne({ where: { email: req.body.email } });

    if (admin) {
      emailFound = true;
      const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);

      if (isPasswordCorrect) {
        // Password is correct, generate a token and send it in the response
        const jwtToken = jwt.sign(
          { email: admin.email, subject: admin.id }, // Use "subject" instead of "adminId" for admin ID
          "secretKey",
          {
            //expiresIn: "1h"
          }
        );
        return res.status(200).json({
          token: jwtToken,
          //expiresIn: 3600,
          _id: admin.id, // Use "id" instead of "_id" to match the payload
        });
      }
    }

    if (!emailFound) {
      // If the email is not found in the database, return an error response
      console.log("Email not found");
      return res.status(401).json({ message: "Authentication failed. Email not found." });
    } else {
      // Email was found, but the password is incorrect, return an error response
      console.log("Incorrect password");
      return res.status(401).json({ message: "Authentication failed. Incorrect password." });
    }
  } catch (error) {
    // Catch any errors that may occur during the login process
    console.error(error);
    return res.status(401).json({ message: "Authentication failed. Please try again." });
  }
};


exports.getAdminDetails = async (req, res) => {
  try {
    // Get the admin's email from the decoded token
    const email = req.user.email;

    // Fetch the admin details from the database using the email
    const admin = await Admin.findOne({
      where: { email: email },
      attributes: ['firstname', 'lastname'], // Include only the required fields
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Return the admin details in the response
    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.logout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};