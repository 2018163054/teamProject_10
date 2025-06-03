// src/components/CommentCard.js
export default function CommentCard() {
  return `
    <div class="card bg-white p-4 m-3 rounded-xl shadow-lg opacity-0 translate-y-5 transition-all duration-300 ease-in-out">
      <div class="text-lg font-bold text-gray-900 mb-2">사용자 의견</div>
      <div class="bg-gray-100 p-2 rounded-md mb-2">
        <div class="flex justify-between">
          <div class="text-sm text-gray-900">건물에 장애인 화장실이 없어서 불편해요</div>
          <div class="flex items-center text-sm text-gray-900">
            👍 <span class="ml-1">1</span>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 p-2 rounded-md mb-2">
        <div class="flex justify-between">
          <div class="text-sm text-gray-900">건물에 장애인 화장실이 너무 많아요 이제 더 만들지 말아주세요</div>
          <div class="flex items-center text-sm text-gray-900">
            👍 <span class="ml-1">2</span>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 p-2 rounded-md mb-2">
        <div class="flex justify-between">
          <div class="text-sm text-gray-900">건물에 경사로가 38개 있어서 경사가 많이 져 있어요</div>
          <div class="flex items-center text-sm text-gray-900">
            👍 <span class="ml-1">38</span>
          </div>
        </div>
      </div>
      <a href="#" class="inline-block mt-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm">
        댓글 더 보기
      </a>
    </div>
  `;
}
