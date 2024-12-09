const mongoose = require("mongoose");
mongoose.connect("DB URL");
const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
})
module.exports = mongoose.model("user", userSchema);