const express = require("express");
const path = require("path");
const passport = require("passport");
const flash = require('connect-flash')
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { engine } = require("express-handlebars");
const paginate = require("handlebars-paginate");
const connectDB = require("./config/db");

// Init Dotenv
dotenv.config();

const app = express();

// Require Passport Config
require("./config/localPassport")(passport)

// Connect to MongoDB
connectDB();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json({extended: true, limit: '30mb'}))

// Handlebars Helpers
const { formatDate, addNumbers, checkGrade, checkRemark, ifCond, ifArray, capitalize, ifTrue } = require("./middlewares/hbsHelper");

// Express-Handlbars Engine
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    extname: "hbs",
    helpers: {
      formatDate,
      addNumbers,
      checkGrade,
      checkRemark,
      ifCond,
      ifArray,
      ifTrue,
      capitalize,
      paginate
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
      maxAge: 18000000,
    },
  })
);

// Flash
app.use(flash())

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.use("/users", require("./routes/users"));
app.use("/results", require("./routes/results"));

app.get("*", (req, res) => {
  try {
    return res.render("errors/400", {layout: "error", error: "Resource Not Found"})
  } catch (error) {
    console.log(error.message)
    return res.render("errors/500", {layout: "error", error: error.message})
  }
})

// Port listening
app.listen(process.env.PORT, () => {
  console.log(`App Started on PORT ${process.env.PORT}`);
});
