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