const { Op } = require("sequelize");
const { Student, StudentPayment } = require("../models");
const sendEmail = require("../jobs/emailService");

const checkAndSendReminders = async () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);

  try {
    const upcomingPayments = await StudentPayment.findAll({
      where: {
        student_payment_date: {
          [Op.in]: [nextWeek, nextDay],
        },
      },
      include: [{ model: Student }],
    });

    for (const payment of upcomingPayments) {
      const email = payment.Student?.student_email;
      if (email) {
        const subject = "Payment Reminder";
        const text = `Dear ${payment.Student.student_first_name}, your payment of ${payment.amount_paid} is due on ${payment.student_payment_date}. Please ensure timely payment.`;

        await sendEmail(email, subject, text);
      }
    }
  } catch (error) {
    console.error("Error fetching payments:", error);
  }
};

module.exports = checkAndSendReminders;
