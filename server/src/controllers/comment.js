//예시
let comments = [
  {
    commentId: 1,
    postId: 1,
    author: "commenter1",
    content: "정말 도움이 되네요!",
    createdAt: "2025-05-31T15:30:00Z",
    updatedAt: "2025-05-31T15:30:00Z"
  },
  {
    commentId: 2,
    postId: 1,
    author: "commenter2",
    content: "사진 더 올려주세요!",
    createdAt: "2025-05-31T16:00:00Z",
    updatedAt: "2025-05-31T16:00:00Z"
  }
];

let nextCommentId = 3;

// GET 
exports.getCommentsByPost = (req, res) => {
  const { postId } = req.params;
  const postComments = comments.filter(c => c.postId === parseInt(postId));
  
  res.status(200).json({
    status: "success",
    data: postComments
  });
};


// POST 
exports.addComment = (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  
  if (!author || !content) {
    return res.status(400).json({
      status: "error",
      message: "Author and content are required"
    });
  }

  const newComment = {
    commentId: nextCommentId++,
    postId: parseInt(postId),
    author,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  comments.push(newComment);

  res.status(201).json({
    status: "success",
    message: "Comment created",
    data: newComment
  });
};

// PUT 
exports.editComment = (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const index = comments.findIndex(c => c.commentId === parseInt(commentId));

  if (index === -1) {
    return res.status(404).json({ 
      status: "error", 
      message: "Comment not found" 
    });
  }

  if (!content) {
    return res.status(400).json({
      status: "error",
      message: "Content is required"
    });
  }

  comments[index] = {
    ...comments[index],
    content,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    status: "success",
    message: "Comment updated",
    data: comments[index]
  });
};

// DELETE 
exports.deleteComment = (req, res) => {
  const { commentId } = req.params;
  const index = comments.findIndex(c => c.commentId === parseInt(commentId));

  if (index === -1) {
    return res.status(404).json({ 
      status: "error", 
      message: "Comment not found" 
    });
  }

  const deletedComment = comments.splice(index, 1)[0];

  res.status(200).json({
    status: "success",
    message: "Comment deleted",
    data: deletedComment
  });
};