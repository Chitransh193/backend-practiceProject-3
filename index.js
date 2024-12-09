const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require("./models/userModel.js");
const app = express();
const port = 3000;
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req,res) => {
  res.render("index");
})

app.post("/register", async (req,res) => {
  let { userName , email , password }  = req.body
  bcrypt.hash(password, 10 , async (err,hash) => {
    const user = await userModel.create({
    userName,
    email,
    password: hash
  })
  })
  res.redirect("/");
})

app.get("/login", (req,res) => {
  res.render("login");
})

app.post("/login", async (req,res) => {
  let { email , password } = req.body;
  let user = await userModel.findOne( {email} );
  if (!user) {
    res.send("something went wrong");
  } else {
  bcrypt.compare( password, user.password , ( err, result ) => {
    if (result === true) {
      let token = jwt.sign({ email: user.email } , "secret");
      res.cookie("token", token);
      res.redirect("/welcome");
    } else {
      res.send("register your self");
    }
  });
}
});

app.get("/logout",(req,res) => {
  res.cookie("token","");
  res.redirect("/");
})

app.get("/welcome", async (req,res) => {
  let token = req.cookies.token;
  let decode = jwt.verify(token ,"secret");
  let user = await userModel.findOne({ email: decode.email });
  res.render("welcome", { user });
})

app.listen( port, () => {
  console.log(`listening on ${port}`);
})