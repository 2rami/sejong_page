document.addEventListener('DOMContentLoaded', function() {
    const seatSelect = document.getElementById('seat-select');
    const quantityInput = document.getElementById('quantity');
    const totalPriceEl = document.getElementById('total-price');
    const form = document.getElementById('booking-form');

    function updateTotal() {
      const price = parseInt(seatSelect.selectedOptions[0].dataset.price, 10);
      const qty = parseInt(quantityInput.value, 10);
      const total = price * qty;
      totalPriceEl.textContent = total.toLocaleString();
    }

    seatSelect.addEventListener('change', updateTotal);
    quantityInput.addEventListener('input', updateTotal);

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('예매가 완료되었습니다! 감사합니다.');
      // 실제 결제 처리 로직을 여기로 연결하세요.
    });

    updateTotal();

    const overlay = document.getElementById('booking-overlay');
    const triggerBtn = document.getElementById('open-booking');

    triggerBtn.addEventListener('click', () => {
      overlay.classList.remove('hidden');
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });

    const seatMapContainer = document.querySelector('.seat-map');
    const seatInput = document.getElementById('selected-seat');
    const rows = 'ABCDEFGHIJ';

    for (let r = 0; r < rows.length; r++) {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('seat-row');
      for (let s = 1; s <= 20; s++) {
        const seat = document.createElement('span');
        seat.classList.add('seat');
        seat.dataset.seat = `${rows[r]}${s}`;
        rowDiv.appendChild(seat);
      }
      seatMapContainer.appendChild(rowDiv);
    }

    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
      seat.addEventListener('click', () => {
        seats.forEach(s => s.classList.remove('selected'));
        seat.classList.add('selected');
        seatInput.value = seat.dataset.seat;
      });
    });
  });