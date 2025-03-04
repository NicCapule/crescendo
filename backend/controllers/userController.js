const { User } = require("../models");
const bcrypt = require("bcryptjs");
//----------------------------------------------------------------------------------------//
exports.getAllUsers = async (req, res) => {
  const AllUsers = await User.findAll();
  res.json(AllUsers);
};
//----------------------------------------------------------------------------------------//
exports.createAdmin = async (req, res) => {
  try {
    const { user_first_name, user_last_name, email, password } = req.body;
    //----------------------------------------------------------------------------//
    const hashedPassword = await bcrypt.hash(password, 10);
    //----------------------------------------------------------------------------//
    const newUser = await User.create({
      user_first_name,
      user_last_name,
      email,
      password: hashedPassword,
      role: "Admin",
    });
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating admin", details: error.message });
  }
};
