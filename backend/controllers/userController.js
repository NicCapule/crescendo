const { User, Teacher, Program } = require("../models");
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
      .json({ error: "Error creating Administrator.", details: error.message });
  }
};
//----------------------------------------------------------------------------------------//
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { user_id: id },
      attributes: ["user_id", "user_first_name", "user_last_name", "role"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "Teacher") {
      const teacher = await Teacher.findOne({ where: { user_id: id } });

      if (teacher) {
        const programCount = await Program.count({
          where: { teacher_id: teacher.teacher_id, program_status: "Active" },
        });

        if (programCount > 0) {
          return res.status(400).json({
            error: "Cannot delete teacher",
            details: "Teacher is currently assigned to one or more programs.",
          });
        }

        await teacher.destroy();
      }
    }

    await user.destroy();
    res.json({
      message: `${user.role} "${user.user_first_name} ${user.user_last_name}" deleted successfully.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
};
