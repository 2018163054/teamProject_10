import { useEffect, useState, useRef } from "react";
import Modal from "./modal";

export default function BarrierFreeMap() {
  const mapRef = useRef(null);
  const infoOverlayRef = useRef(null);
  const overlayDOMRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rampAvailable, setRampAvailable] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [infoOverlay, setInfoOverlay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 예시 로그인 체크 - 실제 로그인 여부는 context 또는 localStorage/token 검사 등으로 대체
    const userToken = localStorage.getItem("token");
    setIsLoggedIn(!!userToken);
  }, []);

  useEffect(() => {
    const container = document.getElementById("map");
    const kakaoMap = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 4,
    });
    mapRef.current = kakaoMap;

    /* kakao.maps.event.addListener(kakaoMap, "click", function (mouseEvent) {
      const latlng = mouseEvent.latLng;
      setSelectedLocation({ lat: latlng.getLat(), lng: latlng.getLng() });

      new kakao.maps.Marker({ position: latlng, map: kakaoMap });

      // ✅ 기존 오버레이 제거 (useRef 사용)
      if (infoOverlayRef.current) {
        infoOverlayRef.current.setMap(null);
        infoOverlayRef.current = null;
      }

      if (overlayDOMRef.current) {
        overlayDOMRef.current.remove(); // DOM에서 제거
        overlayDOMRef.current = null;
      }

      const tagEl = document.createElement("div");
      tagEl.innerHTML = `<div class='custom-tag z-30'>🧑‍🦽 휠체어 접근 가능</div>`;
      tagEl.onclick = () => {
        if (!isLoggedIn) {
          alert("로그인이 필요합니다.");
          return;
        }
        setModalVisible(true);
      };

      overlayDOMRef.current = tagEl;

      const overlay = new kakao.maps.CustomOverlay({
        position: latlng,
        content: tagEl,
        yAnchor: 1.3,
      });
      overlay.setMap(kakaoMap);

      // ✅ 최신 오버레이 저장
      infoOverlayRef.current = overlay;

      const ts = Date.now();
      setLocationId(
        `loc-${latlng.getLat().toFixed(4)}-${latlng.getLng().toFixed(4)}-${ts}`
      ); 
    });*/
  }, [isLoggedIn]);

  const moveToCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const loc = new kakao.maps.LatLng(lat, lng);
      mapRef.current.setCenter(loc);
      setSelectedLocation({ lat, lng });

      new kakao.maps.Marker({ position: loc, map: mapRef.current });

      // 자동 locationId
      setLocationId(`gps-${lat.toFixed(4)}-${lng.toFixed(4)}-${Date.now()}`);
    });
  };

  const handleSave = async () => {
    if (!selectedLocation || !locationId)
      return alert("위치를 먼저 지정해주세요.");

    const formData = new FormData();
    formData.append("locationId", locationId);
    formData.append("rampAvailable", rampAvailable);
    formData.append("lat", selectedLocation.lat);
    formData.append("lng", selectedLocation.lng);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`http://localhost:3000/posts/1`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("서버 오류");
      alert("저장 완료 ✅");
    } catch (err) {
      console.error(err);
      alert("저장 실패 ❌");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center px-4 py-6 space-y-4">
      <h1 className="text-lg sm:text-2xl font-bold text-blue-600">
        🗺️ 휠체어 접근 정보 등록
      </h1>
      <div
        id="map"
        className="w-full max-w-md h-[400px] sm:h-[500px] rounded-lg border shadow-md"
      ></div>

      <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-md p-4 space-y-3">
        <button
          onClick={moveToCurrentLocation}
          className="w-full py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
        >
          📍 현재 위치로 이동
        </button>
      </div>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        rampAvailable={rampAvailable}
        locationId={locationId}
      />

      {/* Custom 태그용 스타일 */}
      <style>{`
        .custom-tag {
          background-color: #2563eb;
          color: white;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
