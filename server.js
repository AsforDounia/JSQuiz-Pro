const express = require("express");
const sequelize = require("./config/database"); // path to sequelize file
const userRoutes = require("./routes/users"); // path to users route
const authRoutes = require("./routes/auth");
const themesRoutes = require("./routes/themes");
const questionsRoutes = require("./routes/questions");
const quizRoutes = require("./routes/quiz");
const cookieParser = require('cookie-parser'); // Parse cookies for reading JWT from cookie

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Parse cookies for reading JWT from cookie
app.use(cookieParser());

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/themes", themesRoutes);
app.use("/questions", questionsRoutes);
app.use("/quiz", quizRoutes);



// Test root
app.get("/", (req, res) => {
    res.send("Server is running");
});




// Connect to DB and start server
sequelize
    .authenticate()
    .then(() => {
        console.log("Database connected...");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });
