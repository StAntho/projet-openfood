import User from "../models/User.js";
import { generateToken } from "./../auth/authentification.js";
import bcrypt from "bcryptjs";

export default {
  /**
   * Récupération de tous les utilisateurs
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Récupération de l'utilisateur selon l'id passé dans l'url
   */
  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Vérifie le couple de l'adresse mail et du mot de passe
   * >* S'il trouve alors ça retourne un json
   * >* Sinon erreur 404 ou 500
   */
  getUserByMail: async (req, res) => {
    const { mail } = req.params;
    const { password } = req.body;
    try {
      const users = await User.findOne({
        mail: { $regex: mail, $options: "i" },
      });
      if (!users) {
        return res.status(404).json({ message: "User not found" });
      }
      if (bcrypt.compareSync(password, users.password)) {
        res.send({
          _id: users._id,
          username: users.username,
          name: users.name,
          firstname: users.firstname,
          mail: users.mail,
          is_admin: users.is_admin,
          token: generateToken(users),
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Création de l'utilisateur
   */
  createUser: async (req, res) => {
    const { name, firstname, mail, password, username } = req.body;
    const newUser = new User({
      name: name,
      firstname: firstname,
      mail: mail,
      password: bcrypt.hashSync(password),
      username: username,
      is_admin: User.is_admin,
    });
    try {
      const existUser = await User.find({
        mail: { $regex: mail, $options: "i" },
      });
      if (existUser.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }
      const user = await newUser.save();
      res.send({
        _id: user._id,
        name: user.name,
        firstname: user.firstname,
        mail: user.mail,
        username: user.username,
        // password: user.password,
        is_admin: user.is_admin,
        token: generateToken(user),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Modification des données de l'utilisateur selon son id
   */
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, firstname, mail, is_admin, password, username } = req.body;
    try {
      const user = await User.findById(id);
      user.name = name || user.name;
      user.firstname = firstname || user.firstname;
      user.mail = mail || user.mail;
      user.username = username || user.username;
      user.is_admin = is_admin;
      if (password === "" || password === undefined) {
        user.password = user.password;
      } else {
        user.password = bcrypt.hashSync(password);
      }

      const updatedUser = await user.save();
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.send({
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        firstname: updatedUser.firstname,
        mail: updatedUser.mail,
        is_admin: updatedUser.is_admin,
        token: generateToken(updatedUser),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Suppression de l'utilisateur selon son id
   */
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndDelete(id);
      if (user) res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
