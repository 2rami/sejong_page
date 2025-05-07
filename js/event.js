window.addEventListener('DOMContentLoaded', () => {
    const eventSection = document.querySelector('.event-detail');
    setTimeout(() => {
      eventSection.classList.add('visible');
    }, 200);
  });