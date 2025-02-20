const express = require("express");
const router = express.Router();

const { Session, Student, Program, Teacher, Instrument } = require("../models");

router.get("/", async (req, res) => {
  const AllSession = await Session.findAll({
    include: [
      Student,
      {
        model: Program,
        include: [
          {
            model: Teacher,
          },
          {
            model: Instrument,
          },
        ],
      },
    ],
  });
  res.json(AllSession);
});

router.post("/", async (req, res) => {
  const session = req.body;
  await Session.create(session);
  res.json(session);
});

module.exports = router;
