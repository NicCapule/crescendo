const express = require("express");
const router = express.Router();

const { Program } = require("../models");

router.get("/", async (req, res) => {
  const AllPrograms = await Program.findAll();
  res.json(AllPrograms);
});

router.get("/count", async (req, res) => {
  const ProgramCount = await Program.count();
  res.json(ProgramCount);
});

router.post("/", async (req, res) => {
  const program = req.body;
  await Program.create(program);
  res.json(program);
});

module.exports = router;
