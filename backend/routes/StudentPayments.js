const express = require("express");
const router = express.Router();

const studentPaymentController = require("../controllers/studentPaymentController");

// Student Payment Routes
router.get(
  "/payment-history/:id",
  studentPaymentController.getPaymentsByStudentId
);
router.get("/pending-payments", studentPaymentController.getPendingPayments);
router.post("/", studentPaymentController.addPayment);

module.exports = router;
