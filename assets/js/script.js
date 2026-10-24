'use strict';

/**
 * PRELOAD
 */
const preloader = document.querySelector("[data-preload]"); // تأكد أن الاسم مطابق للـ HTML

window.addEventListener("load", function () {
  if (preloader) preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

/**
 * add event listener on multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  if (!elements) return;
  for (let i = 0, len = elements.length; i < len; i++) {
    if (elements[i]) elements[i].addEventListener(eventType, callback);
  }
}

/**
 * NAVBAR
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  if (navbar) navbar.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);

/**
 * HEADER & BACK TOP BTN
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  if (!header) return;
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (!header || !backTopBtn) return;

  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * HERO SLIDER
 */
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  if (!heroSliderItems.length) return;
  if (lastActiveSliderItem) lastActiveSliderItem.classList.remove("active");
  if (heroSliderItems[currentSlidePos]) {
    heroSliderItems[currentSlidePos].classList.add("active");
    lastActiveSliderItem = heroSliderItems[currentSlidePos];
  }
}

const slideNext = function () {
  if (!heroSliderItems.length) return;
  currentSlidePos = (currentSlidePos >= heroSliderItems.length - 1) ? 0 : currentSlidePos + 1;
  updateSliderPos();
}

if (heroSliderNextBtn) heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (!heroSliderItems.length) return;
  currentSlidePos = (currentSlidePos <= 0) ? heroSliderItems.length - 1 : currentSlidePos - 1;
  updateSliderPos();
}

if (heroSliderPrevBtn) heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */
let autoSlideInterval;

const autoSlide = function () {
  if (!heroSliderItems.length) return;
  autoSlideInterval = setInterval(slideNext, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);

/**
 * PARALLAX EFFECT
 */
const parallaxItems = document.querySelectorAll("[data-parallax-item]");

window.addEventListener("mousemove", function (event) {
  if (!parallaxItems.length) return;

  let x = (event.clientX / window.innerWidth * 10) - 5;
  let y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = -x;
  y = -y;

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    const speed = Number(parallaxItems[i].dataset.parallaxSpeed) || 0;
    parallaxItems[i].style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0px)`;
  }
});
