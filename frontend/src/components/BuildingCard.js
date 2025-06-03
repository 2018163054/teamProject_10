// src/components/HospitalCard.js
export default function BuildingCard() {
  return `
    <div class="card bg-white p-4 m-3 rounded-xl shadow-lg opacity-0 translate-y-5 transition-all duration-300 ease-in-out">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-900">연세대학교 세브란스 병원</h3>
        <button class="bg-yellow-400 text-gray-900 text-sm font-semibold rounded-md px-3 py-1">
          정보 등록하기
        </button>
      </div>
      <div class="mt-2 flex flex-wrap">
        <span class="inline-block bg-gray-200 rounded-md px-2 py-1 mx-1 text-xs">#장애인화장실</span>
        <span class="inline-block bg-gray-200 rounded-md px-2 py-1 mx-1 text-xs">#경사로</span>
        <span class="inline-block bg-gray-200 rounded-md px-2 py-1 mx-1 text-xs">#다른거 아무거나</span>
      </div>
    </div>
  `;
}
