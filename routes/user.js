const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { user } = new PrismaClient();

router.get("/", async (req, res, next) => {
  const users = await user.findMany({
    select: {
      username: true,
      posts: true,
    },
    where: {
      username: "kaustubhadhe",
    },
  });
  res.status(200).json(users);
});

router.post("/", async (req, res, next) => {
  const username = req.body.username;
  /*Checking whether the username exists*/
  const user1 = await user.findUnique({
    select: {
      id: true,
      username: true,
    },
    where: {
      username: username,
    },
  });
  if (user1) {
    res.json({
      message: "Username already exists",
    });
  } else {
    /*If username does not exists*/
    const newUser = await user.create({
      data: {
        username: username,
      },
    });
    res.json(newUser);
  }
});

module.exports = router;
