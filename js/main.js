document.addEventListener('DOMContentLoaded', () => {
    // Lottie 애니메이션 로드
    const lottieContainer = document.getElementById('lottie-intro');
    const animation = lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'ㅇ.json' // 애니메이션 JSON 파일 경로
    });
  
    // 애니메이션 완료 후 효과 적용
    animation.addEventListener('complete', () => {
      lottieContainer.style.transition = 'transform 4s ease, opacity 0.8s ease';
      lottieContainer.style.transform = 'scale(100)';
      lottieContainer.style.opacity = '0';
  
      setTimeout(() => {
        const introOverlay = document.getElementById('intro-overlay');
        if (introOverlay) introOverlay.remove();
        
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.style.display = 'flex';
      }, 800);
    });
  
    // 스크롤에 따른 네비게이션 바 스타일 변경
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      const icons = document.querySelectorAll('#navbar img');
  
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
        icons.forEach(icon => icon.classList.add('scrolled'));
      } else {
        navbar.classList.remove('scrolled');
        icons.forEach(icon => icon.classList.remove('scrolled'));
      }
    });
  });