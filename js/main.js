document.addEventListener("DOMContentLoaded", () => {
  const startTime = Date.now(); // 애니메이션 시작 시각
  const lottieContainer = document.getElementById("lottie-intro");
  const animation = lottie.loadAnimation({
    container: lottieContainer,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "ㅇ.json",
  });

  // overlay 제거 함수
  function removeOverlay() {
    const elapsed = Date.now() - startTime;
    const minDisplayTime = 3000; // 최소 3초 동안 표시 (3000ms)
    const additionalDelay = Math.max(minDisplayTime - elapsed, 0);
    setTimeout(() => {
      lottieContainer.style.transition = "transform 5s ease, opacity 0.4s ease";
      lottieContainer.style.transform = "scale(300)";
      lottieContainer.style.opacity = "0";
      setTimeout(() => {
        const introOverlay = document.getElementById("intro-overlay");
        if (introOverlay) introOverlay.remove();
        const navbar = document.getElementById("navbar");
        if (navbar) navbar.style.opacity = "1";
        const heroSlider = document.querySelector(".hero-slider");
        if (heroSlider) heroSlider.style.opacity = "1";
      }, 800);
    }, additionalDelay);
  }

  // 페이지 로드 완료 시 오버레이 제거
  window.addEventListener("load", () => {
    removeOverlay();
  });
  animation.addEventListener("complete", () => {
    if (document.readyState === "complete") {
      removeOverlay();
    }
  });

  // 슬라이드 자동 fade-in/out via IntersectionObserver
  const slides = document.querySelectorAll(".hero-slide");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.1) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    { threshold: 0.5 }
  );
  slides.forEach((slide) => observer.observe(slide));

  // 슬라이더 드래그 스크롤 기능
  const heroSlider = document.querySelector(".hero-slider");
  let isDown = false;
  let startX;
  let scrollLeft;
  heroSlider.addEventListener("mousedown", (e) => {
    isDown = true;
    heroSlider.classList.add("active");
    startX = e.pageX - heroSlider.offsetLeft;
    scrollLeft = heroSlider.scrollLeft;
  });
  heroSlider.addEventListener("mouseleave", () => {
    isDown = false;
    heroSlider.classList.remove("active");
  });
  heroSlider.addEventListener("mouseup", () => {
    isDown = false;
    heroSlider.classList.remove("active");
  });
  heroSlider.addEventListener("mousemove", (e) => {
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
      behavior: "smooth",
    });
  }, 5000);
  // 공연 일정 섹션과 네비게이션 바 색 반전 (inverted) 효과 적용
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    const performanceSection = document.getElementById("performance-schedule");
    const eventSection = document.getElementById("event");

    // 각 섹션의 뷰포트 상단에서의 위치를 계산
    const perfTop = performanceSection.getBoundingClientRect().top;
    const eventTop = eventSection.getBoundingClientRect().top;

    // 만약 이벤트 섹션이 화면 상단에 가까워지면(예: 80% 뷰포트 높이 이하) 네비바만 원상태(반전 없음)로 변경
    if (eventTop <= window.innerHeight * 0.8) {
      if (navbar) navbar.classList.remove("inverted");
    } else if (perfTop <= 60) {
      // 이벤트 섹션에 도달하기 전에는 공연 일정 섹션 기준으로 inverted 적용
      if (performanceSection) performanceSection.classList.add("inverted");
      if (navbar) navbar.classList.add("inverted");
    } else {
      if (performanceSection) performanceSection.classList.remove("inverted");
      if (navbar) navbar.classList.remove("inverted");
    }
  });
  gsap.registerPlugin(ScrollTrigger);

  const perfSection = document.getElementById("performance-schedule");
  const wrapper = document.querySelector(".performance-wrapper");
  const scrollWidth = wrapper.scrollWidth - window.innerWidth;
  gsap.to(wrapper, {
    x: -scrollWidth,
    ease: "none",
    scrollTrigger: {
      trigger: perfSection,
      start: "top top", // section top pins at viewport top
      end: "bottom", // end pin exactly at that moment
      scrub: true,
      end: () => `+=${scrollWidth}`,
      // 바로 이렇게 바꿔주면 placeholder 높이(=end-start)도 scrollWidth 만큼 확보돼서
      // horizontalScrollLength 만큼 스크롤해도 빈 공간이 생기지 않아요.
      endTrigger: "#event",
      pinSpacing: true, // placeholder 유지
      pin: true, // keep section fixed during scroll
      anticipatePin: 1,
      markers: true, // 디버깅용, 테스트 후 제거 가능
      invalidateOnRefresh: true, // recalc on resize
    },
  });

  let tlEvent = gsap.timeline({
    scrollTrigger: {
      trigger: "#event", // 이벤트 섹션을 기준으로 함
      start: "top 20%",
      end: "bottom 25%",
      pin: true, // 섹션을 스크롤 동안 고정
      scrub: true,
      markers: false, // 디버깅용, 테스트 후 제거 가능
    },
  });

  // 이벤트 텍스트 애니메이션: 이벤트 텍스트가 위로 이동, 축소 및 변화
  tlEvent.to(
    ".eventpage-text h2",
    {
      x: 90,
      y: -300,
      scale: 0.2,
      opacity: 1,
      ease: "power2.out",
      onStart: () => {
        const h2 = document.querySelector(".eventpage-text h2");
        if (h2 && !h2.classList.contains("condensed")) {
          h2.innerHTML = "이벤트&소식";
          h2.classList.add("condensed");
        }
      },
      onReverseComplete: () => {
        const h2 = document.querySelector(".eventpage-text h2");
        if (h2 && h2.classList.contains("condensed")) {
          h2.innerHTML = "이벤트<br>&<br>소식";
          h2.classList.remove("condensed");
        }
      },
    },
    0
  );

  // 이벤트 아이템 애니메이션: 이제 fromTo()를 사용해서, 이벤트 아이템들이
  // 초기에는 약간 위쪽에 위치한 상태로 시작(예: y: 150)하고, 스크롤에 따라 제자리(0)로 이동하도록 설정.
  tlEvent.fromTo(
    ".event-item",
    { x: 0, y: 150, opacity: 0 }, // 초기 상태: 약간 위에서부터(혹은 아래에서, 원하는 효과에 따라 조정) 시작, 불투명도 0
    {
      x: 0,
      y: -550,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
    },
    0.1 // 타임라인상 이벤트 텍스트 애니메이션 후에 조금 딜레이해서 시작
  );

  // 드로어 메뉴 토글
  const menuIcon = document.getElementById("menu-logo");
  const drawerMenu = document.getElementById("drawer-menu");
  menuIcon.addEventListener("click", () => {
    // drawer open/close
    const isOpen = drawerMenu.classList.toggle("open");
    // 메뉴 아이콘 변경: 닫기 아이콘을 사용하려면 해당 경로로 바꿔주세요
    menuIcon.src = isOpen ? "images/close-icon.png" : "images/로고.svg";
  });
});
