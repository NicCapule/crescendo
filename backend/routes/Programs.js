const express = require("express");
const router = express.Router();

const programController = require("../controllers/programController");

router.get("/", programController.getAllPrograms);
router.get("/active/count", programController.getActiveProgramCount);
router.patch("/forfeit/:id", programController.forfeitProgram);

module.exports = router;
