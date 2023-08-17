const fs = require('fs');
const express = require("express");
const cors = require('cors');
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const formRoutes = require("./routes/form.routes");
const responseRoutes = require("./routes/response.routes");
const recompenseRoutes = require("./routes/recompense.routes");
const statisticsRoutes = require("./routes/statistics.routes");

const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
}

app.use(cors(corsOptions));

const db = require("./models")
db.sequelize.sync({ force: false }).then(() => {
    console.log("Synced database.");
});

//parse requests of content-type - application/json
app.use(express.json());

//parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome" });
})

userRoutes(app);
adminRoutes(app);
formRoutes(app);
responseRoutes(app);
recompenseRoutes(app);
statisticsRoutes(app);

// Use the PORT environment variable here
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
