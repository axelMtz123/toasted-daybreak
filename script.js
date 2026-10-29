gsap.registerPlugin(Flip, ScrollTrigger, Observer);

/* --- Smooth Scroll --- */
const lenis = new Lenis({
  anchors: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* --- Refresh Layout --- */
window.addEventListener('load', () => {
  lenis.resize();
  ScrollTrigger.refresh();
});

document.fonts.ready.then(() => {
  lenis.resize();
  ScrollTrigger.refresh();
});

/* --- Page Animations --- */


/* -- menu -- */

const toastButton = document.querySelector('.nav-button-wrapper');
const toastImage = document.querySelector('.nav-button-wrapper img');

const preload = new Image();
preload.src = "/assets/toast-bite.png";

toastButton.addEventListener("mouseenter", () => {
  toastImage.src = "/assets/toast-bite.png";
});

toastButton.addEventListener("mouseleave", () => {
  toastImage.src = "/assets/toast-full.png";
});

const menu = document.querySelector(".menu");
const rows = [...menu.querySelectorAll(".row")];
const cells = [...menu.querySelectorAll(".cell")];
const currentPage = menu.querySelector(".active-page");
const mobileMenu = window.matchMedia("(max-width: 900px)");

let hoveredCell = null;

// Mobile uses a separate name next to the Roman numeral

function updateMenu() {
  const selectedCell = hoveredCell ?? currentPage;
  const selectedRow = selectedCell.closest(".row");
  const rowCells = [...selectedRow.querySelectorAll(".cell")];
  const selectedColumn = rowCells.indexOf(selectedCell);

  rows.forEach((row) => {
    row.classList.toggle("active-row", row === selectedRow);

    row.querySelectorAll(".cell").forEach((cell, index) => {
      cell.classList.toggle("active-col", index === selectedColumn);
    });
  });

  cells.forEach((cell) => {
    cell.querySelector(".label").classList.toggle(
      "label-visible",
      cell === selectedCell
    );
  });
}

menu.addEventListener("mouseenter", () => {
  if (mobileMenu.matches) return;

  menu.classList.remove("collapsed");
});

menu.addEventListener("mouseleave", () => {
  if (mobileMenu.matches) return;

  menu.classList.add("collapsed");
  hoveredCell = null;
  updateMenu();
});

cells.forEach((cell) => {
  cell.addEventListener("mouseenter", () => {
    if (mobileMenu.matches) return;

    hoveredCell = cell;
    updateMenu();
  });

  cell.addEventListener("mouseleave", () => {
    if (mobileMenu.matches) return;

    hoveredCell = null;
    updateMenu();
  });
});

// Reset the desktop state when crossing the breakpoint
mobileMenu.addEventListener("change", () => {
  hoveredCell = null;
  menu.classList.add("collapsed");
  updateMenu();
});

updateMenu();

/* --- hero --- */

const heroImg = document.querySelector("#hero .img-wrapper img");
const heroImgWrapper = document.querySelector("#hero .img-wrapper");

let showingSecondImage = false;

heroImgWrapper.addEventListener("mouseenter", () => {
  showingSecondImage = !showingSecondImage;

  const nextSrc = showingSecondImage
    ? "/assets/hero-img2.png"
    : "/assets/hero-img (1).png";

  gsap.killTweensOf(heroImg);

  gsap.to(heroImg, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      heroImg.src = nextSrc;

      gsap.to(heroImg, {
        opacity: 1,
        duration: 0.5
      });
    }
  });
});

gsap.to("#hero .img-wrapper", {
  yPercent: -20,
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
})

/* -- about -- */

gsap.to ("#about .img-wrapper", {
  yPercent: -50,
  scrollTrigger: {
    trigger: "#about",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  }
})

/* -- Smooth scrolling -- */

gsap.registerPlugin(ScrollTrigger);

const smoothScroll = new Lenis();

smoothScroll.on("scroll", ScrollTrigger.update);

function updateSmoothScroll(time) {
  smoothScroll.raf(time * 1000);
}

gsap.ticker.add(updateSmoothScroll);
gsap.ticker.lagSmoothing(0);


