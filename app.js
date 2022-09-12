require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
//mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("user", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.post("/login", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      }
    }
  );
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", function (req, res) {});
app.listen(5000, function () {
  console.log("server started on port 5000");
});

// bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
//   const newUser = new User({
//     email: req.body.username,
//     password: hash,
//   });
//   newUser.save(function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("secret");
//     }
//   });
// });

//#login
// const username = req.body.username;
//   const password = req.body.password;
//   User.findOne({ email: username }, function (err, foundUser) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundUser) {
//         // if (foundUser.password === password) {
//         //   res.render("secret");
//         // }
//         bcrypt.compare(password, foundUser.password, function (err, results) {
//           if (results === true) {
//             res.render("secret");
//           }
//         });
//       }
//     }
//   });
