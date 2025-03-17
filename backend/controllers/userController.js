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
      .json({ error: "Error creating Administrator.", details: error.message });
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
