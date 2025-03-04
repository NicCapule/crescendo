const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Teacher } = require("../models");

router.post("/", async (req, res) => {
  const SECRET_KEY = "your_secret_key";
  try {
    const { email, password } = req.body;
    //------------------------------------------------------------------------//
    const user = await User.findOne({ where: { email } });
    //------------------------------------------------------------------------//
    if (!user) {
      console.log("User not found!");
      return res.status(400).json({ message: "Invalid credentials." });
    }
    //------------------------------------------------------------------------//
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Incorrect password!");
      return res.status(400).json({ message: "Invalid credentials." });
    }
    //------------------------------------------------------------------------//
    let teacher_id = null;
    if (user.role === "Teacher") {
      const teacher = await Teacher.findOne({
        where: { user_id: user.user_id },
      });
      if (teacher) {
        teacher_id = teacher.teacher_id;
      }
    }
    //------------------------------------------------------------------------//
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expires in 1 hour
    );
    //------------------------------------------------------------------------//
    console.log("Login successful:", user.email);
    //------------------------------------------------------------------------//
    res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        teacher_id,
        email: user.email,
        first_name: user.user_first_name,
        last_name: user.user_last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});

module.exports = router;
