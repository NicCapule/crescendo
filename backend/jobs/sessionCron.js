const { Session, TeacherSalary, Program, User, Teacher } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../models");

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
          { session_date: formattedDate },
          {
            session_date: { [Op.lt]: formattedDate },
            "$Program.teacher_id$": {
              [Op.notIn]: sequelize.literal(
                `(SELECT teacher_id FROM TeacherSalary WHERE TeacherSalary.salary_date = Session.session_date)`
              ),
            },
          },
        ],
      },
      include: [{ model: Program, attributes: ["teacher_id"] }],
    });
    const teacherSessions = {};
    //-----------------------------------------------------------------------//
    for (const session of updatedSessions) {
      const teacherId = session.Program?.teacher_id ?? null;
      const sessionDate = session.session_date;

      if (!teacherSessions[teacherId]) {
        teacherSessions[teacherId] = {};
      }

      teacherSessions[teacherId][sessionDate] =
        (teacherSessions[teacherId][sessionDate] || 0) + 1;
    }

    for (const [teacherId, sessions] of Object.entries(teacherSessions)) {
      for (const [sessionDate, sessionCount] of Object.entries(sessions)) {
        await updateTeacherSalary(teacherId, sessionDate, sessionCount);
      }
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
