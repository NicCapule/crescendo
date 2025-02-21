const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

//============================================================ Routers
const userRouter = require("./routes/Users");
app.use("/users", userRouter);

const studentRouter = require("./routes/Students");
app.use("/students", studentRouter);

const teacherRouter = require("./routes/Teachers");
app.use("/teachers", teacherRouter);

const sessionRouter = require("./routes/Sessions");
app.use("/sessions", sessionRouter);

//============================================================//
// db.sequelize.sync().then(() => {
//   app.listen(3001, () => {
//     console.log("Server Running on PORT 3001!");
//   });
// });

app.listen(3001, () => {
  console.log("Server Running on PORT 3001!");
});
