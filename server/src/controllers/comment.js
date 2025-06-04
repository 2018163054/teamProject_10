// 초기 댓글 데이터와 ID 자동 증가 변수
let comments = [
  {
    commentId: 1,
    postId: 1,
    author: "user1",
    content: "첫 댓글입니다!",
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
    likes: 0,
  },
];

let nextCommentId = 2;

// 1. 댓글 목록 조회
// endpoint GET /posts/:postId/comments

exports.getCommentsByPost = (req, res) => {
  const { postId } = req.params;

  // 해당 postId에 해당하는 댓글만 필터링
  const postComments = comments.filter((c) => c.postId === parseInt(postId));

  res.status(200).json({
    status: "success",
    data: postComments,
  });
};

// 2. 댓글 작성
// endpoint POST /posts/:postId/comments

exports.addComment = (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  // 필수 항목 누락 시 에러 응답
  if (!author || !content) {
    return res.status(400).json({
      status: "error",
      message: "Author and content are required",
    });
  }

  // 새 댓글 객체 생성
  const newComment = {
    commentId: nextCommentId++,
    postId: parseInt(postId),
    author,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
  };

  // 댓글 배열에 추가
  comments.push(newComment);

  res.status(201).json({
    status: "success",
    message: "Comment created",
    data: newComment,
  });
};

// 3. 댓글 수정
// PUT /comments/:commentId

exports.editComment = (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  // 댓글 ID로 댓글 찾기
  const index = comments.findIndex((c) => c.commentId === parseInt(commentId));

  // 존재하지 않으면 404
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Comment not found",
    });
  }

  // 내용이 비었을 경우 400 에러 반환환
  if (!content) {
    return res.status(400).json({
      status: "error",
      message: "Content is required",
    });
  }

  // 내용과 수정일 갱신
  comments[index].content = content;
  comments[index].updatedAt = new Date().toISOString();

  res.status(200).json({
    status: "success",
    message: "Comment updated",
    data: comments[index],
  });
};

// 4. 댓글 삭제
// DELETE /comments/:commentId

exports.deleteComment = (req, res) => {
  const { commentId } = req.params;

  // 댓글 ID로 인덱스 찾기
  const index = comments.findIndex((c) => c.commentId === parseInt(commentId));

  // 없으면 404 반환
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Comment not found",
    });
  }

  // 삭제 후 반환
  const deletedComment = comments.splice(index, 1)[0];

  res.status(200).json({
    status: "success",
    message: "Comment deleted",
    data: deletedComment,
  });
};

// 5. 댓글 좋아요
// endpoint POST /comments/:commentId/like
exports.likeComment = (req, res) => {
  const { commentId } = req.params;

  // 해당 댓글 찾기
  const comment = comments.find((c) => c.commentId === parseInt(commentId));

  if (!comment) {
    return res.status(404).json({
      status: "error",
      message: "Comment not found",
    });
  }

  // 좋아요 수 1 증가
  comment.likes += 1;

  res.status(200).json({
    status: "success",
    message: "Comment liked",
    data: { commentId: comment.commentId, likes: comment.likes },
  });
};
