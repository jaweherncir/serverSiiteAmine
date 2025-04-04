const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Stocke directement le mot de passe sans cryptage
});

module.exports = mongoose.model("User", UserSchema);
