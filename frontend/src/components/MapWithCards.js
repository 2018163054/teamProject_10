// src/components/MapWithCards.js
import BuildingCard from './BuildingCard.js';
import RampCard from './RampCard.js';
import ElevatorCard from './ElevatorCard.js';
import CommentCard from './CommentCard.js';

export default function MapWithCards() {
  return `
    <!-- 상단 메뉴 바 -->
    <div class="bg-blue-800 text-white font-bold px-4 py-3 flex justify-between">
      <div>Wheel Map</div>
      <div>☰</div>
    </div>

    <!-- Kakao Map이 그려질 영역 -->
    <div id="map" class="w-full h-[50vh]"></div>

    <!-- 세브란스 병원 관련 카드 모음 -->
    <div id="hospital-cards" class="hidden flex-col">
      ${BuildingCard()}
      ${RampCard()}
      ${ElevatorCard()}
      ${CommentCard()}
    </div>

    <!-- 제1공학관 카드 모음 (필요 시 나중에 추가) -->
    <div id="eng1-cards" class="hidden flex-col">
      <!-- import해서 여기에 끼워주면 됩니다 -->
    </div>
  `;
}
