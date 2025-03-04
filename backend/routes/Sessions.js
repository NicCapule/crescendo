const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");

router.get("/", sessionController.getAllSessions);

// router.post("/", async (req, res) => {
//   const session = req.body;
//   await Session.create(session);
//   res.json(session);
// });

module.exports = router;
