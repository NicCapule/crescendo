const { Op } = require("sequelize");
const { Student, StudentPayment } = require("../models");
const sendEmail = require("../services/emailService");


  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  try {
    const upcomingPayments = await StudentPayment.findAll({
      where: {
        student_payment_date: {
          [Op.between]: [today, nextWeek],
        },
      },
      include: [{ model: Student }],
    });

    if (upcomingPayments.length === 0) {
      console.log("No upcoming payments found. No emails to send.");
      return;
    }

    for (const payment of upcomingPayments) {
      const email = payment.Student?.student_email;
      if (email) {
        const dueDate = new Date(payment.student_payment_date).toLocaleDateString();
        const subject = "Payment Reminder";
        const text = `Dear ${payment.Student.student_first_name}, your payment of ${payment.amount_paid} is due on ${dueDate}. Please ensure timely payment.`;

        console.log(`Sending email to: ${email}`);
        try {
          await sendEmail(email, subject, text);
        } catch (error) {
          console.error(`Error sending email to ${email}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching payments:", error);
  };

module.exports = checkAndSendReminders;
