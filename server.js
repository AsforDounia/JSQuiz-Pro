const express = require("express");
const sequelize = require("./config/database"); // path to sequelize file
const userRoutes = require("./routes/users"); // path to users route
const authRoutes = require("./routes/auth");
const themesRoutes = require("./routes/themes");
const questionsRoutes = require("./routes/questions");
require("dotenv").config();
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// config pour EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// pour lire formulaires
app.use(express.urlencoded({ extended: true }));

// fichiers statiques (css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/themes", themesRoutes);
app.use("/questions", questionsRoutes);

app.get('/index', (req, res) => {
    res.render('index'); 
});

// Test root
app.get("/", (req, res) => {
    res.render("index");
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
