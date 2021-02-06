const slider = document.querySelector('.slider-container');
const slides = Array.from(document.querySelectorAll('.slide'));

// States or Global Variables
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;

// Functions
const touchStart = (index) => {
  return (e) => {
    currentIndex = index;
    startPos = getPositionX(e);
    isDragging = true;

    animationID = requestAnimationFrame(animation);
    slider.classList.add('grabbing');
  };
};

const touchEnd = () => {
  isDragging = false;
  cancelAnimationFrame(animationID);
  slider.classList.remove('grabbing');

  const movedBy = currentTranslate - prevTranslate;
  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  }
  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }

  setPositionByIndex();
};

const touchMove = (e) => {
  if (isDragging) {
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
};

const getPositionX = (e) => {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
};

const setSliderPosition = () => {
  slider.style.transform = `translateX(${currentTranslate}px)`;
};

const setPositionByIndex = () => {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
};

const animation = () => {
  setSliderPosition();
  if (isDragging) {
    requestAnimationFrame(animation);
  }
};

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img');
  slideImage.addEventListener('dragstart', (e) => e.preventDefault());

  // Touch Events
  slide.addEventListener('touchstart', touchStart(index));
  slide.addEventListener('touchend', touchEnd);
  slide.addEventListener('touchmove', touchMove);

  // Mouse Events
  slide.addEventListener('mousedown', touchStart(index));
  slide.addEventListener('mouseup', touchEnd);
  slide.addEventListener('mouseleave', touchEnd);
  slide.addEventListener('mousemove', touchMove);
});

// Disable context menu
// Do not let create menu by right clicking
window.oncontextmenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};
