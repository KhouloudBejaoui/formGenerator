const db = require("../models");
const Response = db.Response;
const Response_Item = db.Response_Item;
const Question = db.Question;
const Option = db.Option;
const User = db.users;
const Excel = require('exceljs');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Function to save a user's response and export it to an Excel file
exports.saveUserResponseAndExport = async (req, res) => {
    const { userId, formId, questions } = req.body;
    console.log('Received data from frontend:', req.body);
    try {
        // Save the user's response to the database
        const response = await Response.create({
            userId,
            formId,
        });

        // Save the individual response items to the database
        const responseItems = questions.map(({ questionId, optionId, textResponse }) => ({
            responseId: response.id,
            questionId,
            optionId,
            textResponse, // Include the textResponse field for text-based responses
        }));
        await Response_Item.bulkCreate(responseItems);

        // Prepare the data for export to Excel
        const excelData = questions.map(({ questionId, optionId, textResponse }) => {
            return {
                Question: questionId,
                Answer: optionId ? optionId : textResponse, // Use optionId if available, otherwise use textResponse
            };
        });

        // Export data to Excel
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(`Response-${response.id}`);

        worksheet.columns = [
            { header: 'Question', key: 'Question' },
            { header: 'Answer', key: 'Answer' },
        ];

        excelData.forEach((data) => {
            worksheet.addRow(data);
        });

        // Set the appropriate headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Response-${response.id}.xlsx`);

        // Send the Excel file as a response
        workbook.xlsx.write(res)
            .then(() => {
                res.end();
            })
            .catch((error) => {
                console.error('Error exporting to Excel:', error);
                res.status(500).send('Error exporting to Excel');
            });
    } catch (error) {
        console.error('Error while saving user response and exporting to Excel:', error);
        res.status(500).send({ message: 'Error while saving user response and exporting to Excel.' });
    }
};


// Function to get responses by formId
exports.getResponsesByFormId = async (req, res) => {
    const { formId } = req.params;
    try {
        const responses = await Response.findAll({
            where: { formId },
            include: [
                {
                    model: Response_Item,
                    as: 'responseItems', // Use the correct alias 'responseItems'
                    include: [
                        {
                            model: Question,
                            as: 'question',
                        },
                    ],
                },
                {
                    model: User,
                    attributes: ['id', 'username', 'email'],
                },
            ],
        });

        // Process the responses and return the data as needed
        const processedResponses = responses.map((response) => {
            const processedItems = response.responseItems.map((item) => ({
                questionId: item.question.id,
                questionText: item.question.questionText,
                textResponse: item.textResponse,
                optionId: item.optionId, // Include optionId if needed
            }));

            return {
                responseId: response.id,
                userId: response.userId,
                formId: response.formId,
                responseItems: processedItems,
            };
        });

        res.status(200).json(processedResponses);
    } catch (error) {
        console.error('Error while fetching responses:', error);
        res.status(500).send({ message: 'Error while fetching responses.' });
    }
};



exports.saveExcelFile = async (req, res) => {
    try {
      console.log('Received file:', req.file); // Check if the file is received by multer
      // The Excel file should be saved in the "response" folder due to multer configuration
      res.json({ message: 'File saved successfully.' });
    } catch (error) {
      console.error('Error handling the request:', error);
      res.status(500).json({ error: 'An error occurred while handling the request.' });
    }
  };
  





