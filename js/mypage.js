document.addEventListener('DOMContentLoaded', () => {
    const reservationList = document.getElementById('reservation-list');
  
    const reservations = [
      {
        title: '동방미래특급',
        date: '2025.05.03 (토) 17:00',
        seat: 'A12',
        status: '예매완료'
      },
      {
        title: '클래식 나잇',
        date: '2025.04.10 (수) 19:30',
        seat: 'C3',
        status: '취소'
      }
    ];
  
    reservations.forEach(res => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div><strong>공연:</strong> ${res.title}</div>
        <div><strong>일시:</strong> ${res.date}</div>
        <div><strong>좌석:</strong> ${res.seat}</div>
        <div class="status"><strong>상태:</strong> ${res.status}</div>
      `;
      reservationList.appendChild(li);
    });
  });