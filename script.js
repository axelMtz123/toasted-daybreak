gsap.registerPlugin(Flip, ScrollTrigger, Observer);

/* --- Smooth Scroll --- */
const lenis = new Lenis({
  anchors: false,
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

const sectionNav = document.querySelector("header nav");
const sectionContent = document.querySelector("main");
let sectionFade;

sectionNav.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');

  if (
    !link ||
    event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
  ) return;

  const hash = link.getAttribute("href");
  const section = document.getElementById(hash.slice(1));

  if (!section) return;

  event.preventDefault();
  if (sectionFade?.isActive()) return;

  sectionFade = gsap.timeline()
    .to(sectionContent, {
      opacity: 0,
      duration: .1,
      ease: "power1.in"
    })
    .call(() => {
      lenis.scrollTo(section, { immediate: true });

      if (location.hash !== hash) {
        history.pushState(null, "", hash);
      }
    })
    .to(sectionContent, {
      opacity: 1,
      duration: 0.28,
      ease: "power1.out",
      clearProps: "opacity"
    });
});

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

const smoothScroll = new Lenis({syncTouch: false});

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
      rotation: 30,
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

/* -- image --*/

const revealMedia = gsap.matchMedia();

revealMedia.add(
  {
    desktop: "(min-width: 901px)",
    mobile: "(max-width: 900px)"
  },
  (context) => {
    const isMobile = context.conditions.mobile;

    const imageRevealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".image-reveal",
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    imageRevealTimeline
    .to(".reveal-image", {
      width: isMobile ? "100%" : "45%",
      height: isMobile ? "100%" : "140%",
      duration: 1,
      ease: "none",
      rotate: isMobile ? "0deg" : "90deg",
    })
    .fromTo(".reveal-title",
      {
        autoAlpha: 0,
        y: 40
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        ease: "none"
      },
      "-=0.15"
    )
    .to({}, { duration: 0.25 });
  }
);

const themeMedia = gsap.matchMedia();

themeMedia.add(
  {
    desktop: "(min-width: 901px)",
    mobile: "(max-width: 900px)"
  },
  (context) => {
    const isMobile = context.conditions.mobile;
    const themeRoot = document.body;

    const originalGreen = themeRoot.classList.contains("theme-green");
    const originalCream = themeRoot.classList.contains("theme-cream");

    function setGreenTheme(isGreen) {
      themeRoot.classList.toggle("theme-green", isGreen);
      themeRoot.classList.toggle("theme-cream", !isGreen);
    }

    const themeTrigger = ScrollTrigger.create({
      trigger: ".image-reveal",
      start: isMobile ? "bottom bottom" : "bottom bottom",

      onEnter: () => setGreenTheme(true),
      onLeaveBack: () => setGreenTheme(false),

      onRefresh: (self) => {
        setGreenTheme(self.scroll() >= self.start);
      }
    });

    setGreenTheme(themeTrigger.scroll() >= themeTrigger.start);

    return () => {
      themeRoot.classList.toggle("theme-green", originalGreen);
      themeRoot.classList.toggle("theme-cream", originalCream);
    };
  }
);

/* -- contact form -- */

const socialMarquee = document.querySelector(".social-marquee");
const socialMarqueeTrack = socialMarquee.querySelector(".marquee-track");
const socialMarqueeItems = [...socialMarqueeTrack.children];

let socialMarqueeTween;
let socialMarqueeResizeTimer;
let socialMarqueeWidth = window.innerWidth;

function buildSocialMarquee() {
  socialMarqueeTween?.kill();
  gsap.set(socialMarqueeTrack, { x: 0 });

  [...socialMarqueeTrack.children].forEach((item) => {
    if (!socialMarqueeItems.includes(item)) {
      item.remove();
    }
  });

  const socialMarqueeGap =
    parseFloat(getComputedStyle(socialMarqueeTrack).columnGap) || 0;

  const socialMarqueeLoopWidth =
    socialMarqueeTrack.getBoundingClientRect().width + socialMarqueeGap;

  if (!socialMarqueeLoopWidth) return;

  const socialMarqueeCopies = Math.ceil(
    socialMarquee.clientWidth / socialMarqueeLoopWidth
  );

  for (let copy = 0; copy < socialMarqueeCopies; copy++) {
    socialMarqueeItems.forEach((item) => {
      const clone = item.cloneNode(true);

      clone.setAttribute("aria-hidden", "true");
      socialMarqueeTrack.append(clone);
    });
  }

  socialMarqueeTween = gsap.to(socialMarqueeTrack, {
    x: -socialMarqueeLoopWidth,
    duration: socialMarqueeLoopWidth / 60,
    ease: "none",
    repeat: -1
  });
}

document.fonts.ready.then(buildSocialMarquee);

window.addEventListener("resize", () => {
  if (window.innerWidth === socialMarqueeWidth) return;

  socialMarqueeWidth = window.innerWidth;

  clearTimeout(socialMarqueeResizeTimer);
  socialMarqueeResizeTimer = setTimeout(buildSocialMarquee, 150);
});

socialMarquee.addEventListener("mouseenter", () => {
  socialMarqueeTween?.pause();
});

socialMarquee.addEventListener("mouseleave", () => {
  socialMarqueeTween?.resume();
});

/* -- footer -- */

const footerElement = document.querySelector("footer");
const footerTitleElement = footerElement?.querySelector("h2");

if (footerTitleElement) {
  const footerMedia = gsap.matchMedia();

  footerMedia.add(
    {
      desktop: "(width > 900px)",
      mobile: "(width <= 900px)"
    },
    ({ conditions }) => {
      const footerTitleSplit = new SplitType(footerTitleElement, {
        types: "chars"
      });

      gsap.fromTo(
        footerTitleSplit.chars,
        { autoAlpha: 0, yPercent: 100 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          stagger: 0.03,
          delay: .7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "footer",
            start: conditions.mobile ? "top top+=100%" : "top top+=50%",
          }
        }
      );

      return () => footerTitleSplit.revert();
    }
  );
}