const db = require("../models");
const Form = db.Form;
const Question = db.Question;
const Option = db.Option;
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const User = db.users;
const dotenv = require('dotenv');
dotenv.config();

// Function to save a new form and its questions in the database
exports.saveForm = async (req, res) => {
    try {
      // Validate request
      if (!req.body.document_name || !req.body.doc_desc || !req.body.questions) {
        return res.status(400).send({
          message: 'document_name, doc_desc, and questions are required fields.',
        });
      }
  
      const { document_name, doc_desc, questions } = req.body;
  
      // Save the form to the database
      const form = await Form.create({
        documentName: document_name,
        documentDescription: doc_desc,
      });
  
      // Array to store the updated questions with questionId
      const updatedQuestions = [];
  
      // Save the questions to the database and associate them with the form
      for (const questionData of questions) {
        const { questionText, questionType, answer, answerKey, points, open, required, options } = questionData;
  
        // Save the question to the database and associate it with the form
        const question = await Question.create({
          questionText,
          questionType,
          answer,
          answerKey,
          points,
          open,
          required,
          formId: form.id, // Set the foreign key 'FormId'
        });
  
        // Save options for the question and associate them with the question
        const savedOptions = [];
        if (options && options.length > 0) {
          for (const option of options) {
            const { optionText } = option;
            const createdOption = await Option.create({
              optionText,
              questionId: question.id, // Set the foreign key 'QuestionId'
            });
  
            savedOptions.push({ ...option, optionId: createdOption.id }); // Add the optionId to the option object
          }
        }
  
        // Add the questionId and options to the question object
        const updatedQuestion = { ...questionData, questionId: question.id, options: savedOptions };
        updatedQuestions.push(updatedQuestion);
      }
  
      // Create a JSON object representing the form data
      const formData = {
        formId: form.id,
        documentName: document_name,
        documentDescription: doc_desc,
        questions: updatedQuestions, // Use the updated questions array with questionId and options
      };
  
      // Convert the form data to JSON string
      const jsonData = JSON.stringify(formData, null, 2);
  
      // Save the JSON data to a file in the "data" folder with the form ID as the filename
      const fileName = `${form.id}.json`;
      fs.writeFileSync(path.join(__dirname, '../data', fileName), jsonData);
  
      return res.status(201).send({ success: true, message: 'Form and questions saved successfully.' });
    } catch (error) {
      console.error('Error while saving form:', error);
      res.status(500).send({
        message: 'An error occurred while saving the form.',
      });
    }
  };
  
  
// Update a form and its questions in the database
exports.updateForm = async (req, res) => {
    const { formId } = req.params;
    const { document_name, doc_desc, questions } = req.body;

    try {
        // Find the form in the database by its ID
        const form = await Form.findByPk(formId);

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Update the form details
        await form.update({
            documentName: document_name,
            documentDescription: doc_desc,
        });

        // Delete the existing questions associated with the form
        await Question.destroy({
            where: { formId },
        });

        const updatedQuestions = []; // Initialize the array

        // Save the updated questions to the database and associate them with the form
        for (const questionData of questions) {
            const { questionText, questionType, answer, answerKey, points, open, required, options } = questionData;

            // Save the question to the database and associate it with the form
            const question = await Question.create({
                questionText,
                questionType,
                answer,
                answerKey,
                points,
                open,
                required,
                formId: form.id, // Set the foreign key 'FormId'
            });

            const savedOptions = [];
            if (options && options.length > 0) {
                for (const option of options) {
                    const { optionText } = option;
                    const createdOption = await Option.create({
                        optionText,
                        questionId: question.id,
                    });

                    savedOptions.push({ ...option, optionId: createdOption.id });
                }
            }

            const updatedQuestion = { ...questionData, questionId: question.id, options: savedOptions };
            updatedQuestions.push(updatedQuestion);
        }

        // Construct the file path to the JSON file in the data folder
        const filePath = path.join(__dirname, `../data/${formId}.json`);

        const formData = {
            formId: form.id,
            documentName: document_name,
            documentDescription: doc_desc,
            questions: updatedQuestions,
        };

        const jsonData = JSON.stringify(formData, null, 2);

        fs.writeFileSync(filePath, jsonData);

        res.status(200).json({ message: 'Form and questions updated successfully' });
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ error: 'An error occurred while updating form' });
    }
};






// Function to get all the files from the "data" folder
exports.getAllFiles = (req, res) => {
    const directoryPath = path.join(__dirname, '../data');

    // Read the contents of the "data" folder
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            console.error('Error while reading files:', err);
            return res.status(500).send({ message: 'Error while reading files.' });
        }
        // Send the list of filenames as a response
        res.send(files);
    });
};

