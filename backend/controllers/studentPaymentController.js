const { where } = require("sequelize");
const {
  Sequelize,
  Enrollment,
  StudentPayment,
  Student,
  Program,
  Teacher,
  Instrument,
  User,
  Session,
} = require("../models");
//----------------------------------------------------------------------------------------//
exports.getPaymentsByStudentId = async (req, res) => {
  try {
    const { id } = req.params;
    const studentPayments = await StudentPayment.findAll({
      include: [
        {
          model: Enrollment,
          attributes: [],
          where: { student_id: id },
        },
      ],
      attributes: [
        "student_name",
        "amount_paid",
        "payment_method",
        "student_payment_date",
      ],
    });
    res.json(studentPayments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching student's payment history", error });
  }
};
//----------------------------------------------------------------------------------------//
exports.getPendingPayments = async (req, res) => {
  try {
    const pendingPayments = await Enrollment.findAll({
      where: { payment_status: "Unsettled" },
      attributes: [
        "enrollment_id",
        "total_fee",
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("SUM", Sequelize.col("StudentPayments.amount_paid")),
            0
          ),
          "total_paid",
        ],
        [
          Sequelize.literal(
            "total_fee - COALESCE(SUM(StudentPayments.amount_paid), 0)"
          ),
          "remaining_balance",
        ],
        [
          Sequelize.literal(`(
            SELECT session_date 
            FROM Session 
            WHERE Session.program_id = Program.program_id 
            ORDER BY session_date ASC
            LIMIT 1 OFFSET 3
          )`),
          "due_date",
        ],
      ],
      include: [
        {
          model: Student,
          attributes: ["student_first_name", "student_last_name"],
        },
        {
          model: StudentPayment,
          attributes: [],
        },
        {
          model: Program,
          where: { program_status: "Active" },
          attributes: ["program_id", "no_of_sessions"],
          include: [
            { model: Instrument, attributes: ["instrument_name"] },
            {
              model: Teacher,
              attributes: ["teacher_id"],
              include: [
                {
                  model: User,
                  attributes: ["user_first_name", "user_last_name"],
                },
              ],
            },
          ],
        },
      ],
      group: [
        "Enrollment.enrollment_id",
        "Enrollment.total_fee",
        "Enrollment.payment_status",
        "Program.program_id",
      ],
      having: Sequelize.literal("remaining_balance > 0"),
    });
    res.json(pendingPayments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending payments", error });
  }
};
//----------------------------------------------------------------------------------------//
exports.addPayment = async (req, res) => {
  try {
    const { enrollment_id, amount_paid, payment_method } = req.body;

    const enrollment = await Enrollment.findByPk(enrollment_id);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const newPayment = await StudentPayment.create({
      enrollment_id,
      amount_paid,
      payment_method,
    });

    const totalPaid = await StudentPayment.sum("amount_paid", {
      where: { enrollment_id },
    });
    newStatus = "Unsettled";
    if (totalPaid >= enrollment.total_fee) {
      newStatus = "Settled";
    }

    await Enrollment.update(
      { payment_status: newStatus },
      { where: { enrollment_id: enrollment_id } }
    );
    res
      .status(201)
      .json({ message: "Payment recorded", newPayment, newStatus });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ error: "Failed to process payment." });
  }
};
