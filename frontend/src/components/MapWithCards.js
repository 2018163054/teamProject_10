// src/components/MapWithCards.js
import InfoModal from './InfoModal.js';

export default function MapWithCards() {
  return `
    <!-- 1) 전역 헤더: 화면 전체 폭 -->
    <div class="w-full h-16 bg-blue-700 flex items-center justify-between px-4">
      <div class="text-white text-xl font-bold">
        Wheel Map
      </div>
      <div class="p-2 rounded border border-blue-300">
        <div class="w-5 h-5 bg-blue-300"></div>
      </div>
    </div>

    <!-- 2) 본문 컨테이너: 중앙 정렬 + 최대 폭 제한 -->
    <div class="w-full max-w-screen-md mx-auto p-2">
      <!-- 2-1) 지도 + 검색 영역 -->
      <div class="relative w-full mt-4">
        <!-- (a) 카카오맵 영역: 작은 화면 h-64, md 이상 h-[459px] -->
        <div id="map" class="w-full h-64 md:h-[459px] bg-gray-200 rounded-lg overflow-hidden"></div>

        <!-- (b) 검색 인포윈도우: 
             - 작은 화면(small): inset-x-4 → 좌우 1rem 여백, 너비 자동(지도를 벗어나지 않음)
             - md 이상: left-4, 고정 너비 w-56
             - 높이는 small에서 max-h-24(≈96px), md 이상에서 max-h-[153px] 
             - 투명도 50%, backdrop-blur-sm  
        -->
        <div
          id="menu_wrap"
          class="
            absolute top-4 
            inset-x-4 md:inset-auto md:left-4
            bg-white/50 backdrop-blur-sm
            overflow-y-auto rounded-xl shadow-lg
            p-3 z-50
            max-h-24 md:max-h-[153px]
            md:w-56
          "
        >
          <!-- 검색창 -->
          <div class="mb-2">
            <form id="search-form" class="flex">
              <input
                type="text"
                id="keyword"
                value="연세대학교 제1공학관"
                placeholder="키워드를 입력하세요"
                class="flex-1 border border-gray-300 rounded-l-md px-2 py-1 text-xs focus:outline-none"
              />
              <button
                type="submit"
                id="btn-search"
                class="bg-blue-600 text-white px-2 py-1 rounded-r-md hover:bg-blue-700 text-xs"
              >
                검색
              </button>
            </form>
          </div>
          <hr class="border-gray-400 mb-2" />
          <ul id="placesList" class="space-y-2"></ul>
        </div>
      </div>

      <!-- 2-2) 카드 렌더링 영역 (기본 hidden) -->
      <div
        id="detail-cards-container"
        class="hidden w-full mt-4 flex flex-col gap-4 overflow-hidden"
      ></div>
    </div>

    <!-- 3) 모달 컴포넌트 (Figma에서 추출한 Tailwind) -->
    ${InfoModal()}
  `;
}
