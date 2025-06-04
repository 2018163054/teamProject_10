const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

router.get("/:postId", postController.getPosts);

router.post("/:postId", postController.addPosts);

router.put("/:postId", postController.editPosts);

module.exports = router;
