document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
  
    const boxes = [".time-box", ".place-box", ".schedule-box", ".ticket-box"];
    const sectionLength = 1 / boxes.length + 1;
  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-image-section",
        start: "top top",
        end: "+=4000",
        pin: true,
        scrub: true,
        markers: false,
        onEnter: () => {
          const navbar = document.getElementById("navbar");
          if (navbar) navbar.style.opacity = "0";
        },
        onLeaveBack: () => {
          const navbar = document.getElementById("navbar");
          if (navbar) navbar.style.opacity = "1";
        },
        onLeave: (self) => {
          if (self.direction === 1 && self.trigger.getBoundingClientRect().bottom <= 0) {
            const navbar = document.getElementById("navbar");
            if (navbar) navbar.style.opacity = "1";
          }
        }
      }
    });
  
    // boxes.forEach((box, index) => {
    //   const boxStart = index * sectionLength;
    //   const boxFadeOutStart = boxStart + sectionLength * 0.8;
  
    //   tl.fromTo(box,
    //     { y: 50, opacity: 0 },
    //     { y: 0, opacity: 1, duration: 0.3 },
    //     boxStart
    //   );
  
    //   tl.to(box,
    //     { y: -50, opacity: 0, duration: 0.5 }, // 사라질 때도 부드럽게
    //     boxFadeOutStart
    //   );
    // });
  
    boxes.forEach((box, index) => {
      const boxStart = index * sectionLength;
      const boxFadeOutStart = boxStart + sectionLength * 0.8;
    
      // 모든 박스를 동일한 위치에 절대 배치
      tl.set(box, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }, boxStart);
    
      tl.fromTo(
        box,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        boxStart
      );
    
      tl.to(
        box,
        { opacity: 0, duration: 0.5 },
        boxFadeOutStart
      );
    });

    const navbar = document.getElementById("navbar");
    if (navbar) navbar.style.opacity = "1";
  });
  
    // 드로어 열기
    const menuIcon = document.getElementById("menu-logo");
    const drawerMenu = document.getElementById("drawer-menu");
    if (menuIcon && drawerMenu) {
      menuIcon.addEventListener("click", () => {
        const isOpen = drawerMenu.classList.toggle("open");
        menuIcon.src = isOpen ? "images/close-icon.png" : "images/로고.svg";
      });
    }
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
  