const db = require("../models");
const Form = db.Form;
const Recompense = db.recompenses;
const User = db.users;
const Response = db.Response;

exports.getStatistics = async (req, res) => {
    try {
        const userCount = await User.count();
        const responseCount = await Response.count();
        const formCount = await Form.count();
        const recompenseCount = await Recompense.count();

        // Calculate the count of users who have answered (hasAnswered = true)
        const usersWithAnswers = await User.count({
            where: { hasAnswered: true }
        });
console.log("uuuuuu",usersWithAnswers);
        // Calculate the count of users who have not answered (hasAnswered = false)
        const usersWithoutAnswers = userCount - usersWithAnswers;

        const statistics = {
            users: userCount,
            responses: responseCount,
            forms: formCount,
            recompenses: recompenseCount,
            usersWithAnswers: usersWithAnswers,
            usersWithoutAnswers: usersWithoutAnswers,
        };

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'An error occurred while fetching statistics.' });
    }
};
