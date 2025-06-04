// src/js/main.js
import MapWithCards from '../components/MapWithCards.js';
import { initModalLogic, openModal } from './modal.js';

let map, ps, infowindow;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
  // 1) 전체 레이아웃(지도+검색+카드+모달 포함) 렌더
  const root = document.getElementById('app');
  root.innerHTML = MapWithCards();

  // 2) 모달 초기화
  initModalLogic();

  // 3) 카카오맵 로드
  kakao.maps.load(() => {
    // 3-1) 지도 생성
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 초기 센터 위치
      level: 3,
    };
    map = new kakao.maps.Map(mapContainer, mapOption);

    // 3-2) Places 검색 객체
    ps = new kakao.maps.services.Places();

    // 3-3) 인포윈도우 생성 (hover 시 장소명 표시)
    infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    // 3-4) 검색 폼 이벤트 바인딩
    const searchForm = document.getElementById('search-form');
    const keywordInput = document.getElementById('keyword');

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchPlaces();
    });

    // 3-5) 초기 검색어 자동 실행
    keywordInput.value = '연세대학교 제1공학관';
    searchPlaces();
  });
});

// 검색 요청
function searchPlaces() {
  const keyword = document.getElementById('keyword').value.trim();
  if (!keyword) {
    alert('키워드를 입력해주세요!');
    return;
  }
  ps.keywordSearch(keyword, placesSearchCB);
}

// 검색 콜백
function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    displayPlaces(data);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색 결과가 존재하지 않습니다.');
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert('검색 중 오류가 발생했습니다.');
  }
}

// 검색 결과 표시 (첫 번째 결과로 센터 이동 + 레벨 3, 상위 3개만)
function displayPlaces(places) {
  const listEl = document.getElementById('placesList');
  const menuEl = document.getElementById('menu_wrap');
  const fragment = document.createDocumentFragment();

  removeAllChildNods(listEl);
  removeMarker();

  // 상위 3개만 사용
  const topThree = places.slice(0, 3);

  // 첫 번째 결과로 지도 센터 이동 + 레벨 3
  if (topThree.length > 0) {
    const first = topThree[0];
    const firstPosition = new kakao.maps.LatLng(first.y, first.x);
    map.setCenter(firstPosition);
    map.setLevel(3);
  }

  topThree.forEach((place, i) => {
    const placePosition = new kakao.maps.LatLng(place.y, place.x);

    // (가) 마커 생성
    const marker = addMarker(placePosition, i);

    // (나) 목록 아이템 생성
    const itemEl = getListItem(i, place);

    // (다) hover 시 인포윈도우
    (function (marker, title) {
      kakao.maps.event.addListener(marker, 'mouseover', () => {
        displayInfowindow(marker, title);
      });
      kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
      });
      itemEl.onmouseover = () => {
        displayInfowindow(marker, title);
      };
      itemEl.onmouseout = () => {
        infowindow.close();
      };
    })(marker, place.place_name);

    // (라) 클릭 시 카드 렌더
    kakao.maps.event.addListener(marker, 'click', () => {
      renderPlaceCard(place);
    });

    fragment.appendChild(itemEl);
  });

  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;
}

