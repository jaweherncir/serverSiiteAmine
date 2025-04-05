const User = require('../models/userModele');
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Charger les variables d'environnement

module.exports.signUp = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier les champs requis
    if (!username || !password) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    // ✂️ Suppression de la vérification d'unicité
    // const existingUser = await User.findOne({ username });
    // if (existingUser) {
    //   return res.status(400).json({ message: "Nom d'utilisateur déjà pris." });
    // }

    // Créer un nouvel utilisateur
    const newUser = new User({ username, password });

    // Sauvegarder l'utilisateur en base de données
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    console.error("SignUp Error:", error);
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};
