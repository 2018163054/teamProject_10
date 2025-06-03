const express = require("express");
const cors = require("cors");

const app = express();
const postRoutes = require("./src/routes/post");
const commentRoutes = require("./src/routes/comment");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", postRoutes);

app.use("/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
