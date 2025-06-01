// 예시
let posts = [
  {
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
  const post = posts.find((p) => p.postId === parseInt(postId));

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  res.status(200).json({ status: "success", data: post });
};

// POST
exports.addPosts = (req, res) => {
  const { postId } = req.params;
  const {
    author,
    createdAt,
    locationId,
    rampAvailable,
    elevatorAvailable,
    rampPhotoUrls,
    elevatorPhotoUrls,
    tags,
  } = req.body;

  const newPost = {
    postId: parseInt(postId),
    author,
    createdAt,
    locationId,
    rampAvailable,
    elevatorAvailable,
    rampPhotoUrls,
    elevatorPhotoUrls,
    tags,
  };

  posts.push(newPost);

  res.status(201).json({
    status: "success",
    message: "Post created",
    data: newPost,
  });
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
