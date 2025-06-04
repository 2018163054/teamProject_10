import { useEffect, useState, useRef } from "react";
import Modal from "./modal";
import BarrierPostModal from "./modal";

export default function BarrierFreeMap({ isLoggedIn, userInfo }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infowindowRef = useRef(null);

  const [keyword, setKeyword] = useState("");
  const [placesList, setPlacesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [barrierData, setBarrierData] = useState([]);
  const [placeInfo, setPlaceInfo] = useState();
  const [commentsData, setCommentsData] = useState([]);

  const PAGE_SIZE = 3;
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const visiblePlaces = placesList.slice(startIdx, startIdx + PAGE_SIZE);
  const totalPages = Math.ceil(placesList.length / PAGE_SIZE);
  const [showModal, setShowModal] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const moveToCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const locPosition = new kakao.maps.LatLng(lat, lng);
        const message = "<div style='padding:5px;'>현재 위치</div>";

        // 마커 + 인포윈도우 설정
        const marker = new kakao.maps.Marker({
          map: mapRef.current,
          position: locPosition,
        });

        const infowindow = new kakao.maps.InfoWindow({
          content: message,
        });
        infowindow.open(mapRef.current, marker);

        mapRef.current.setCenter(locPosition);
      },
      (error) => {
        console.error(error);
        alert("위치 정보를 가져오지 못했습니다.");
      }
    );
  };

  useEffect(() => {
    const container = document.getElementById("map");
    const kakaoMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3,
    });

    mapRef.current = kakaoMap;
    infowindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
  }, []);

  const searchPlaces = () => {
    if (!keyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
        setPlacesList(data);
        setCurrentPage(1); // pagination
      } else {
        alert("검색 실패 또는 결과 없음");
      }
    });
  };

  const displayPlaces = (places) => {
    const bounds = new kakao.maps.LatLngBounds();
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    places.forEach((place) => {
      const position = new kakao.maps.LatLng(place.y, place.x);
      const marker = new kakao.maps.Marker({ map: mapRef.current, position });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    mapRef.current.setBounds(bounds);
  };

  const handleGetBarrier = async (placeId) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${placeId}`);
      if (!response.ok) throw new Error("배리어 정보 요청 실패");

      const result = await response.json();
      console.log(result);
      setBarrierData([...result.data]);
    } catch (err) {
      console.error("Fetch error:", err);
      setBarrierData([]);
    }
  };

  const handleModal = () => {
    if (!isLoggedIn) {
      alert("로그인을 먼저 해야합니다.");
      return;
    }
    setShowModal(true);
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${placeInfo.id}/comments`
      );
      if (!response.ok) throw new Error("댓글 정보 요청 실패");
      console.log("요청");

      const result = await response.json();
      setCommentsData(result.data || []);
    } catch (err) {
      console.error("댓글 요청 에러:", err);
      setCommentsData([]);
    }
  };

  const handlePostComment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/posts/${placeInfo.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: userInfo?.nickname || "익명",
            content: commentContent,
          }),
        }
      );

      if (!response.ok) throw new Error("댓글 업로드 실패");
      const result = await response.json();
      alert("댓글 업로드 성공");
      return result.data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [isLoading]);

  return (
    <div className="w-full min-h-screen overflow-y-scroll bg-white flex flex-col items-center px-4 py-6 space-y-4">
      {/* 검색창 */}
      <div className="flex space-x-2 w-full max-w-md">
        <div onClick={moveToCurrentLocation}>현재위치</div>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="검색어 입력"
        />
        <button
          onClick={searchPlaces}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          검색
        </button>
      </div>

      {/* 지도 */}
      <div
        id="map"
        className="w-full max-w-md h-[200px] sm:h-[500px] rounded-lg border shadow-md"
      ></div>

      {/* 장소 목록 */}
      <ul className="w-full max-w-md divide-y divide-gray-200 bg-gray-50 rounded-md shadow">
        {visiblePlaces.map((place, index) => {
          const position = new kakao.maps.LatLng(place.y, place.x);
          return (
            <li
              key={index}
              className="p-3 hover:bg-blue-50 cursor-pointer"
              onClick={() => {
                mapRef.current.setCenter(position);
                infowindowRef.current.setContent(
                  `<div style="padding:5px;">${place.place_name}</div>`
                );
                infowindowRef.current.setPosition(position);
                infowindowRef.current.open(mapRef.current);
                console.log(place);
                setPlaceInfo(place);
                handleGetBarrier(place.id); // fetch GET 요청
              }}
            >
              <strong>{place.place_name}</strong>
              <br />
              <small className="text-gray-600">
                {place.road_address_name || place.address_name}
              </small>
            </li>
          );
        })}
      </ul>

      {/* 페이지네이션 */}
      <div className="flex mt-2 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div
        onClick={handleModal}
        className="w-full flex justify-center bg-blue-500 py-2 rounded-xl text-white text-bold"
      >
        배리어 등록하기
      </div>

      <BarrierPostModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        place={placeInfo}
        userInfo={userInfo}
        setIsLoading={setIsLoading}
      />

      {/* Barrier 정보 출력 */}

      {barrierData.map((barrier, index) => (
        <div
          key={index}
          className="w-full max-w-md mx-auto mt-6 p-5 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold">작성자:</span>{" "}
              {barrier.author || "익명"}
            </p>
            <p>
              <span className="font-semibold">작성일:</span>{" "}
              {new Date(barrier.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">주변 경사로:</span>{" "}
              <span
                className={
                  barrier.rampAvailable ? "text-green-600" : "text-red-500"
                }
              >
                {barrier.rampAvailable ? "사용 가능" : "사용 불가"}
              </span>
            </p>
            <p>
              <span className="font-semibold">엘리베이터:</span>{" "}
              <span
                className={
                  barrier.elevatorAvailable ? "text-green-600" : "text-red-500"
                }
              >
                {barrier.elevatorAvailable ? "사용 가능" : "사용 불가"}
              </span>
            </p>
            <p>
              <span className="font-semibold">태그:</span>{" "}
              {barrier.tags?.length > 0 ? (
                <span className="flex flex-wrap gap-1 mt-1">
                  {barrier.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full border border-yellow-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </span>
              ) : (
                "없음"
              )}
            </p>
          </div>

          {(barrier.rampPhotoUrls.length > 0 ||
            barrier.elevatorPhotoUrls.length > 0) && (
            <div className="mt-4">
              <p className="font-semibold text-sm text-gray-800 mb-1">
                📸 사진:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[...barrier.rampPhotoUrls, ...barrier.elevatorPhotoUrls].map(
                  (url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`편의시설-${i}`}
                      className="w-full h-24 object-cover rounded-md border"
                    />
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div className="text-sm font-bold">💬 댓글</div>

            {commentsData.length === 0 && (
              <div className="text-sm text-gray-500">
                작성된 댓글이 없습니다.
              </div>
            )}

            {commentsData.map((comment, index) => (
              <div key={index} className="border-t pt-2">
                <div className="text-sm font-semibold">{comment.author}</div>
                <div className="text-sm text-gray-700">{comment.content}</div>
                <div className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">
                  ❤️ {comment.likes || 0}
                </div>
              </div>
            ))}

            <div className="pt-2 space-y-1">
              <input
                type="text"
                placeholder="댓글 작성"
                value={commentContent}
                onChange={(e) => {
                  if (!userInfo) {
                    alert("로그인 먼저 해주세요");
                    return;
                  }
                  setCommentContent(e.target.value);
                }}
                className="w-full px-2 py-1 border rounded text-sm"
              />
              <button
                onClick={() => {
                  handlePostComment(barrier.id);
                  setCommentContent("");
                }}
                className="w-full bg-blue-500 text-white py-1 rounded text-sm"
              >
                댓글 작성
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
