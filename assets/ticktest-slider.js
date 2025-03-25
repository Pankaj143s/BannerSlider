/***********************************************
 * 4 distinct slider states:
 * 0 => Slide 1 (full screen banner)
 * 1 => Slide 2 (full screen banner)
 * 2 => Slide 3 (initial overlay; video hidden)
 * 3 => Slide 3 (video state; video visible)
 ***********************************************/
let globalIndex = 0;

const slidesTrack = document.getElementById('slidesTrack');
const slide2 = document.getElementById('slide2');
const slide3 = document.getElementById('slide3');
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');
const sliderWrapper = document.getElementById('mySliderWrapper');

// Video elements
const videoSlider = document.getElementById('videoSlider');
const videoSlide = document.getElementById('videoSlide');
const tickVideo = document.getElementById('tickVideo');
const repellentAll = document.getElementById('repellentAll');
const repellentText2 = document.getElementById('repellentText2');
const repellentCount = document.getElementById('repellentCount');

let hasVideoPlayed = false;

function goToIndex(newIndex) {
  if (newIndex < 0) newIndex = 0;
  if (newIndex > 3) newIndex = 3;
  globalIndex = newIndex;

  // Dynamically disable page scrolling on slider area for states 0-2,
  // and allow scrolling only when globalIndex is 3.
  if (globalIndex < 3) {
    sliderWrapper.style.touchAction = 'none';
  } else {
    sliderWrapper.style.touchAction = 'auto';
  }

  if (globalIndex < 2) {
    slidesTrack.style.transform = `translateX(-${globalIndex * 100}vw)`;
    slide2.classList.remove('blur');
    slide3.classList.remove('active');
    videoSlider.classList.remove('active');
    videoSlide.classList.remove('active');
  } else {
    slidesTrack.style.transform = 'translateX(-100vw)';
    slide2.classList.add('blur');
    slide3.classList.add('active');
    if (globalIndex === 2) {
      videoSlider.classList.remove('active');
      videoSlide.classList.remove('active');
    } else if (globalIndex === 3) {
      videoSlider.classList.add('active');
      videoSlide.classList.add('active');
      if (!hasVideoPlayed && tickVideo.currentTime === 0) {
        slideInAndPlayVideo();
      } else {
        tickVideo.play();
      }
    }
  }
}

// ARROW navigation
arrowRight.addEventListener('click', () => {
  if (globalIndex < 3) {
    goToIndex(globalIndex + 1);
  }
});
arrowLeft.addEventListener('click', () => {
  if (globalIndex > 0) {
    goToIndex(globalIndex - 1);
  }
});

// WHEEL navigation
sliderWrapper.addEventListener(
  'wheel',
  (e) => {
    if (globalIndex === 3 && e.deltaY > 0) {
      return; // allow page scroll when at state 3
    }
    if (e.deltaY > 0) {
      if (globalIndex < 3) {
        goToIndex(globalIndex + 1);
        e.preventDefault();
      }
    } else if (e.deltaY < 0) {
      if (globalIndex > 0) {
        goToIndex(globalIndex - 1);
        e.preventDefault();
      }
    }
  },
  { passive: false }
);

// TOUCH events for mobile vertical swipes
let touchStartY = 0;
let touchEndY = 0;
const swipeThreshold = 50; // Minimum distance in pixels

sliderWrapper.addEventListener(
  'touchstart',
  (e) => {
    touchStartY = e.changedTouches[0].clientY;
  },
  { passive: true }
);

sliderWrapper.addEventListener(
  'touchend',
  (e) => {
    touchEndY = e.changedTouches[0].clientY;
    let diff = touchStartY - touchEndY; // positive: swipe up; negative: swipe down
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) { // swipe up => forward
        if (globalIndex < 3) {
          goToIndex(globalIndex + 1);
          e.preventDefault();
        }
      } else { // swipe down => backward
        if (globalIndex > 0) {
          goToIndex(globalIndex - 1);
          e.preventDefault();
        }
      }
    }
  },
  { passive: false }
);

// VIDEO logic
function slideInAndPlayVideo() {
  tickVideo.classList.remove('active-video', 'dimmed');
  void tickVideo.offsetWidth; // force reflow
  setTimeout(() => {
    tickVideo.classList.add('active-video');
  }, 100);
  setTimeout(() => {
    tickVideo.currentTime = 0;
    tickVideo.play();
  }, 1000);
  tickVideo.addEventListener('ended', handleVideoEnded);
}

function handleVideoEnded() {
  hasVideoPlayed = true;
  tickVideo.classList.remove('active-video');
  tickVideo.classList.add('dimmed');
  tickVideo.addEventListener('transitionend', onVideoTransitionEnd);
}

function onVideoTransitionEnd(e) {
  if (e.propertyName === 'transform' && tickVideo.classList.contains('dimmed')) {
    tickVideo.removeEventListener('transitionend', onVideoTransitionEnd);
    repellentAll.classList.add('expanded');
    setTimeout(() => {
      repellentText2.style.opacity = '1';
    }, 600);
    repellentCount.style.opacity = '1';
    repellentCount.style.color = 'red';
    repellentCount.textContent = '95%';
  }
}

// INIT => show Slide 1
goToIndex(0);