// Function to get all the forms from the database
exports.getAllFormsFromDB = async (req, res) => {
    try {
        // Fetch all forms from the database
        const forms = await Form.findAll();

        // Send the list of forms as a response
        res.send(forms);
    } catch (error) {
        console.error('Error while fetching forms from the database:', error);
        res.status(500).send({ message: 'Error while fetching forms from the database.' });
    }
};

// Function to get a form without details from the database by its ID
exports.getFormById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the form from the database based on the provided ID
        const form = await Form.findByPk(id);

        if (!form) {
            // If the form with the specified ID is not found, send a 404 Not Found response
            return res.status(404).send({ message: 'Form not found.' });
        }

        // Send the form as a response
        res.send(form);
    } catch (error) {
        console.error('Error while fetching form from the database:', error);
        res.status(500).send({ message: 'Error while fetching form from the database.' });
    }
};

// Function to delete a form from the database and the data folder by its ID
exports.deleteFormById = async (req, res) => {
    const { formId } = req.params;

    try {
        // Find the form in the database by its ID
        const form = await Form.findOne({
            where: { id: formId },
            include: [
                {
                    model: Question,
                    as: 'questions',
                    include: [
                        {
                            model: Option,
                            as: 'options',
                        },
                    ],
                },
            ],
        });

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Delete the options associated with each question
        for (const question of form.questions) {
            for (const option of question.options) {
                await option.destroy();
            }
        }

        // Delete the questions associated with the form
        for (const question of form.questions) {
            await question.destroy();
        }

        // Delete the form from the database
        await form.destroy();

        // Get the filename from the documentName property of the form
        const filename = `${formId}.json`;

        // Construct the file path to the JSON file in the data folder
        const filePath = path.join(__dirname, `../data/${filename}`);

        // Check if the file exists before attempting to delete it
        if (fs.existsSync(filePath)) {
            // Delete the JSON file from the data folder
            fs.unlinkSync(filePath);
        }

        res.status(200).json({ message: 'Form, questions, and options deleted successfully' });
    } catch (error) {
        console.error('Error while deleting form:', error);
        res.status(500).json({ message: 'Error while deleting form' });
    }
};


// Function to get form data from JSON file by formId
exports.getFormFromJSON = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the form in the database by its ID
        const form = await Form.findByPk(id);

        if (!form) {
            // If the form with the specified ID is not found, send a 404 Not Found response
            return res.status(404).send({ message: 'Form not found.' });
        }

        // Construct the file path to the JSON file in the data folder
        const filePath = path.join(__dirname, `../data/${id}.json`);

        // Read the JSON file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Error while reading JSON file:', err);
                return res.status(500).send({ message: 'Error while reading JSON file.' });
            }

            try {
                // Parse the JSON data
                const formData = JSON.parse(data);

                // Send the form data as a response
                res.send(formData);
            } catch (error) {
                console.error('Error while parsing JSON data:', error);
                res.status(500).send({ message: 'Error while parsing JSON data.' });
            }
        });
    } catch (error) {
        console.error('Error while fetching form from the database:', error);
        res.status(500).send({ message: 'Error while fetching form from the database.' });
    }
};

exports.sendEmailToAllUsers = async (req, res) => {
    try {
      // Replace these credentials with your actual email credentials
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.EMAIL_PASSWORD
        },
      });
  
      const formId = req.params.formId;
      const formUrlBase = 'http://localhost:3000/Userform'; // Base URL
  
      // Fetch all users from your database
      const users = await User.findAll(); // Fetch users from the database
  
      // Check if there are any users to send emails to
      if (!users || users.length === 0) {
        return res.json({ message: 'No users found. No emails sent.' });
      }
  
      // Loop through each user and send the email
      for (const user of users) {
        const userId = user.id; // Get the user's ID
        const formUrl = `${formUrlBase}/${userId}/${formId}`; // Construct the complete URL
  
        const mailOptions = {
          from: process.env.EMAIL,
          to: user.email, // User's email
          subject: 'Form Response Link',
          text: `Dear ${user.username},\n\nYou can submit your response for the form at the following link: ${formUrl}\n\nBest Regards,\nIACE`,
        };
  
        await transporter.sendMail(mailOptions);
      }
  
      res.json({ message: 'Emails sent successfully.' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).json({ error: 'An error occurred while sending emails.' });
    }
  };