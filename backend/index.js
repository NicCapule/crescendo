const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const {
  authenticateUser,
  authorizeRole,
} = require("./middlewares/authMiddleware");

const db = require("./models");

//============================================================ Routers
const loginRouter = require("./routes/Login");
app.use("/login", loginRouter);
//--------------------------------------------------//
const userRouter = require("./routes/Users");
app.use(
  "/users",
  authenticateUser,
  authorizeRole(["Admin", "Teacher"]),
  userRouter
);
//--------------------------------------------------//
const studentRouter = require("./routes/Students");
app.use(
  "/students",
  authenticateUser,
  authorizeRole(["Admin", "Teacher"]),
  studentRouter
);
//--------------------------------------------------//
const teacherRouter = require("./routes/Teachers");
app.use("/teachers", authenticateUser, teacherRouter);
//--------------------------------------------------//
const sessionRouter = require("./routes/Sessions");
app.use(
  "/sessions",
  authenticateUser,
  authorizeRole(["Admin", "Teacher"]),
  sessionRouter
);
//--------------------------------------------------//
const programRouter = require("./routes/Programs");
app.use(
  "/programs",
  authenticateUser,
  authorizeRole(["Admin", "Teacher"]),
  programRouter
);
//--------------------------------------------------//
const instrumentRouter = require("./routes/Instruments");
app.use(
  "/instruments",
  authenticateUser,
  authorizeRole(["Admin", "Teacher"]),
  instrumentRouter
);
//--------------------------------------------------//
const enrollmentRouter = require("./routes/Enrollment");
app.use(
  "/enroll",
  authenticateUser,
  authorizeRole(["Admin"]),
  enrollmentRouter
);
//--------------------------------------------------//
const studentPaymentRouter = require("./routes/StudentPayments");
app.use(
  "/payments",
  authenticateUser,
  authorizeRole(["Admin"]),
  studentPaymentRouter
);

//============================================================//
db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server Running on PORT 3001!");
  });
});

// app.listen(3001, () => {
//   console.log("Server Running on PORT 3001!");
// });
