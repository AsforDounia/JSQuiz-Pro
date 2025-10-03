const express = require("express");
const sequelize = require("./config/database"); // path to sequelize file
const userRoutes = require("./routes/users"); // path to users route
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const themesRoutes = require("./routes/themes");
const questionsRoutes = require("./routes/questions");
const quizRoutes = require("./routes/quiz");
const cookieParser = require('cookie-parser'); // Parse cookies for reading JWT from cookie
const expressLayouts = require('express-ejs-layouts');
const jwt = require('jsonwebtoken'); // Add this at the top

require("dotenv").config();
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(expressLayouts);

// config pour EJS
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main'); // default layout file
app.set('views', path.join(__dirname, 'views'));

// pour lire formulaires
app.use(express.urlencoded({ extended: true }));

// fichiers statiques (css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// Parse cookies for reading JWT from cookie
app.use(cookieParser());

// JWT middleware: set req.user from JWT cookie
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
    } catch (err) {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});

// Routes
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/themes", themesRoutes);
app.use("/questions", questionsRoutes);
app.use("/quiz", quizRoutes);




// Test root
app.get("/", (req, res) => {
    console.log(req.user);
    res.render("index",{
        user: req.user,
        layout: 'layouts/main',
        isIndex: true
    });
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
