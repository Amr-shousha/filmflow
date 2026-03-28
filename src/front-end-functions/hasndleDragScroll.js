// Filename: ../front-end-functions/handleDragScroll.js

export function handleDragScroll(e) {
  const slider = e.currentTarget;
  let isDown = false;
  let startX;
  let scrollLeft;

  const start = (e) => {
    isDown = true;
    slider.classList.add("active-scroll");
    // Calculate initial click position
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  };

  const end = () => {
    isDown = false;
    slider.classList.remove("active-scroll");
  };

  const move = (e) => {
    if (!isDown) return;
    e.preventDefault();
    // Calculate how far the mouse has moved
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Adjust '2' to change scroll sensitivity
    slider.scrollLeft = scrollLeft - walk;
  };

  // Attach listeners to the element
  slider.addEventListener("mousedown", start);
  slider.addEventListener("mouseleave", end);
  slider.addEventListener("mouseup", end);
  slider.addEventListener("mousemove", move);
}
