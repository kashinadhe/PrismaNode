const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/post", postRoute);

app.listen(3000, () => {
  console.log("Server Started");
});