// 검색 결과 <li> 생성 (글자 크기를 text-xs로 조정)
function getListItem(index, places) {
  const el = document.createElement('li');
  el.className = 'item relative border-b border-gray-300 cursor-pointer min-h-[65px]';

  // 1) 스프라이트 마커 번호
  const markerSpan = document.createElement('span');
  markerSpan.className = `markerbg marker_${index + 1}`;
  markerSpan.style.cssText = `
    position: absolute;
    width:36px; height:37px;
    margin:10px 0 0 10px;
    background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png') no-repeat;
  `;

  // 2) 정보 컨테이너
  const infoDiv = document.createElement('div');
  infoDiv.className = 'info pl-[55px] py-2 overflow-hidden whitespace-nowrap';
  infoDiv.style.cssText = 'padding-left: 55px;';

  // 장소명 (text-xs로 조금 더 작게)
  const placeName = document.createElement('h5');
  placeName.textContent = places.place_name;
  placeName.className = 'font-semibold text-gray-800 text-xs truncate'; 
  infoDiv.appendChild(placeName);

  // 주소
  if (places.road_address_name) {
    const roadSpan = document.createElement('span');
    roadSpan.textContent = places.road_address_name;
    roadSpan.className = 'text-[10px] text-gray-500 truncate block'; 
    infoDiv.appendChild(roadSpan);

    const jibunSpan = document.createElement('span');
    jibunSpan.textContent = places.address_name;
    jibunSpan.className = 'text-[10px] text-gray-500 truncate pl-6 block'; 
    infoDiv.appendChild(jibunSpan);
  } else {
    const addrSpan = document.createElement('span');
    addrSpan.textContent = places.address_name;
    addrSpan.className = 'text-[10px] text-gray-500 truncate block'; 
    infoDiv.appendChild(addrSpan);
  }

  // 전화번호 (text-[10px])
  const telSpan = document.createElement('span');
  telSpan.textContent = places.phone;
  telSpan.className = 'text-[10px] text-green-600 truncate block';
  infoDiv.appendChild(telSpan);

  el.appendChild(markerSpan);
  el.appendChild(infoDiv);
  return el;
}

function idxToSpriteOffset(idx) {
  return idx * 46 + 10;
}

function addMarker(position, idx) {
  const imageSrc =
    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
  const imageSize = new kakao.maps.Size(36, 37);
  const imgOptions = {
    spriteSize: new kakao.maps.Size(36, 691),
    spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
    offset: new kakao.maps.Point(13, 37),
  };
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);

  const marker = new kakao.maps.Marker({
    position: position,
    image: markerImage,
    clickable: true,
  });
  marker.setMap(map);
  markers.push(marker);
  return marker;
}

function removeMarker() {
  markers.forEach((m) => m.setMap(null));
  markers = [];
}

function displayInfowindow(marker, title) {
  const content = `<div style="padding:5px; z-index:1; font-size:10px;">${title}</div>`;
  // 인포윈도우 내부 글자 크기도 줄였습니다 (font-size:10px)
  infowindow.setContent(content);
  infowindow.open(map, marker);
}

function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

