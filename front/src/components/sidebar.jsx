import { useState } from "react";
import { useEffect } from "react";

export default function Sidebar({ isLoggedIn, setIsLoggedIn, setUserInfo }) {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("dd6805c5da47e529b3e4163a4390edaa"); // 카카오 JS 키 입력
    }
  }, []);
  const [nickname, setNickname] = useState("익명");

  const handleLogin = () => {
    if (!window.Kakao) return alert("카카오 SDK 로드 실패");

    window.Kakao.Auth.loginForm({
      scope: "profile_nickname",
      success: function (authObj) {
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: function (res) {
            setIsLoggedIn(true);
            setUserInfo({
              nickname: res.kakao_account.profile.nickname,
            });
            setNickname(res.kakao_account.profile.nickname);
            localStorage.setItem("token", authObj.access_token);
          },
          fail: function (error) {
            alert("사용자 정보 요청 실패");
            console.error(error);
          },
        });
      },
      fail: function (err) {
        alert("카카오 로그인 실패");
        console.error(err);
      },
    });
  };

  const handleLogout = () => {
    window.Kakao.Auth.logout(() => {
      setIsLoggedIn(false);
      setUserInfo(null);
      localStorage.removeItem("token");
    });
  };

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">메뉴</h2>
      {!isLoggedIn ? (
        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-500"
        >
          카카오로 로그인
        </button>
      ) : (
        <>
          <p className="text-sm">{nickname + "님 환영합니다!"}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 py-2 px-4 rounded hover:bg-red-700"
          >
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}
