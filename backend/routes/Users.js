const express = require("express");
const router = express.Router();

const { User } = require("../models");

router.get("/", async (req, res) => {
  const listOfUsers = await User.findAll();
  res.json(listOfUsers);
});

router.post("/", async (req, res) => {
  const user = req.body;
  await User.create(user);
  res.json(user);
});

module.exports = router;
