const express = require("express");
const router = express.Router();

const { Student } = require("../models");

router.get("/", async (req, res) => {
  const AllStudents = await Student.findAll();
  res.json(AllStudents);
});

router.post("/", async (req, res) => {
  const student = req.body;
  await Student.create(student);
  res.json(student);
});

module.exports = router;
