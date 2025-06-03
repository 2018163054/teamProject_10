const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");

// Get all comments for a specific post
router.get("/posts/:postId/comments", commentController.getCommentsByPost);

// Create a new comment for a post
router.post("/posts/:postId/comments", commentController.addComment);

// Update a comment
router.put("/:commentId", commentController.editComment);

// Delete a comment
router.delete("/:commentId", commentController.deleteComment);

module.exports = router;