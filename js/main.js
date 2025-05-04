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
  gsap.registerPlugin(ScrollTrigger);
  // horizontal scroll container and length calculation
  const wrapper = document.querySelector(".performance-wrapper");
  const scrollWidth = wrapper.scrollWidth - window.innerWidth;

  // unified horizontal scroll + inverted toggle
  gsap.to(wrapper, {
    x: -scrollWidth,
    ease: "none",
    scrollTrigger: {
      trigger: "#performance-schedule",
      start: "top top",
      end: () => `+=${scrollWidth}`,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      toggleClass: {
        targets: ["#navbar", "#performance-schedule"],
        className: "inverted"
      },
      markers: true
    }
  });

  let tlEvent = gsap.timeline({
    scrollTrigger: {
      trigger: "#event", // 이벤트 섹션을 기준으로 함
      start: "top 20%",
      end: "bottom 25%",
      pin: true,              // 섹션을 스크롤 동안 고정
      pinSpacing: false,      // 고정 후 placeholder 공간 비활성화
      scrub: true,
      markers: false,         // 디버깅용, 테스트 후 제거 가능
    },
  });

  // 이벤트 텍스트 애니메이션: 이벤트 텍스트가 위로 이동, 축소 및 변화
  tlEvent.to(
    ".eventpage-text h2",
    {
      x: 80,
      y: -250,
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
      y: -400,
      opacity: 1,
      duration: 0.6,
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
  gsap.registerPlugin(ScrollTrigger);

// 모든 메인 아이템

// ─── JS: 클릭 시 열고 닫고, 나머지 흐림/복원 ───
const links = document.querySelectorAll("#drawer-menu-list > li.has-submenu > a");
const list  = document.getElementById("drawer-menu-list");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    // 1) 부모 li를 가져오기
    const li      = link.parentElement;
    // 2) siblings 중 .submenu 선택
    const submenu = li.querySelector(".submenu");
    // 3) open 클래스도 li에 토글
    const isOpen  = li.classList.toggle("open");
    list.classList.toggle("active", isOpen);

    // 4) GSAP 애니메이션 (서브 열기/닫기)
    if (submenu) {
      if (isOpen) {
        gsap.to(submenu, { maxHeight: 500, opacity: 1, duration: 1, ease: "power2.out" });
      } else {
        gsap.to(submenu, { maxHeight:   0, opacity: 0, duration: 1, ease: "power2.in" });
      }
    }
  });
});
});
