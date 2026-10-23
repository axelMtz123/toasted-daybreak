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
