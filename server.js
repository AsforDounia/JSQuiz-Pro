const express = require("express");
const sequelize = require("./config/database"); // path to sequelize file
const userRoutes = require("./routes/users"); // path to users route
const authRoutes = require("./routes/auth");
const authenticateToken = require('./middlewares/auth');
const authorizeRoles = require('./middlewares/authorize');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

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
