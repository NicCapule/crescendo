const { User, Teacher, Program, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
//----------------------------------------------------------------------------------------//
exports.getUserTable = async (req, res) => {
  const UserTable = await User.findAll({
    attributes: [
      "user_id",
      "user_first_name",
      "user_last_name",
      "email",
      "role",
      "createdAt",
    ],
  });
  res.json(UserTable);
};
//----------------------------------------------------------------------------------------//
exports.createAdmin = async (req, res) => {
  try {
    const { user_first_name, user_last_name, email, password } = req.body;
    //----------------------------------------------------------------------------//
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }
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
      .json({ error: "Error creating Administrator.", error: error.message });
  }
};
//----------------------------------------------------------------------------------------//
exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["user_id", "user_first_name", "user_last_name", "role"],
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "Teacher") {
      const teacher = await Teacher.findOne({
        where: { user_id: id },
        transaction,
      });

      if (teacher) {
        const programCount = await Program.count({
          where: { teacher_id: teacher.teacher_id, program_status: "Active" },
          transaction,
        });

        if (programCount > 0) {
          await transaction.rollback();
          return res.status(400).json({
            error: "Cannot delete teacher!",
            details: `${user.user_first_name} ${user.user_last_name} is currently assigned to one or more programs.`,
          });
        }

        await teacher.destroy({ transaction });
      }
    }

    await user.destroy({ transaction });
    await transaction.commit();
    res.json({
      message: `${user.role} "${user.user_first_name} ${user.user_last_name}" deleted successfully.`,
    });
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
};

//----------------------------------------------------------------------------------------//
exports.updateName = async (req, res) => {
  const { id } = req.params;
  const { user_first_name, user_last_name } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update({
      user_first_name,
      user_last_name,
    });

    res.status(200).json({ message: "Name updated successfully." });
  } catch (error) {
    console.error("Error updating name:", error);
    res.status(500).json({ error: "Failed to update name." });
  }
};

//----------------------------------------------------------------------------------------//
exports.updateEmail = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update({
      email,
    });

    res.status(200).json({ message: "Email updated successfully." });
  } catch (error) {
    console.error("Error updating user's name:", error);
    res.status(500).json({ error: "Failed to update user's name." });
  }
};
//----------------------------------------------------------------------------------------//
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find user by ID
    const user = await User.findByPk(id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ error: "Failed to update password.", details: error.message });
  }
};
