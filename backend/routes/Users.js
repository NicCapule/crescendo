const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/table", userController.getUserTable);
router.post("/", userController.createAdmin);
router.delete("/:id", userController.deleteUser);

module.exports = router;