// 5) 마커 클릭 시 “메인 카드” 렌더
function renderPlaceCard(place) {
  const detailContainer = document.getElementById('detail-cards-container');
  detailContainer.innerHTML = '';
  detailContainer.classList.remove('hidden');

  detailContainer.innerHTML = `
    <!-- ① 건물 기본 정보 카드 -->
    <div class="self-stretch h-32 p-4 bg-white rounded-2xl
                shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)]
                shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06)]
                flex flex-col justify-between items-start">
      <div class="self-stretch inline-flex justify-between items-center">
        <div class="px-2 flex justify-center items-center gap-2">
          <div class="w-44 h-14 
                      text-gray-900 text-lg font-bold leading-loose">
            ${place.place_name}
          </div>
        </div>
        <div class="w-32 h-14 flex justify-center items-center">
          <button
            id="btn-open-modal"
            class="w-28 h-9 bg-amber-300 rounded flex justify-center items-center text-gray-900 text-sm font-bold"
          >
            정보 등록하기
          </button>
        </div>

      </div>
      <div class="self-stretch inline-flex justify-start items-start gap-4">
        <div class="flex-1 flex justify-start items-start gap-1 
                    flex-wrap content-start">
          <div class="w-20 h-6 p-1 bg-gray-100 rounded
                      shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                      flex justify-start items-start gap-1 
                      flex-wrap content-start overflow-hidden">
            <div class="text-gray-900 text-xs font-medium leading-none">#장애인화장실</div>
          </div>
          <div class="p-1 bg-gray-100 rounded
                      shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                      flex justify-center items-center gap-1 overflow-hidden">
            <div class="text-gray-900 text-xs font-medium leading-none">#경사로</div>
          </div>
          <div class="p-1 bg-gray-100 rounded
                      shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                      inline-flex flex-col justify-center items-center gap-1 overflow-hidden">
            <div class="text-gray-900 text-xs font-medium leading-none">#다른거 아무거나</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ② 경사로 현황 카드 (사용 가능 여부 + 사진 + 버튼) -->
    <div class="self-stretch p-4 bg-white rounded-2xl
                shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)]
                shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06)]
                flex flex-col justify-start items-start gap-4">
      <!-- (2-1) 제목 -->
      <div class="self-stretch inline-flex justify-start items-start gap-2.5">
        <div class="flex-1 text-gray-900 text-xl font-bold leading-loose">경사로 현황</div>
      </div>
      <!-- (2-2) 사용 가능 여부 -->
      <div class="self-stretch p-2 bg-gray-50 rounded-2xl
                  flex flex-col justify-start items-start">
        <div class="self-stretch py-2 inline-flex justify-start items-center overflow-hidden">
          <div class="flex-1 inline-flex flex-col justify-start items-start">
            <div class="w-60 text-gray-900 text-lg font-bold leading-7">사용 가능 여부</div>
          </div>
          <div class="w-20 text-right text-gray-900 text-base font-bold leading-normal">가능</div>
        </div>
      </div>
      <!-- (2-3) 경사로 사진 -->
      <div class="self-stretch flex flex-col justify-start items-start">
        <div class="self-stretch inline-flex justify-start items-center overflow-hidden">
          <img class="w-80 h-60" src="https://placehold.co/312x234" alt="경사로 사진" />
        </div>
        <div class="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
      </div>
      <!-- (2-4) 사진 더 보기 버튼 -->
      <div class="self-stretch inline-flex justify-center items-center gap-2.5">
        <button
          id="btn-ramp-more"
          class="w-28 h-9 relative rounded-lg overflow-hidden"
        >
          <div class="px-4 py-2 left-0 top-[-2.50px] absolute bg-blue-500 rounded 
                      inline-flex justify-start items-center gap-2.5 overflow-hidden">
            <div class="text-white text-sm font-normal leading-normal">사진 더 보기</div>
          </div>
        </button>
      </div>
    </div>

    <!-- ③ 승강기 현황 카드 -->
    <div class="self-stretch p-4 bg-white rounded-2xl
                shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)]
                shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06)]
                flex flex-col justify-start items-start gap-4">
      <!-- (3-1) 제목 -->
      <div class="self-stretch inline-flex justify-start items-start gap-2.5">
        <div class="flex-1 text-gray-900 text-xl font-bold leading-loose">승강기 현황</div>
      </div>
      <!-- (3-2) 공공데이터 정보 소제목 박스 -->
      <div class="self-stretch p-2 bg-gray-50 rounded-2xl flex flex-col justify-start items-start">
        <div class="self-stretch py-2 inline-flex justify-start items-center overflow-hidden">
          <div class="flex-1 inline-flex flex-col justify-start items-start">
            <div class="w-60 text-gray-900 text-lg font-bold leading-7">공공데이터 정보</div>
          </div>
        </div>
        <div class="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
        <div class="self-stretch py-2 inline-flex justify-start items-center overflow-hidden">
          <div class="flex-1 inline-flex flex-col justify-start items-start">
            <div class="w-60 text-gray-900 text-base font-bold leading-normal">현재 운행 여부</div>
          </div>
          <div class="w-20 text-right text-gray-900 text-base font-bold leading-normal">운영 중</div>
        </div>
        <div class="self-stretch py-2 inline-flex justify-start items-center overflow-hidden">
          <div class="flex-1 inline-flex flex-col justify-start items-start">
            <div class="w-60 text-gray-900 text-base font-bold leading-normal">승강기 점검 결과</div>
          </div>
          <div class="w-20 text-right text-gray-900 text-base font-bold leading-normal">양호</div>
        </div>
      </div>
      <!-- (3-3) 승강기 사진 -->
      <div class="self-stretch flex flex-col justify-start items-start">
        <div class="self-stretch flex flex-col justify-center items-start overflow-hidden">
          <img class="w-80 h-60" src="https://placehold.co/312x234" alt="승강기 사진" />
        </div>
      </div>
      <!-- (3-4) 사진 더 보기 버튼 -->
      <div class="self-stretch inline-flex justify-center items-center gap-2.5">
        <button
          id="btn-elevator-more"
          class="w-28 h-9 relative rounded-lg overflow-hidden"
        >
          <div class="px-4 py-2 left-0 top-[-2.50px] absolute bg-blue-500 rounded 
                      inline-flex justify-start items-center gap-2.5 overflow-hidden">
            <div class="text-white text-sm font-normal leading-normal">사진 더 보기</div>
          </div>
        </button>
      </div>
    </div>

    <!-- ④ 사용자 의견 (더미 UI) -->
    <div class="self-stretch p-4 bg-white rounded-2xl
                shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)]
                shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06)]
                flex flex-col justify-start items-start gap-4">
      <div class="self-stretch inline-flex justify-start items-start gap-2.5">
        <div class="flex-1 text-gray-900 text-xl font-bold leading-loose">사용자 의견</div>
      </div>
      <div class="p-2 bg-gray-50 rounded-2xl flex flex-col justify-start items-start">
        <!-- 더미 댓글 1 -->
        <div class="self-stretch py-2 inline-flex justify-start items-center overflow-hidden">
          <div class="flex-1 flex justify-between items-center">
            <div class="inline-flex flex-col justify-center items-center gap-2">
              <div class="w-60 text-gray-900 text-sm font-medium leading-tight">
                건물에 장애인 화장실이 없어서 불편해요
              </div>
            </div>
            <div class="w-11 flex justify-start items-center gap-[3px]">
              <div class="w-5 h-5 relative overflow-hidden">
                <div class="w-4 h-4 left-[2px] top-[2px] absolute 
                            bg-zinc-700"></div>
              </div>
              <div class="text-black text-sm font-medium leading-tight">1</div>
            </div>
          </div>
        </div>
        <div class="w-72 h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
        <!-- 더미 댓글 2 -->
        <div class="self-stretch py-2 inline-flex justify-start items-center overflow-hidden">
          <div class="flex-1 flex justify-between items-center">
            <div class="inline-flex flex-col justify-center items-center gap-2">
              <div class="w-60 text-gray-900 text-sm font-medium leading-tight">
                건물에 장애인 화장실이 너무 많아서 이제 더 만들지 말아주세요
              </div>
            </div>
            <div class="w-11 flex justify-start items-center gap-[3px]">
              <div class="w-5 h-5 relative overflow-hidden">
                <div class="w-4 h-4 left-[2px] top-[2px] absolute 
                            bg-zinc-700"></div>
              </div>
              <div class="text-black text-sm font-medium leading-tight">1</div>
            </div>
          </div>
        </div>
        <div class="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
        <!-- 더미 댓글 3 -->
        <div class="py-2 inline-flex justify-start items-center overflow-hidden">
          <div class="w-72 flex justify-between items-center">
            <div class="inline-flex flex-col justify-center items-center gap-2">
              <div class="w-60 text-gray-900 text-sm font-medium leading-tight">
                건물에 경사로가 38개 있어서 경사가 많이 져 있어요
              </div>
            </div>
            <div class="w-11 flex justify-start items-center gap-[3px]">
              <div class="w-5 h-5 relative overflow-hidden">
                <div class="w-4 h-4 left-[2px] top-[2px] absolute 
                            bg-zinc-700"></div>
              </div>
              <div class="text-black text-sm font-medium leading-tight">38</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 더 보기 버튼 (더미 UI) -->
      <div class="self-stretch inline-flex justify-center items-center gap-2.5">
        <button
          id="btn-elevator-more"
          class="w-28 h-9 relative rounded-lg overflow-hidden"
        >
          <div class="px-4 py-2 left-0 top-[-2.50px] absolute bg-blue-500 rounded 
                      inline-flex justify-start items-center gap-2.5 overflow-hidden">
            <div class="text-white text-sm font-normal leading-normal">댓글 더 보기</div>
          </div>
        </button>
      </div>
    </div>
  `;

  // “정보 등록하기” 버튼 클릭 → 모달 열기
  document.getElementById('btn-open-modal').addEventListener('click', () => {
    openModal(place);
  });
}
