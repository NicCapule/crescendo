const express = require("express");
const router = express.Router();

const { Teacher, User, Instrument } = require("../models");

router.get("/", async (req, res) => {
  const AllTeachers = await Teacher.findAll({
    include: [User, Instrument],
  });
  res.json(AllTeachers);
});

router.post("/", async (req, res) => {
  const teacher = req.body;
  await Teacher.create(teacher);
  res.json(teacher);
});

module.exports = router;
