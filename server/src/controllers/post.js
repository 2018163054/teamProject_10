// 예시
let posts = [
  {
    id: 1,
    postId: 1,
    author: "tester",
    createdAt: "2025-05-31T14:20:00Z",
    locationId: "location001",
    rampAvailable: true,
    elevatorAvailable: false,
    rampPhotoUrls: ["https://example.com/images/ramp045_1.jpg"],
    elevatorPhotoUrls: ["https://example.com/images/ramp045_1.jpg"],
    tags: ["장애인화장실", "경사로"],
  },
  {
    id: 2,
    postId: 2,
    author: "user2",
    createdAt: "2025-05-31T14:21:00Z",
    locationId: "location001",
    rampAvailable: true,
    elevatorAvailable: false,
    rampPhotoUrls: [],
    elevatorPhotoUrls: [],
    tags: [],
  },
];

// GET
exports.getPosts = (req, res) => {
  const { postId } = req.params;

  // postId가 같은 모든 포스트를 배열로 필터링
  const matchedPosts = posts.filter((p) => p.postId === parseInt(postId));

  if (matchedPosts.length === 0) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  res.status(200).json({ status: "success", data: matchedPosts });
};

exports.addPosts = (req, res) => {
  try {
    const { postId } = req.params;
    const {
      id,
      author,
      createdAt,
      locationId,
      rampAvailable,
      elevatorAvailable,
      rampPhotoUrls,
      elevatorPhotoUrls,
      tags,
    } = req.body;

    if (!author || !createdAt || !locationId) {
      console.error("❌ 필수 필드 누락:", req.body);
      return res.status(400).json({
        status: "error",
        message: "필수 필드(author, createdAt, locationId)가 누락되었습니다.",
      });
    }

    const newPost = {
      id,
      postId: parseInt(postId),
      author,
      createdAt,
      locationId,
      rampAvailable: rampAvailable === "true" || rampAvailable === true,
      elevatorAvailable:
        elevatorAvailable === "true" || elevatorAvailable === true,
      rampPhotoUrls: Array.isArray(rampPhotoUrls) ? rampPhotoUrls : [],
      elevatorPhotoUrls: Array.isArray(elevatorPhotoUrls)
        ? elevatorPhotoUrls
        : [],
      tags: Array.isArray(tags) ? tags : [],
    };

    posts.push(newPost);

    console.log("✅ 새 게시글 등록:", newPost);

    res.status(201).json({
      status: "success",
      message: "Post created",
      data: newPost,
    });
  } catch (err) {
    console.error("🔴 게시글 등록 중 서버 오류:", err);
    res.status(500).json({
      status: "error",
      message: "서버 내부 오류",
      error: err.message,
    });
  }
};

//PUT
exports.editPosts = (req, res) => {
  const { postId } = req.params;
  const index = posts.findIndex((p) => p.postId === parseInt(postId));

  if (index === -1) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  posts[index] = {
    ...posts[index],
    ...req.body,
  };

  res.status(200).json({
    status: "success",
    message: "Post updated",
    data: posts[index],
  });
};
