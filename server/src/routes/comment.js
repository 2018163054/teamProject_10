const express = require("express");
const router = express.Router();
const controller = require("../controllers/comment");

// 댓글 목록 & 작성
router.get("/posts/:postId/comments", controller.getCommentsByPost);
router.post("/posts/:postId/comments", controller.addComment);

// 수정, 삭제, 좋아요
router.put("/comments/:commentId", controller.editComment);
router.delete("/comments/:commentId", controller.deleteComment);
router.post("/comments/:commentId/like", controller.likeComment);

module.exports = router;
