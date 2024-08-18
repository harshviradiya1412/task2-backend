const express = require("express");
const route = express.Router();
const student = require("../Model/StudentModel");

route.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, course, gender, hobbies, password } = req.body;
    if (
      !name ||
      !email ||
      !mobile ||
      !course ||
      !gender ||
      !hobbies ||
      !password
    ) {
      throw new Error("All Field Required");
    }
    const newStudent = new student({
      name,
      email,
      mobile,
      course,
      gender,
      hobbies,
      password,
    });
    await newStudent.save();
    return res.status(201).json({
      message: "Registration SuccessFully",
      data: newStudent,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or mobile number already exists",
      });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("please enter email and password");
    }
    const existUser = await student
      .findOne({ email: req.body.email })
      .select("+password");

    if (!existUser) {
      throw new Error("User not Found");
    }
    if (existUser.password !== req.body.password) {
      throw new Error("Password is Wrong");
    }
    return res.status(200).json({
      message: "Login SuccessFully",
      data: existUser,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
});

route.patch("/update/:id", async (req, res) => {
  try {
    const updateUser = await student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "Update SuccessFully",
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

route.delete("/delete/:id", async (req, res) => {
  try {
    const deleteUser = await student.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Delete SuccessFully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

route.get("/find/:id", async (req, res) => {
  try {
    const findUser = await student.findById(req.params.id);
    return res.status(200).json({
      message: "Record find SuccessFully",
      data: findUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

route.get("/get", async (req, res) => {
  try {
    const { query } = await filterStudent(req.query);
    const allStudent = await student.find(query);
    if (allStudent.length === 0) {
      throw new Error("No Record Found");
    }
    return res.status(200).json({
      message: "student find SuccessFully",
      data: allStudent,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

const filterStudent = async (data) => {
  let query = {};
  for (let [key, val] of Object.entries(data)) {
    if (
      key === "email" ||
      key === "name" ||
      key === "gender" ||
      key === "course"
    ) {
      query[key] = { $regex: new RegExp(val, "gi") };
    } else if (key === "search") {
      query.$or = [
        { name: { $regex: val, $options: "i" } },
        { email: { $regex: val, $options: "i" } },
        { course: { $regex: val, $options: "i" } },
        { gender: { $regex: val, $options: "i" } },
      ];
    }
  }
  return { query };
};

module.exports = route;
