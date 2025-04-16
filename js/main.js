document.addEventListener('DOMContentLoaded', () => {
  const startTime = Date.now(); // 애니메이션 시작 시각
  const lottieContainer = document.getElementById('lottie-intro');
  const animation = lottie.loadAnimation({
    container: lottieContainer,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'ㅇ.json'
  });

  // overlay 제거 함수
  function removeOverlay() {
    const elapsed = Date.now() - startTime;
    const minDisplayTime = 3000; // 최소 3초 동안 표시 (3000ms)
    const additionalDelay = Math.max(minDisplayTime - elapsed, 0);
    setTimeout(() => {
      lottieContainer.style.transition = 'transform 5s ease, opacity 0.4s ease';
      lottieContainer.style.transform = 'scale(300)';
      lottieContainer.style.opacity = '0';
      setTimeout(() => {
        const introOverlay = document.getElementById('intro-overlay');
        if (introOverlay) introOverlay.remove();
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.style.opacity = '1';
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) heroSlider.style.opacity = '1';
      }, 800);
    }, additionalDelay);
  }

  // 페이지 로드 완료 시 오버레이 제거
  window.addEventListener('load', () => {
    removeOverlay();
  });
  animation.addEventListener('complete', () => {
    if (document.readyState === 'complete') {
      removeOverlay();
    }
  });

  // 슬라이드 자동 fade-in/out via IntersectionObserver
  const slides = document.querySelectorAll('.hero-slide');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.1) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.5 });
  slides.forEach(slide => observer.observe(slide));

  // 슬라이더 드래그 스크롤 기능
  const heroSlider = document.querySelector('.hero-slider');
  let isDown = false;
  let startX;
  let scrollLeft;
  heroSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    heroSlider.classList.add('active');
    startX = e.pageX - heroSlider.offsetLeft;
    scrollLeft = heroSlider.scrollLeft;
  });
  heroSlider.addEventListener('mouseleave', () => {
    isDown = false;
    heroSlider.classList.remove('active');
  });
  heroSlider.addEventListener('mouseup', () => {
    isDown = false;
    heroSlider.classList.remove('active');
  });
  heroSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - heroSlider.offsetLeft;
    const walk = (x - startX) * 2; // 드래그 민감도 조절
    heroSlider.scrollLeft = scrollLeft - walk;
  });
  // 자동 슬라이드 기능 (5초마다 자동 전환)
  let currentSlideIndex = 0;
  const totalSlides = slides.length;
  setInterval(() => {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    heroSlider.scrollTo({
      left: heroSlider.clientWidth * currentSlideIndex,
      behavior: 'smooth'
    });
  }, 5000);
// 공연 일정 섹션과 네비게이션 바 색 반전 (inverted) 효과 적용
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const performanceSection = document.getElementById('performance-schedule');
  const sectionTop = performanceSection.getBoundingClientRect().top;
  // 조건: 공연 일정 섹션의 상단이 80px 이하이면 inverted 효과 적용
  if (sectionTop <= 60) {
    performanceSection.classList.add('inverted');
    if (navbar) navbar.classList.add('inverted');
  } else {
    performanceSection.classList.remove('inverted');
    if (navbar) navbar.classList.remove('inverted');
  }
});
gsap.registerPlugin(ScrollTrigger);
  
// ----- 예시: 모든 .section 요소에 대해 핀 효과 및 배경색 전환 효과 적용 -----
gsap.utils.toArray('.section').forEach(section => {
  gsap.to(section, {
    scrollTrigger: {
      trigger: section,
      start: "top top",         // 섹션의 상단이 뷰포트 상단에 닿을 때 시작
      end: "bottom top",        // 섹션의 하단이 뷰포트 상단에 닿을 때 종료
      pin: true,                // 섹션을 핀(고정) 시키기
      scrub: true               // 스크롤에 애니메이션이 동기화되도록
    },
    backgroundColor: "#000",    // 예시로 배경색을 검은색으로 변경
    ease: "none"
  });
});

gsap.to(".performance-wrapper", {
  scrollTrigger: {
    trigger: "#performance-schedule",  // 공연 일정 섹션 전체를 트리거로 사용
    start: "top top",                  // 섹션 상단이 뷰포트 상단에 도달할 때 시작
    end: () => `+=${document.querySelector(".performance-wrapper").scrollWidth * 2}`, // 전체 가로 이동 거리
    scrub: true,                      // 스크롤에 따라 애니메이션이 부드럽게 진행
    pin: true,                        // 해당 섹션을 스크롤 동안 고정시킴
    markers: true                    // 디버깅용 마커, 필요하면 true로 변경
  },
  x: () => - (document.querySelector(".performance-wrapper").scrollWidth - window.innerWidth),
  ease: "none"
});
});