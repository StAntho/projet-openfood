import User from "../models/User.js";
import { generateToken } from "./../auth/authentification.js";

export default {
  getSubstitutes: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.products);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getSubstituteById: async (req, res) => {
    const { userId, id } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!(id in user.products)) {
        return res.status(404).json({ message: "Subsitute not found" });
      }
      res.json(user.products[id]);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  setSubstitute: async (req, res) => {
    const { userId, productId, substituteId } = req.body;

    try {
      const user = await User.findById(userId);
      user.products[productId] = substituteId;

      user.markModified('products');

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
        products: updatedUser.products,
        allergen: updatedUser.allergen
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateSubstitute: async (req, res) => {
    const { userId, productId, substituteId } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!(user.products && user.products[productId])) {
        return res.status(404).json({ message: "Substiture not found" })
      }
      user.products[productId] = substituteId;

      user.markModified('products');

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        firstname: updatedUser.firstname,
        mail: updatedUser.mail,
        is_admin: updatedUser.is_admin,
        token: generateToken(updatedUser),
        products: updatedUser.products,
        allergen: updatedUser.allergen
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteSubstitute: async (req, res) => {
    const { userId, productId } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!(user.products && user.products[productId])) {
        return res.status(404).json({ message: "Substiture not found" })
      }
      delete user.products[productId];

      user.markModified('products');

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        firstname: updatedUser.firstname,
        mail: updatedUser.mail,
        is_admin: updatedUser.is_admin,
        token: generateToken(updatedUser),
        products: updatedUser.products,
        allergen: updatedUser.allergen
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
