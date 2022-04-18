const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { Employees, Leave } = new PrismaClient();

const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const helper = require("./helper");
const htmltemplate = require("../public/stylesheets/Template");
const { validateMobile } = require("../controllers/validation");

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

exports.pushInToArray = async (newEmployeeId, employeeId) => {
  const employee = await Employees.update({
    where: {
      id: employeeId,
    },
    data: {},
  });
};
