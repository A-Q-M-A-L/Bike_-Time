const cursor = document.querySelector('.cursor');
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let mouse = { x: 0, y: 0 };
const trail = [];


document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  cursor.style.top = `${mouse.y}px`;
  cursor.style.left = `${mouse.x}px`;
});


let prevMouse = { x: 0, y: 0 };
let maxTrail = 8;
let trimSpeed = 2;

function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dx = mouse.x - prevMouse.x;
  const dy = mouse.y - prevMouse.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const isMoving = dist > 1;

  if (isMoving) {
    trail.push({ x: mouse.x, y: mouse.y });
    prevMouse = { x: mouse.x, y: mouse.y };


    while (trail.length > maxTrail) {
      trail.shift();
    }
  } else {

    for (let i = 0; i < trimSpeed && trail.length > 0; i++) {
      trail.shift();
    }
  }


  if (trail.length > 2) {
    ctx.beginPath();
    ctx.strokeStyle = '#e40767';
    ctx.lineWidth = 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length - 2; i++) {
      const xc = (trail[i].x + trail[i + 1].x) / 2;
      const yc = (trail[i].y + trail[i + 1].y) / 2;
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
    }

    const last = trail[trail.length - 1];
    const secondLast = trail[trail.length - 2];
    ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);
    ctx.stroke();
  }

  requestAnimationFrame(drawTrail);
}


const hoverArea = document.getElementById("hover-area");
const hoverBg = document.getElementById("hover-bg");
const hoverEye = document.getElementById("hover-eye");

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
let isHovering = false;

hoverArea.addEventListener("mouseenter", () => {
  hoverBg.style.opacity = "1";
  hoverEye.style.opacity = "1";
  hoverEye.style.transform = "scale(1)";
  hoverBg.style.transform = "scale(1)";
  isHovering = true;
});

hoverArea.addEventListener("mouseleave", () => {
  hoverBg.style.opacity = "0";
  hoverEye.style.opacity = "0";
  hoverEye.style.transform = "scale(0)";
  hoverBg.style.transform = "scale(0)";
  isHovering = false;
});

hoverArea.addEventListener("mousemove", (e) => {
  const rect = hoverArea.getBoundingClientRect();
  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;
});

function animateHover() {
  currentX += (targetX - currentX) * 0.15;
  currentY += (targetY - currentY) * 0.15;

  if (isHovering) {
    hoverBg.style.left = `${currentX}px`;
    hoverBg.style.top = `${currentY}px`;
    hoverBg.style.transform = "translate(-50%, -50%) scale(1)";

    hoverEye.style.left = `${currentX}px`;
    hoverEye.style.top = `${currentY}px`;
    hoverEye.style.transform = "translate(-50%, -50%) scale(1.1)";
  }

  requestAnimationFrame(animateHover);
}

animateHover();
drawTrail();



const heading = document.getElementById('dynamic-heading');

window.addEventListener('mousemove', (e) => {
  const rect = heading.getBoundingClientRect();
  const relativeX = e.clientX - rect.left;


  const clampedX = Math.max(0, Math.min(relativeX, rect.width));


  const bgX = (clampedX / rect.width) * 100;


  heading.style.backgroundPosition = `${bgX}% 40%`;
});




const heroArr = document.getElementById("hover-area")


heroArr.addEventListener('mouseenter', (event) => {

  event.stopPropagation();
})


const Arrowkeys = document.getElementsByClassName('key')

Array(Arrowkeys).forEach((element, index) => {
  element[index].addEventListener('mouseover', (event) => {
    event.stopPropagation();

  })
});



const items = document.querySelectorAll('.carousel-item');
const total = items.length;
let current = 0;

gsap.set(items, { autoAlpha: 0, x: 0, y: 0 });
gsap.set(items[0], { autoAlpha: 1 });

function slide(toLeft = true) {
  const currentItem = items[current];
  const next = (current + (toLeft ? 1 : -1) + total) % total;
  const nextItem = items[next];


  gsap.set(nextItem, {
    autoAlpha: 1,
    x: toLeft ? "100vw" : "-100vw",
    y: "30vh",
    zIndex: 2,
    rotation: toLeft ? 10 : -10,
  });

  const tl = gsap.timeline();


  tl.to(currentItem, {
    duration: 1.2,
    x: toLeft ? "-100vw" : "100vw",
    y: "30vh",
    autoAlpha: 0,
    ease: "expo.inOut",
    rotation: toLeft ? -10 : 10,
    zIndex: 1
  }, 0);


  tl.to(nextItem, {
    duration: 1.2,
    x: "0vw",
    y: "0vh",
    ease: "expo.inOut",
    rotation: 0
  }, 0);


  const gradientNum = next + 1;
  heading.style.backgroundImage = `url('./assets/grad${gradientNum}.png')`;

  current = next;
}



document.querySelectorAll('.key').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    slide(index === 0 ? false : true);
    restartInterval();
  });
});

let interval = setInterval(() => slide(true), 5000);

function restartInterval() {
  clearInterval(interval);
  interval = setInterval(() => slide(true), 5000);
}




document.addEventListener("DOMContentLoaded", () => {
  const counting = document.getElementById("counting");
  const line = document.getElementById("line");
  const images = document.querySelectorAll(".rider-img");
  const preloader = document.getElementById("preloader");
  const mainContent = document.getElementById("main-content");

  let count = 0;
  const max = 100;
  const interval = 20;

  const updatePreloader = () => {
    if (count >= max) {
      clearInterval(loaderInterval);


      preloader.classList.add("opacity-0", "transition-opacity", "duration-1000");

      setTimeout(() => {
        preloader.style.display = "none";
        mainContent.classList.remove("hidden");
      }, 1000);

      return;
    }

    count++;
    line.style.width = `${count}%`;
    counting.innerText = count;


    const index = Math.floor((count / max) * images.length);
    images.forEach((img, i) => {

      img.style.zIndex = (i === index) ? "50" : "0";

    });
  };

  const loaderInterval = setInterval(updatePreloader, interval);
});
