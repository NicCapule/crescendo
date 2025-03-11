const { Session, TeacherSalary, Program, User, Teacher } = require("../models");
const { Op, sequelize } = require("sequelize");

const perSessionRate = 400;

const updateExpiredSessions = async () => {
  try {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];
    //-----------------------------------------------------------------------//
    const [updatedCount] = await Session.update(
      { session_status: "Completed" },
      {
        where: {
          session_status: "Scheduled",
          [Op.or]: [
            { session_date: { [Op.lt]: formattedDate } },
            {
              session_date: formattedDate,
              session_end: { [Op.lte]: formattedTime },
            },
          ],
        },
      }
    );
    //-----------------------------------------------------------------------//
    if (updatedCount === 0) {
      console.log("No expired sessions to update.");
      return;
    }
    //-----------------------------------------------------------------------//
    const updatedSessions = await Session.findAll({
      where: {
        session_status: "Completed",
        [Op.or]: [
          { session_date: formattedDate }, // Sessions just marked as completed today
          {
            session_date: { [Op.lt]: formattedDate }, // Past completed sessions
            id: {
              [Op.notIn]: sequelize.literal(
                "(SELECT session_id FROM TeacherSalary)"
              ),
            }, // Exclude sessions already processed in TeacherSalary
          },
        ],
      },
      include: [{ model: Program, attributes: ["teacher_id"] }],
    });
    //-----------------------------------------------------------------------//
    const teacherSessions = {};

    for (const session of updatedSessions) {
      const teacherId = session.Program.teacher_id;
      teacherSessions[teacherId] = (teacherSessions[teacherId] || 0) + 1;
    }

    for (const [teacherId, sessionCount] of Object.entries(teacherSessions)) {
      await updateTeacherSalary(teacherId, formattedDate, sessionCount);
    }
    //-----------------------------------------------------------------------//
    console.log(
      `Updated ${updatedCount} expired sessions and adjusted teacher salaries.`
    );
  } catch (error) {
    console.error("Error updating expired sessions:", error);
  }
};
//==========================================================================================//
const updateTeacherSalary = async (teacher_id, session_date, totalSessions) => {
  try {
    if (totalSessions === 0) return;
    //-----------------------------------------------------------------------//
    const teacher = await Teacher.findByPk(teacher_id, {
      include: [
        { model: User, attributes: ["user_first_name", "user_last_name"] },
      ],
    });
    if (!teacher) return;
    //-----------------------------------------------------------------------//
    const teacherName = `${teacher.User.user_first_name} ${teacher.User.user_last_name}`;
    const amount = totalSessions * perSessionRate;
    //-----------------------------------------------------------------------//
    const [updatedRows] = await TeacherSalary.update(
      { total_sessions: totalSessions, amount },
      { where: { teacher_id, salary_date: session_date } }
    );
    //-----------------------------------------------------------------------//
    if (updatedRows === 0) {
      await TeacherSalary.create({
        teacher_id,
        salary_date: session_date,
        teacher_name: teacherName,
        total_sessions: totalSessions,
        amount,
      });
      console.log(
        `Created new salary record for ${teacherName} on ${session_date}`
      );
    } else {
      console.log(
        `Updated salary record for ${teacherName} on ${session_date}`
      );
    }
  } catch (error) {
    console.error("Error updating teacher salary:", error);
  }
};
//-----------------------------------------------------------------------//
module.exports = { updateExpiredSessions };
