const path = require('path'); // Import the path module

module.exports = app => {
    const response = require("../controllers/response.controller.js");
    const multer = require('multer');

    var router = require("express").Router();

    // Define the storage for multer
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Resolve the destination path using path.join()
            const destinationPath = path.join(__dirname, '../response');
            cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    // Create the multer middleware
    const upload = multer({ storage: storage });

    router.get('/:formId', response.getResponsesByFormId);
    router.post('/save', response.saveUserResponseAndExport);
    router.post('/saveExcelFile', upload.single('file'), response.saveExcelFile);

    router.get('/check-response/:userId/:formId', response.checkUserResponse);

    app.use('/api/responses', router);
};