const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/table", userController.getUserTable);
router.post("/", userController.createAdmin);
router.delete("/:id", userController.deleteUser);
router.patch("/:id/update/name", userController.updateName);
router.patch("/:id/update/email", userController.updateEmail);
router.patch("/:id/update/password", userController.changePassword);

module.exports = router;
