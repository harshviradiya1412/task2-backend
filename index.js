const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = 8000;
const studentApi = require("./Api/StudentApi");

mongoose
  .connect("mongodb://127.0.0.1:27017/nijweb")
  .then(() => console.log("connection successfully"))
  .catch((e) => e.message);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/student", studentApi);

app.listen(port, () => {
  console.log("server running on", port);
});
