const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { post } = new PrismaClient();
const { user } = new PrismaClient();

router.post("/", async (req, res, next) => {
  const { title, user_id } = req.body;
  const post1 = req.body.post;
  const userExists = await user.findUnique({
    where: {
      id: user_id,
    },
  });
  if (userExists) {
    const newPost = await post.create({
      data: {
        user_id: user_id,
        title: title,
        post: post1,
      },
    });
    res.json(newPost);
  } else {
    res.json({
      message: "Username does not exists",
    });
  }
});
module.exports = router;
