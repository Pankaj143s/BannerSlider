/***********************************************
 * 4 distinct slider states:
 * 0 => Slide 1 (full screen banner)
 * 1 => Slide 2 (full screen banner)
 * 2 => Slide 3 (initial overlay; video hidden)
 * 3 => Slide 3 (video state; video visible)
 *
 * Once state 3 is reached, if the user scrolls forward (wheel down),
 * the slider stops intercepting scroll events and the page scrolls normally.
 *
 * Mobile touch events are added for vertical swipe navigation.
 ***********************************************/

let globalIndex = 0; // ranges from 0 to 3

// DOM references
const slidesTrack = document.getElementById('slidesTrack');
const slide2 = document.getElementById('slide2');
const slide3 = document.getElementById('slide3');
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');
const sliderWrapper = document.getElementById('mySliderWrapper');

// Video overlay elements
const videoSlider = document.getElementById('videoSlider');
const videoSlide = document.getElementById('videoSlide');
const tickVideo = document.getElementById('tickVideo');
const repellentAll = document.getElementById('repellentAll');
const repellentText2 = document.getElementById('repellentText2');
const repellentCount = document.getElementById('repellentCount');

let hasVideoPlayed = false;

/* Main navigation function */
function goToIndex(newIndex) {
  // Clamp newIndex between 0 and 3
  if (newIndex < 0) newIndex = 0;
  if (newIndex > 3) newIndex = 3;
  globalIndex = newIndex;

  if (globalIndex < 2) {
    // States 0 and 1: Show Slide 1 or Slide 2 in the horizontal track
    slidesTrack.style.transform = `translateX(-${globalIndex * 100}vw)`;
    slide2.classList.remove('blur');
    slide3.classList.remove('active');
    // Hide video overlay UI
    videoSlider.classList.remove('active');
    videoSlide.classList.remove('active');
  } else {
    // States 2 and 3: Display Slide 3 overlay on top of blurred Slide 2
    slidesTrack.style.transform = 'translateX(-100vw)'; // keep Slide 2 in background
    slide2.classList.add('blur');
    slide3.classList.add('active');
    if (globalIndex === 2) {
      // Initial overlay state: hide video UI
      videoSlider.classList.remove('active');
      videoSlide.classList.remove('active');
    } else if (globalIndex === 3) {
      // Video state: show video UI
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

/* Arrow navigation */
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

/* --------------------------------------------
   WHEEL navigation => throttle for better UX
-------------------------------------------- */
let isScrolling = false;

sliderWrapper.addEventListener(
  'wheel',
  (e) => {
    // If we are already processing a scroll, ignore additional attempts
    if (isScrolling) {
      e.preventDefault();
      return;
    }

    // If on the last slide (3) and scrolling down => let page scroll
    if (globalIndex === 3 && e.deltaY > 0) {
      return; // let the default scroll happen
    }

    // Decide if scrolling up or down
    if (e.deltaY > 0) {
      // scrolling down
      if (globalIndex < 3) {
        goToIndex(globalIndex + 1);
        e.preventDefault(); // intercept slide change
      }
    } else if (e.deltaY < 0) {
      // scrolling up
      if (globalIndex > 0) {
        goToIndex(globalIndex - 1);
        e.preventDefault(); // intercept slide change
      }
    }

    // Lock wheel events for ~900ms, matching 0.8s transition
    if ((e.deltaY > 0 && globalIndex <= 3) || (e.deltaY < 0 && globalIndex >= 0)) {
      isScrolling = true;
      setTimeout(() => {
        isScrolling = false;
      }, 900);
    }
  },
  { passive: false }
);

/* Touch events for mobile vertical swipes */
let touchStartY = 0;
let touchEndY = 0;
const swipeThreshold = 50; // Minimum distance in px

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
    const diff = touchStartY - touchEndY; // positive => swipe up
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe up => forward
        if (globalIndex < 3) {
          goToIndex(globalIndex + 1);
          e.preventDefault();
        }
        // else let page scroll
      } else {
        // Swipe down => backward
        if (globalIndex > 0) {
          goToIndex(globalIndex - 1);
          e.preventDefault();
        }
      }
    }
  },
  { passive: false }
);

/* VIDEO logic => animate in, play, then reveal text */
function slideInAndPlayVideo() {
  tickVideo.classList.remove('active-video', 'dimmed');
  // force reflow
  void tickVideo.offsetWidth;

  // Zoom in the video
  setTimeout(() => {
    tickVideo.classList.add('active-video');
  }, 100);

  // Actually play the video
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
  // Once the video is fully dimmed, show the final text
  if (e.propertyName === 'transform' && tickVideo.classList.contains('dimmed')) {
    tickVideo.removeEventListener('transitionend', onVideoTransitionEnd);

    // Expand the white panel
    repellentAll.classList.add('expanded');

    // Fade in the text after a short delay
    setTimeout(() => {
      repellentText2.style.opacity = '1';
    }, 600);

    // Show "95%" in red
    repellentCount.style.opacity = '1';
    repellentCount.style.color = 'red';
    repellentCount.textContent = '95%';
  }
}

/* INIT => show Slide1 */
goToIndex(0);
