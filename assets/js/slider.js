let items = [];
let index = 0;
let autoplay = false;
let autoplayInterval = null;

let touchStartX = 0;
let touchEndX = 0;
let lastTap = 0;

let isAnimating = false;

/* ---------------- INIT ---------------- */
function initSlider(data) {
  items = data;
  index = 0;
  render("fade");

  // keyboard arrows
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") next(true);
    if (e.key === "ArrowLeft") prev(true);
    if (e.key === " ") toggleAutoplay();
  });

  // touch start
  document.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  // swipe + double tap
  document.addEventListener("touchend", e => {
    const target = e.target;

    const isUI = target.classList.contains("ui-element");

    // Swipe detection
    touchEndX = e.changedTouches[0].screenX;
    let diff = touchEndX - touchStartX;

    if (diff > 50) prev(true);
    else if (diff < -50) next(true);

    // Double tap only on image/video (NOT UI)
    const now = Date.now();
    if (!isUI && now - lastTap < 300) toggleAutoplay();
    lastTap = now;
  });
}

/* ---------------- ORIENTATION HANDLER ---------------- */
function applyOrientation(el) {
  const apply = (w, h) => {
    el.classList.remove("slider-horizontal", "slider-vertical");

    if (w > h) {
      // horizontal => fullscreen cover
      el.classList.add("slider-horizontal");
    } else {
      // vertical => fit height center
      el.classList.add("slider-vertical");
    }
  };

  if (el.tagName === "IMG") {
    el.onload = () => apply(el.naturalWidth, el.naturalHeight);
  }

  if (el.tagName === "VIDEO") {
    el.addEventListener("loadedmetadata", () => {
      apply(el.videoWidth, el.videoHeight);
    });
  }
}

/* ---------------- RENDER ---------------- */
function render(animation = "fade") {
  const container = document.getElementById("sliderContainer");
  container.innerHTML = "";

  const item = items[index];
  let el;

  if (item.type === "video") {
    el = document.createElement("video");
    el.src = item.src;
    el.autoplay = true;
    el.loop = true;
    el.muted = true;
  } else {
    el = document.createElement("img");
    el.src = item.src;
  }

  if (animation) el.classList.add(animation);

  applyOrientation(el);

  el.addEventListener("animationend", () => {
    isAnimating = false;
  });

  container.appendChild(el);
}

/* ---------------- PAGINATION ---------------- */
function next(fromUI = false) {
  if (isAnimating && !fromUI) return;
  isAnimating = true;

  index = (index + 1) % items.length;
  render("slide-next");
}

function prev(fromUI = false) {
  if (isAnimating && !fromUI) return;
  isAnimating = true;

  index = (index - 1 + items.length) % items.length;
  render("slide-prev");
}

/* ---------------- AUTOPLAY ---------------- */
function toggleAutoplay() {
  autoplay = !autoplay;

  document.getElementById("autoplayBtn").textContent =
    autoplay ? "⇒" : "⇒̶";

  if (autoplay) {
    autoplayInterval = setInterval(() => next(false), 4000);
  } else {
    clearInterval(autoplayInterval);
  }
}
