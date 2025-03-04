const express = require("express");
const router = express.Router();

const { Instrument } = require("../models");

router.get("/", async (req, res) => {
  const AllInstruments = await Instrument.findAll();
  res.json(AllInstruments);
});

router.get("/count", async (req, res) => {
  const InstrumentCount = await Instrument.count();
  res.json(InstrumentCount);
});

router.post("/", async (req, res) => {
  const instrument = req.body;
  await Instrument.create(instrument);
  res.json(instrument);
});

module.exports = router;