/* -- Toast marquee -- */

const toastMarquee = document.querySelector(".toast-marquee");
const toastMarqueeTrack = toastMarquee.querySelector(".marquee-track");
const toastMarqueeItems = [...toastMarqueeTrack.children];

let toastMarqueeTween;
let toastMarqueeResizeTimer;

async function setupToastMarquee() {
  await Promise.all(
    toastMarqueeItems.map((item) => {
      const image = item.querySelector("img");

      if (image.complete) return Promise.resolve();

      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    })
  );

  function buildToastMarquee() {
    toastMarqueeTween?.kill();
    gsap.set(toastMarqueeTrack, { x: 0 });

    // Remove copies from the previous build
    [...toastMarqueeTrack.children].forEach((item) => {
      if (!toastMarqueeItems.includes(item)) {
        item.remove();
      }
    });

    const gap =
      parseFloat(getComputedStyle(toastMarqueeTrack).columnGap) || 0;

    const loopWidth =
      toastMarqueeTrack.getBoundingClientRect().width + gap;

    if (!loopWidth) return;

    const copyCount = Math.ceil(
      toastMarquee.clientWidth / loopWidth
    );

    for (let copy = 0; copy < copyCount; copy++) {
      toastMarqueeItems.forEach((item) => {
        const clone = item.cloneNode(true);

        clone.setAttribute("aria-hidden", "true");
        toastMarqueeTrack.append(clone);
      });
    }

    toastMarqueeTween = gsap.to(toastMarqueeTrack, {
      x: -loopWidth,
      duration: loopWidth / 60,
      ease: "none",
      repeat: -1
    });
  }

  buildToastMarquee();
  ScrollTrigger.refresh();

  window.addEventListener("resize", () => {
    clearTimeout(toastMarqueeResizeTimer);

    toastMarqueeResizeTimer = setTimeout(() => {
      buildToastMarquee();
      ScrollTrigger.refresh();
    }, 150);
  });
}


/* -- Cup movement -- */

const movingCup = document.querySelector(".moving-cup-wrapper");
const movingCupImage = movingCup.querySelector("img");
const cupStartContainer = document.querySelector(".coffee-menu");

function getCupPosition() {
  const start = cupStartContainer.getBoundingClientRect();
  const destination = toastMarquee.getBoundingClientRect();

  const startX = start.left + start.width / 2;
  const startY = start.top + movingCup.offsetHeight / 2;

  const destinationX = destination.left + destination.width / 2;
  const destinationY =
    destination.top + toastMarqueeTrack.offsetHeight / 2;

  return {
    x: destinationX - startX,
    y: destinationY - startY
  };
}

const cupMedia = gsap.matchMedia();

cupMedia.add(
  {
    desktop: "(min-width: 901px)",
    mobile: "(max-width: 900px)"
  },
  (context) => {
    const isMobile = context.conditions.mobile;

    const cupTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: toastMarquee,
        start: "clamp(center 55%)",
        end: () => `+=${Math.round(
          window.innerHeight * (isMobile ? 0.65 : 0.9)
        )}`,
        pin: "#menu",
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1.2,
        invalidateOnRefresh: true,
      }
    });

    cupTimeline.to(movingCup, {
      x: () => getCupPosition().x,
      y: () => getCupPosition().y,
      ease: "none"
    }, 0);

    cupTimeline.to(movingCupImage, {
      rotation: isMobile ? 18 : 30,
      ease: "none"
    }, 0);
  }
);
setupToastMarquee();

if (document.readyState === "complete") {
  ScrollTrigger.refresh();
} else {
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  }, { once: true });
}

const coffeeMenuButton = document.querySelector(".coffee-menu-button");
const coffeeMenuButtonFace = coffeeMenuButton.querySelector("span");

function spinCoffeeMenuButton() {
  gsap.to(coffeeMenuButtonFace, {
    rotation: "+=720",
    duration: 1.4,
    ease: "power3.out",
    overwrite: true
  });
}

coffeeMenuButton.addEventListener("mouseenter", spinCoffeeMenuButton);
coffeeMenuButton.addEventListener("focus", spinCoffeeMenuButton);