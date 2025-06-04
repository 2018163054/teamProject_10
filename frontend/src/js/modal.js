// src/js/modal.js

let currentPlace = null;

export function initModalLogic() {
  const modalWrapper = document.getElementById('modal-wrapper');
  const btnClose = document.getElementById('btn-close-modal');
  const btnCancel = document.getElementById('btn-cancel-modal');
  const btnSubmit = document.getElementById('btn-submit-modal');

  // 토글 버튼들
  const rampToggles = document.querySelectorAll('.ramp-toggle');
  const elevatorToggles = document.querySelectorAll('.elevator-toggle');

  let rampAvailable = null;
  let elevatorAvailable = null;

  // 1) 닫기 × 버튼, 취소 버튼: 모달 숨기기
  btnClose.addEventListener('click', () => {
    modalWrapper.classList.add('hidden');
  });
  btnCancel.addEventListener('click', () => {
    modalWrapper.classList.add('hidden');
  });

  // 2) 경사로 토글 기능
  rampToggles.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      rampToggles.forEach((x) => {
        x.classList.remove('bg-amber-300', 'text-gray-900');
        x.classList.add('bg-gray-100', 'text-gray-900');
      });
      const target = e.currentTarget;
      target.classList.remove('bg-gray-100', 'text-gray-900');
      target.classList.add('bg-amber-300', 'text-gray-900');
      rampAvailable = target.dataset.value; // 'true' or 'false'
    });
  });

  // 3) 승강기 토글 기능
  elevatorToggles.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      elevatorToggles.forEach((x) => {
        x.classList.remove('bg-amber-300', 'text-gray-900');
        x.classList.add('bg-gray-100', 'text-gray-900');
      });
      const target = e.currentTarget;
      target.classList.remove('bg-gray-100', 'text-gray-900');
      target.classList.add('bg-amber-300', 'text-gray-900');
      elevatorAvailable = target.dataset.value;
    });
  });

  // 4) 제출하기 버튼 클릭 (서버 요청 예시)
  btnSubmit.addEventListener('click', async () => {
    const formData = new FormData();
    formData.append('place_id', currentPlace.id || '');
    formData.append('rampAvailable', rampAvailable);
    formData.append('elevatorAvailable', elevatorAvailable);
    // formData.append('tags', tagsValue); // 태그 입력 UI가 있으면 추가

    try {
      // 실제 API 호출이 준비되어 있다면 이곳에 fetch 작성
      // const res = await fetch(`/api/places/${currentPlace.id}/register`, {
      //   method: 'POST',
      //   body: formData,
      // });
      // if (!res.ok) throw new Error('등록 실패');
      alert('정보가 성공적으로 등록되었습니다.');
      modalWrapper.classList.add('hidden');
    } catch (err) {
      console.error(err);
      alert('정보 등록 중 오류가 발생했습니다.');
    }
  });
}

// 모달 열기: place 데이터를 넘겨받아 currentPlace에 저장 후 보이기
export function openModal(place) {
  currentPlace = place;
  const modalWrapper = document.getElementById('modal-wrapper');

  // (선택) place안에 기존 경사로/승강기 값이 있으면, 토글 버튼 미리 활성화하는 코드 추가 가능
  // 예) if (place.rampAvailable === 'true') { rampToggles[0].click(); } 등

  modalWrapper.classList.remove('hidden');
}
