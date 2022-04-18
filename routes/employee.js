const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { Employees } = new PrismaClient();

const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const helper = require("./helper");
const htmltemplate = require("../public/stylesheets/Template");
const { validateMobile } = require("../controllers/validation");

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

exports.employeesGetAll = async (req, res, next) => {
  const employees = await Employees.findMany({
    select: {
      id: true,
      employeeName: true,
      employeeMobile: true,
      employeeEmail: true,
      employeeCity: true,
      employeeType: true,
      employeeAdminId: true,
      employeeDOB: true,
      employeeAddress: true,
      employeeAadharNumber: true,
      employeePanNumber: true,
      employeeMaritalStatus: true,
      employeeDocumentStatus: true,
      employeeCreatedAt: true,
    },
  });
  res.status(200).json({
    message: "User Details",
    count: employees.length,
    employee: employees.map((doc) => {
      return {
        id: doc.id,
        employeeName: doc.employeeName,
        employeeType: doc.employeeType,
        employeeMobile: doc.employeeMobile,
        employeeEmail: doc.employeeEmail,
        employeeAdminId: doc.employeeAdminId,
        employeeCity: doc.employeeCity,
        employeeDOB: doc.employeeDOB,
        employeeAddress: doc.employeeAddress,
        employeeAadharNumber: doc.employeeAadharNumber,
        employeePanNumber: doc.employeePanNumber,
        employeeMaritalStatus: doc.employeeMaritalStatus,
        employeeDocumentStatus: doc.employeeDocumentStatus,
        employeeCreatedAt: doc.employeeCreatedAt,
      };
    }),
  });
};

exports.employeesCreateEmployee = async (req, res, next) => {
  const emPloyeeId = req.userData.userId;
  const role = req.userData.Role;
  const adminName = await helper.getNameFromID(emPloyeeId);
  const { employeeName, employeeMobile, employeeCity, employeeEmail } =
    req.body;
  if (employeeMobile !== undefined && !validateMobile(employeeMobile)) {
    return res.status(404).json({
      message: "Mobile number is invaid",
    });
  }

  const employee = await Employees.findMany({
    where: {
      employeeEmail: req.body.employeeEmail,
    },
  });
  if (employee.length >= 1) {
    return res.status(404).json({
      message: "Mail Exist",
    });
  } else {
    bcrypt.hash("Welcome@123", 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: "Please Fill The Details Properly",
        });
      } else {
        var adminId, hrId, managerId;
        if (role === "Admin") {
          adminId = emPloyeeId;
        } else if (role === "HR") {
          hrId = emPloyeeId;
        } else {
          managerId = emPloyeeId;
        }
        const emp = await Employees.create({
          data: {
            admins: adminId,
            managers: managerId,
            hrs: hrId,
            employeeName: employeeName,
            employeeType: "Employee",
            employeeEmail: employeeEmail,
            employeeMobile: employeeMobile,
            employeeCity: employeeCity,
            employeeAdminId: emPloyeeId,
            employeeadminName: adminName,
            employeePassword: hash,
            employeeCreatedAt: Date.now(),
          },
        });
        const NewemPloyeeId = await helper.getIdFromemail(
          req.body.employeeEmail
        );
        const pushInToArray = helper.pushInToArray(NewemPloyeeId, emPloyeeId);
        console.log(NewemPloyeeId);
        console.log(emp);
        const data = "hello sumeet";
        let mess = htmltemplate.add_employee_credentials(emp.employeeEmail);
        try {
          const mailSent = await helper.sendmail(
            mess,
            '"Flourisensewebsite" <test@flourisense.tech>',
            "Login Credentials",
            emp.employeeEmail
          );
          if (mailSent) {
            console.log("Email Sent");
          } else {
            console.log("Email Not Sent");
          }
          console.log("Message sent: %s", mailSent);
        } catch (error) {
          console.log(error);
        }
        res.status(201).json({
          message: "Created employee successfully",
          createdEmployee: {
            id: emp.id,
            employeeName: emp.employeeName,
            employeeType: emp.employeeType,
            employeeEmail: emp.employeeEmail,
            employeeMobile: emp.employeeMobile,
            employeeCity: emp.employeeCity,
            employeeAdminId: emp.employeeAdminId,
            employeePassword: emp.employeePassword,
            employeeCreatedAt: emp.employeeCreatedAt,
          },
        });
      }
    });
  }
};

exports.employeesGetById = async (req, res, next) => {
  const id = req.params.Id;
  const emp = await Employees.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      employeeName: true,
      employeeMobile: true,
      employeeEmail: true,
      employeeCity: true,
      employeeType: true,
      employeeAdminId: true,
      employeeDOB: true,
      employeeAddress: true,
      employeeAadharNumber: true,
      employeePanNumber: true,
      employeeMaritalStatus: true,
      employeeDocumentStatus: true,
      employeeCreatedAt: true,
    },
  });
  if (emp) {
    res.status(200).json({
      emp: emp,
      message: "User Details",
    });
  } else {
    res.status(404).json({ message: "NO valid entry for provided ID" });
  }
};

exports.employeesPatch = async (req, res, next) => {
  const id = req.params.Id;
  const {
    employeeName,
    employeeCity,
    employeeEmail,
    employeeMobile,
    employeeType,
  } = req.body;
  console.log(id);
  const updateEmployeeDetails = await Employees.update({
    where: {
      id: id,
    },
    data: {
      employeeType: employeeType,
      employeeName: employeeName,
      employeeCity: employeeCity,
      employeeEmail: employeeEmail,
      employeeMobile: employeeMobile,
    },
  });
};

exports.employeesDelete = async (req, res, next) => {
  const id = req.params.id;
  const deleteEmployee = await Employees.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    message: "Employee deleted",
  });
};
