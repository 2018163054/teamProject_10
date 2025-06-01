const express = require("express");
const router = express.Router();
const userController = require("../controllers/post");

router.get("/:postId", userController.getPosts);

router.post("/:postId", userController.addPosts);

router.put("/:postId", userController.editPosts);

module.exports = router;
