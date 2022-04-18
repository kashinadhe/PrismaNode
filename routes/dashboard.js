const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { Employees, Attendance, Leave } = new PrismaClient();

exports.displayNewEmployees = async (req, res, next) => {
  const employees = await Employees.findMany({
    orderBy: {
      id: "desc",
    },
    take: 10,
  });
  const result = {
    newEmployees: employees.map((doc) => {
      return {
        id: doc.id,
        employeeName: doc.employeeName,
        employeeDOB: doc.employeeDOB,
      };
    }),
  };
  res.status(200).json(result);
};

exports.displayCurrentPunchedIn = async (req, res, next) => {
  const attendance = await Attendance.findMany({
    where: {
      employeeIn: Date.now(),
      employeeStatus: false,
    },
  });
  const result = {
    punchInToday: attendance.length,
  };
  res.status(200).json(result);
};

exports.displayLeaves = async (req, res, next) => {
  const leaves = await Leave.findMany({
    where: {
      leaveFromDate: {
        lt: new Date(),
      },
      leaveToDate: {
        gt: new Date(),
      },
    },
  });
  const result = {
    numberEmployeesOnLeave: leaves.length,
    employeeDetails: leaves.map((doc) => {
      return {
        employeeName: doc.employeeName,
        leaveFromDate: doc.leaveFromDate,
        leaveToDate: doc.leaveToDate,
      };
    }),
  };
  res.status(200).json(result);
};
