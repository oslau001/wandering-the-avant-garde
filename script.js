function resizeTextBlocks() {
  const textBlocks = document.querySelectorAll(".text-block");

  const styles = getComputedStyle(document.documentElement);
  const columnWidth = parseFloat(styles.getPropertyValue("--column-width"));
  const columnGap = parseFloat(styles.getPropertyValue("--column-gap"));
  const pagePadding = parseFloat(styles.getPropertyValue("--page-padding"));

  textBlocks.forEach((textBlock) => {
    const essay = textBlock.querySelector(".essay");
    if (!essay) return;

    if (window.innerWidth <= 768) {
      textBlock.style.width = "";
      essay.style.columnCount = "";
      return;
    }

    let columns = 1;

    while (columns < 20) {
      const contentWidth =
        columns * columnWidth + (columns - 1) * columnGap;

      const totalWidth = contentWidth + pagePadding * 2;

      textBlock.style.width = totalWidth + "px";
      essay.style.columnCount = columns;

      if (essay.scrollHeight <= essay.clientHeight + 1) {
        break;
      }

      columns++;
    }
  });
}

window.addEventListener("load", resizeTextBlocks);
window.addEventListener("resize", resizeTextBlocks);


/* ==========================================================
   SCROLL ANIMATION
========================================================== */

const track = document.querySelector(".track");

function animateTrackTo(end) {
  if (!track) return;

  const start = track.scrollLeft;
  const distance = Math.abs(end - start);

  const duration = Math.min(
    2400,
    Math.max(500, distance * 1)
  );

  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = easeInOutCubic(progress);

    track.scrollLeft = start + (end - start) * eased;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}


/* ==========================================================
   ANCHOR LINKS
========================================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    if (window.innerWidth <= 768) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    animateTrackTo(target.offsetLeft);
  });
});


/* ==========================================================
   KEYBOARD NAVIGATION
========================================================== */

document.addEventListener("keydown", (e) => {
  if (window.innerWidth <= 768) return;
  if (!track) return;

  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

  e.preventDefault();

  const textBlocks = Array.from(document.querySelectorAll(".text-block"));
  if (textBlocks.length === 0) return;

  const currentScroll = track.scrollLeft;

  let currentIndex = textBlocks.findIndex((block, index) => {
    const nextBlock = textBlocks[index + 1];

    if (!nextBlock) {
      return currentScroll >= block.offsetLeft;
    }

    return currentScroll >= block.offsetLeft &&
           currentScroll < nextBlock.offsetLeft;
  });

  if (currentIndex === -1) currentIndex = 0;

  let targetIndex = currentIndex;

  if (e.key === "ArrowRight") {
    targetIndex = Math.min(currentIndex + 1, textBlocks.length - 1);
  }

  if (e.key === "ArrowLeft") {
    targetIndex = Math.max(currentIndex - 1, 0);
  }

  const target = textBlocks[targetIndex];

  animateTrackTo(target.offsetLeft);
});