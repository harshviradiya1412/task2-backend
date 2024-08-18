const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  course: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  hobbies: {
    type: [String],
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model("student", studentSchema, "student");
