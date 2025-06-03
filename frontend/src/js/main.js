// src/js/main.js
import MapWithCards from '../components/MapWithCards.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1) #app 마운트 포인트에 MapWithCards 컴포넌트를 삽입
  const root = document.getElementById('app');
  root.innerHTML = MapWithCards();

  // 2) 카카오맵 초기화
  const mapContainer = document.getElementById('map');
  const mapOption = {
    center: new kakao.maps.LatLng(37.5618, 126.9368), // 연세대 근처 좌표
    level: 3,                                           // 줌 레벨 (1~14)
  };
  const map = new kakao.maps.Map(mapContainer, mapOption);

  // 3) 마커 생성 (연세대 세브란스 병원)
  const hospitalMarker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(37.5620, 126.9368),
    title: '연세대학교 세브란스 병원',
  });
  hospitalMarker.setMap(map);

  // 3-1) 마커 생성 (연세대 제1공학관)
  const eng1Marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(37.5612, 126.9353),
    title: '연세대학교 제1공학관',
  });
  eng1Marker.setMap(map);

  // 4) 카드 컨테이너 참조
  const hospitalContainer = document.getElementById('hospital-cards');
  const eng1Container = document.getElementById('eng1-cards');

  // 모든 카드 숨기는 함수
  function hideAllContainers() {
    hospitalContainer.classList.add('hidden');
    eng1Container.classList.add('hidden');

    // 모든 .card 요소를 투명·아래로 위치시키기
    document.querySelectorAll('.card').forEach((card) => {
      card.classList.remove('opacity-100', 'translate-y-0');
      card.classList.add('opacity-0', 'translate-y-5');
    });
  }

  // 특정 컨테이너에 속한 카드들을 순차적으로 노출하는 함수
  function showCards(container) {
    container.classList.remove('hidden');

    setTimeout(() => {
      container.querySelectorAll('.card').forEach((card, idx) => {
        setTimeout(() => {
          card.classList.remove('opacity-0', 'translate-y-5');
          card.classList.add('opacity-100', 'translate-y-0');
        }, idx * 100);
      });
    }, 50);
  }

  // 5) 마커 클릭 시 해당 카드만 보여주기
  hospitalMarker.addListener('click', () => {
    hideAllContainers();
    showCards(hospitalContainer);
  });

  eng1Marker.addListener('click', () => {
    hideAllContainers();
    showCards(eng1Container);
  });

  // 6) 지도의 빈 공간 클릭 시 카드 모두 숨기기
  kakao.maps.event.addListener(map, 'click', () => {
    hideAllContainers();
  });
});
