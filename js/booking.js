// js/booking.js
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
  });