const express = require("express");
const path = require("path");
const passport = require("passport");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { engine } = require("express-handlebars");
const connectDB = require("./config/db");

// Init Dotenv
dotenv.config();

const app = express();

// Require Passport Config
require("./config/localPassport")(passport);

// Connect to MongoDB
connectDB();

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Handlebars Helpers
const { formatDate } = require("./middlewares/hbsHelper");

// Express-Handlbars Engine
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    extname: "hbs",
    helpers: {
      formatDate,
    },
  })
);

app.set("view engine", ".hbs");

//Public Folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 3600000,
    },
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.use("/users", require("./routes/users"));
// app.use("/results", require("./routes/results"));

// Port listening
app.listen(process.env.PORT, () => {
  console.log(`App Started on PORT ${process.env.PORT}`);
});
