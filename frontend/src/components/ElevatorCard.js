// src/components/RampCard.js
export default function RampCard() {
  return `
    <div class="card bg-white p-4 m-3 rounded-xl shadow-lg opacity-0 translate-y-5 transition-all duration-300 ease-in-out">
      <div class="text-lg font-bold text-gray-900 mb-2">경사로 현황</div>
      <img class="w-full rounded-md mb-2" src="https://placehold.co/312x234" alt="경사로 사진" />
      <a href="#" class="inline-block mt-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm">
        사진 더 보기
      </a>
    </div>
  `;
}
