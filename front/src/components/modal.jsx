import React, { useState } from "react";
import { uploadToFirebase } from "../util/firebase";
import { v4 as uuidv4 } from "uuid";

const handlePostBarrier = async (postId, postData) => {
  try {
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) throw new Error("업로드 실패");
    const result = await response.json();
    alert("성공적으로 업로드되었습니다.");
    return result.data;
  } catch (err) {
    console.error(err);
    alert("서버 오류 발생");
    return null;
  }
};

export default function BarrierPostModal({
  visible,
  onClose,
  place,
  userInfo,
  setIsLoading,
}) {
  const [rampFiles, setRampFiles] = useState([]);
  const [elevatorFiles, setElevatorFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [rampAvailable, setRampAvailable] = useState(true);
  const [elevatorAvailable, setElevatorAvailable] = useState(true);
  const [tags, setTags] = useState("");

  const handleRampChange = (e) => setRampFiles(Array.from(e.target.files));
  const handleElevatorChange = (e) =>
    setElevatorFiles(Array.from(e.target.files));

  const handleSubmit = async () => {
    setIsUploading(true);
    setIsLoading(true);

    try {
      const rampPhotoUrls = await Promise.all(
        rampFiles.map((file) => uploadToFirebase(file, "ramp"))
      );
      const elevatorPhotoUrls = await Promise.all(
        elevatorFiles.map((file) => uploadToFirebase(file, "elevator"))
      );
      const newId = uuidv4();

      const postData = {
        id: newId,
        author: userInfo?.nickname || "익명",
        createdAt: new Date().toISOString(),
        locationId: place?.id || "building001",
        rampAvailable,
        elevatorAvailable,
        rampPhotoUrls,
        elevatorPhotoUrls,
        tags: tags.split(",").map((tag) => tag.trim()),
      };

      await handlePostBarrier(place.id, postData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("업로드 중 오류 발생");
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border-blue-500 border-4 w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">건물 정보 등록하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600">
          건물 내 휠체어 이용자를 위한 경사로 사진 혹은 승강기 운행 정보를
          등록해주세요.
        </p>

        <div className="space-y-2">
          <label className="font-semibold">주변 경사로 정보 수정</label>
          <div className="flex space-x-2">
            <button
              className={`flex-1 py-2 rounded ${
                rampAvailable ? "bg-yellow-400 font-bold" : "bg-gray-200"
              }`}
              onClick={() => setRampAvailable(true)}
            >
              사용 가능
            </button>
            <button
              className={`flex-1 py-2 rounded ${
                !rampAvailable ? "bg-yellow-400 font-bold" : "bg-gray-200"
              }`}
              onClick={() => setRampAvailable(false)}
            >
              사용 불가
            </button>
          </div>
          <label className="block text-sm text-gray-600 mt-2">
            Upload photo
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleRampChange}
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold">승강기 운행 정보 수정</label>
          <div className="flex space-x-2">
            <button
              className={`flex-1 py-2 rounded ${
                elevatorAvailable ? "bg-yellow-400 font-bold" : "bg-gray-200"
              }`}
              onClick={() => setElevatorAvailable(true)}
            >
              사용 가능
            </button>
            <button
              className={`flex-1 py-2 rounded ${
                !elevatorAvailable ? "bg-yellow-400 font-bold" : "bg-gray-200"
              }`}
              onClick={() => setElevatorAvailable(false)}
            >
              사용 불가
            </button>
          </div>
          <label className="block text-sm text-gray-600 mt-2">
            Upload photo
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleElevatorChange}
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold">태그 등록</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="#장애인화장실, #경사로"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded mr-2"
            disabled={isUploading}
          >
            {isUploading ? "제출 중..." : "제출하기"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded"
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}
