// src/js/auth.js
let isLoggedIn = false;
let kakaoUser = null;

// 카카오 SDK 초기화 (vite에서 import 없이 window.Kakao 전역 사용 가능)
const KAKAO_JS_KEY = '여기에_카카오_JS_KEY_넣어야함';

export function initKakaoAuth() {
  if (!window.Kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    return;
  }
  Kakao.init(KAKAO_JS_KEY);
}

export function loginWithKakao() {
  Kakao.Auth.login({
    scope: 'profile_nickname,account_email',
    success: function(authObj) {
      // 로그인 성공
      Kakao.API.request({
        url: '/v2/user/me',
        success: function(res) {
          isLoggedIn = true;
          kakaoUser = {
            id: res.id,
            nickname: res.kakao_account.profile.nickname,
            email: res.kakao_account.email,
            profileImage: res.kakao_account.profile.profile_image_url,
          };
          renderUserSidebar();
        },
        fail: function(err) {
          console.error('유저 정보 요청 실패:', err);
        }
      });
    },
    fail: function(err) {
      console.error('카카오 로그인 실패:', err);
    }
  });
}

export function logoutKakao() {
  if (!isLoggedIn) return;
  Kakao.Auth.logout(function() {
    isLoggedIn = false;
    kakaoUser = null;
    renderUserSidebar();
  });
}

export function getLoginStatus() {
  return isLoggedIn;
}

export function getUserInfo() {
  return kakaoUser;
}

// 사이드바 렌더링 (로그인 전/후 UI 토글)
function renderUserSidebar() {
  const btnLogin = document.getElementById('btn-login');
  const userProfile = document.getElementById('user-profile');
  const userNameElem = document.getElementById('user-name');

  if (isLoggedIn && kakaoUser) {
    btnLogin.classList.add('hidden');
    userProfile.classList.remove('hidden');
    userNameElem.textContent = kakaoUser.nickname;
  } else {
    btnLogin.classList.remove('hidden');
    userProfile.classList.add('hidden');
    userNameElem.textContent = '';
  }
}
