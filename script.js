document.addEventListener("DOMContentLoaded", () => {
  const hoverArea = document.getElementById("hover-area");
  const hoverBg = document.getElementById("hover-bg");
  const hoverEye = document.getElementById("hover-eye");

  let targetX = 0, targetY = 0;
  let circleX = 0, circleY = 0;
  let eyeX = 0, eyeY = 0;
  let isHovering = false;

  hoverArea.addEventListener("mouseenter", () => {
    hoverBg.style.opacity = "1";
    hoverEye.style.opacity = "1";

    hoverBg.style.transform = "translate(-50%, -50%) scale(1)";
    hoverEye.style.transform = "translate(-50%, -50%)";

    isHovering = true;
  });

  hoverArea.addEventListener("mouseleave", () => {
    hoverBg.style.opacity = "0";
    hoverEye.style.opacity = "0";

    hoverBg.style.transform = "translate(-50%, -50%) scale(0)";
    hoverEye.style.transform = "translate(-50%, -50%) scale(0)";

    isHovering = false;
  });

  hoverArea.addEventListener("mousemove", (e) => {
    const rect = hoverArea.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  });

  function animate() {
    // ✨ Different interpolation speeds
    circleX += (targetX - circleX) * 0.12; // slower
    circleY += (targetY - circleY) * 0.12;

    eyeX += (targetX - eyeX) * 0.35; // faster
    eyeY += (targetY - eyeY) * 0.35;

    if (isHovering) {
      // Update circle (background)
      hoverBg.style.left = `${circleX}px`;
      hoverBg.style.top = `${circleY}px`;
      hoverBg.style.transform = "translate(-50%, -50%)";

      // Update eye (foreground)
      hoverEye.style.left = `${eyeX}px`;
      hoverEye.style.top = `${eyeY}px`;
      hoverEye.style.transform = "translate(-50%, -50%)";
    }

    requestAnimationFrame(animate);
  }

  animate();

  const images = document.querySelectorAll(".preloader_images-wrapper img");
  const heading = document.querySelector(".preloader-heading");
  let currentIndex = 0;
  let count = 0;



  // Counter animation: 1 to 100
  const counterInterval = setInterval(() => {
    count++;
    heading.textContent = `${count}`;
    if (count >= 100) clearInterval(counterInterval);
  }, 20); // ~3 seconds total

  // Image animation: rotate one into view
  const animateImages = () => {


    images.forEach((img, index) => {
      if (index === currentIndex) {
        img.style.zIndex = 999;
        img.style.transform = "rotate(0deg)";
        img.style.opacity = 1;
      }
    });

    currentIndex = (currentIndex + 1) % images.length;
  };

  // Rotate images every 600ms
  const imageInterval = setInterval(animateImages, 600);

  // End preloader after 3.5 seconds
  setTimeout(() => {
    clearInterval(imageInterval);
    document.getElementById("preloader").style.opacity = 0;
    document.getElementById("preloader").style.transition = "opacity 1s ease";
    setTimeout(() => {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("main-content").style.display = "block";
      document.body.classList.remove("no-scroll");
    }, 1000);
  }, 3500);



  const cursor = document.getElementsByClassName('cursor')[0];
  const canvas = document.getElementById('cursor-canvas');
  const ctx = canvas.getContext('2d');
  console.log(ctx);

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let mouseX = 0, mouseY = 0;
  let tailX = window.innerWidth / 2;
  let tailY = window.innerHeight / 2;
  const trail = [];

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 👇 Lock cursor dot directly to mouse
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function drawTrail() {
    // Clear the previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 👇 Interpolate tail toward actual mouse (increase 0.5 for faster follow)
    tailX += (mouseX - tailX) * 0.5;
    tailY += (mouseY - tailY) * 0.5;

    // Add the new tail position to trail array
    trail.push({ x: tailX, y: tailY });
    if (trail.length > 15) trail.shift(); // keep trail short and smooth

    // Draw the trailing line
    ctx.beginPath();
    for (let i = 0; i < trail.length - 1; i++) {
      const p1 = trail[i];
      const p2 = trail[i + 1];

      ctx.fillStyle = '#e40767';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#e40767';
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.9;
      ctx.fill
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();

    // Call again for next animation frame
    requestAnimationFrame(drawTrail);
  }

  // Kick off the animation
  drawTrail();

});



