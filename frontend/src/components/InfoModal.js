// src/components/InfoModal.js
export default function InfoModal() {
  return `
    <div
      id="modal-wrapper"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50"
    >
      <div
        class="w-80 bg-white rounded-xl shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.04)] shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.10)] inline-flex flex-col justify-start items-center overflow-hidden"
      >
        <!-- ① 모달 헤더: 부모에 position:relative 추가 -->
        <div class="self-stretch relative bg-white flex flex-col justify-start items-start">
          
          <!-- ② 닫기 버튼 (절대 위치 top-2 right-2) -->
          <button
            id="btn-close-modal"
            class="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <div class="self-stretch px-4 pt-5 bg-white flex flex-col justify-start items-start gap-3">
            <div class="self-stretch flex flex-col justify-start items-start gap-1">
              <div class="self-stretch text-gray-900 text-lg font-bold  leading-7">
                건물 정보 등록하기
              </div>
              <div class="self-stretch text-slate-600 text-sm font-normal  leading-tight">
                건물 내 휠체어 이용자를 위한 경사로 사진 혹은 승강기 운행 정보를 등록해주세요.
              </div>
            </div>
          </div>
        </div>

        <!-- 모달 본문: 경사로 / 승강기 / 태그 -->
        <div class="self-stretch px-4 flex flex-col justify-start items-start gap-4">
          <!-- 1) 경사로 정보 수정 -->
          <div class="self-stretch flex flex-col justify-start items-start gap-4">
            <div class="self-stretch flex flex-col justify-start items-start gap-2">
              <div class="text-slate-700 text-sm font-medium  leading-tight">
                경사로 정보 수정
              </div>
              <div class="self-stretch inline-flex justify-start items-start gap-1">
                <div class="w-40 py-1 bg-amber-300 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex justify-center items-center overflow-hidden ramp-toggle" data-value="true">
                  <div class="text-gray-900 text-sm font-bold  leading-tight">
                    사용 가능
                  </div>
                </div>
                <div class="w-40 px-2 py-1 bg-gray-100 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex justify-center items-center gap-2 overflow-hidden ramp-toggle" data-value="false">
                  <div class="text-gray-900 text-sm font-bold  leading-tight">
                    사용 불가
                  </div>
                </div>
              </div>
              <div class="self-stretch flex flex-col justify-start items-end gap-2">
                <div
                  id="input-ramp-photo-btn"
                  class="px-4 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-center items-center gap-2 overflow-hidden"
                >
                  <div class="w-5 h-5 relative overflow-hidden">
                    <div class="w-4 h-3.5 left-[1.67px] top-[2.50px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-slate-700"></div>
                  </div>
                  <div class="text-slate-700 text-sm font-bold  leading-tight">
                    Upload photo
                  </div>
                </div>
              </div>
            </div>

            <!-- 2) 승강기 정보 수정 -->
            <div class="self-stretch flex flex-col justify-start items-start gap-2">
              <div class="text-slate-700 text-sm font-medium  leading-tight">
                승강기 운행 정보 수정
              </div>
              <div class="self-stretch inline-flex justify-start items-start gap-1">
                <div class="w-40 py-1 bg-amber-300 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex justify-center items-center overflow-hidden elevator-toggle" data-value="true">
                  <div class="text-gray-900 text-sm font-bold  leading-tight">
                    사용 가능
                  </div>
                </div>
                <div class="w-40 px-2 py-1 bg-gray-100 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex justify-center items-center gap-2 overflow-hidden elevator-toggle" data-value="false">
                  <div class="text-gray-900 text-sm font-bold  leading-tight">
                    사용 불가
                  </div>
                </div>
              </div>
              <div class="self-stretch flex flex-col justify-start items-end gap-2">
                <div
                  id="input-elevator-photo-btn"
                  class="px-4 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-center items-center gap-2 overflow-hidden"
                >
                  <div class="w-5 h-5 relative overflow-hidden">
                    <div class="w-4 h-3.5 left-[1.67px] top-[2.50px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-slate-700"></div>
                  </div>
                  <div class="text-slate-700 text-sm font-bold  leading-tight">
                    Upload photo
                  </div>
                </div>
              </div>
            </div>

            <!-- 3) 태그 등록 -->
            <div class="self-stretch flex flex-col justify-start items-start gap-1">
              <div class="self-stretch flex flex-col justify-start items-start gap-1.5">
                <div class="text-slate-700 text-sm font-medium  leading-tight">
                  태그 등록
                </div>
                <div class="self-stretch inline-flex justify-start items-start gap-1 flex-wrap content-start">
                  <!-- Figma 예시 태그 -->
                  <div class="w-20 h-6 p-1 bg-gray-100 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex justify-start items-start gap-1 flex-wrap content-start overflow-hidden">
                    <div class="text-gray-900 text-xs font-medium  leading-none">
                      #장애인화장실
                    </div>
                  </div>
                  <div class="p-1 bg-gray-100 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex justify-center items-center gap-1 overflow-hidden">
                    <div class="text-gray-900 text-xs font-medium  leading-none">
                      #경사로
                    </div>
                  </div>
                  <div class="p-1 bg-gray-100 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] inline-flex flex-col justify-center items-center gap-1 overflow-hidden">
                    <div class="text-gray-900 text-xs font-medium  leading-none">
                      #다른거 아무거나
                    </div>
                  </div>
                  <div class="p-1 bg-gray-100 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] inline-flex flex-col justify-center items-center gap-1 overflow-hidden">
                    <div class="text-gray-900 text-xs font-medium  leading-none">
                      #또어떤게있지
                    </div>
                  </div>
                  <!-- 태그 입력란 -->
                  <input
                    type="text"
                    id="tags-input"
                    placeholder="#경사로"
                    class="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
                  />

                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 모달 하단 버튼 -->
        <div class="self-stretch pt-6 flex flex-col justify-start items-start">
          <div class="self-stretch px-4 pb-4 flex flex-col justify-start items-start gap-3">
            <button
                id="btn-submit-modal"
                class="self-stretch px-4 py-2.5 bg-amber-300 rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] inline-flex justify-center items-center gap-2 text-gray-900 font-bold leading-normal"
>
                제출하기
            </button>
            <button
                id="btn-cancel-modal"
                class="self-stretch px-4 py-2.5 mt-2 bg-white rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-center items-center gap-2 text-gray-900 font-bold leading-normal"
>
                취소하기
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
