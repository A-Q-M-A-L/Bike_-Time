// src/App.jsx
import { useEffect, useState, useRef } from 'react';
import Preloader from './components/Preloader';
import logo from './assets/images/logo.png';
import gsap from 'gsap';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const carouselRef = useRef(null);
  const hoverEyeRef = useRef(null);
  const hoverBgRef = useRef(null);
  const headingRef = useRef(null);
  const hoverAreaRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);

    const mouse = { x: 0, y: 0 };
    const prevMouse = { x: 0, y: 0 };
    const trail = [];
    const maxTrail = 8;
    const trimSpeed = 2;

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (cursor) {
        cursor.style.top = `${mouse.y}px`;
        cursor.style.left = `${mouse.x}px`;
      }
    });

    function drawTrail() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dx = mouse.x - prevMouse.x;
      const dy = mouse.y - prevMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const isMoving = dist > 1;
      if (isMoving) {
        trail.push({ x: mouse.x, y: mouse.y });
        prevMouse.x = mouse.x;
        prevMouse.y = mouse.y;
        while (trail.length > maxTrail) trail.shift();
      } else {
        for (let i = 0; i < trimSpeed && trail.length > 0; i++) trail.shift();
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

    drawTrail();

    const hoverArea = hoverAreaRef.current;
    const hoverBg = hoverBgRef.current;
    const hoverEye = hoverEyeRef.current;
    let targetX = 0,
      targetY = 0,
      currentX = 0,
      currentY = 0,
      isHovering = false;

    hoverArea.addEventListener('mouseenter', () => {
      hoverBg.style.opacity = '1';
      hoverEye.style.opacity = '1';
      hoverEye.style.transform = 'scale(1)';
      hoverBg.style.transform = 'scale(1)';
      isHovering = true;
    });

    hoverArea.addEventListener('mouseleave', () => {
      hoverBg.style.opacity = '0';
      hoverEye.style.opacity = '0';
      hoverEye.style.transform = 'scale(0)';
      hoverBg.style.transform = 'scale(0)';
      isHovering = false;
    });

    hoverArea.addEventListener('mousemove', (e) => {
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
        hoverBg.style.transform = 'translate(-50%, -50%) scale(1)';

        hoverEye.style.left = `${currentX}px`;
        hoverEye.style.top = `${currentY}px`;
        hoverEye.style.transform = 'translate(-50%, -50%) scale(1.1)';
      }

      requestAnimationFrame(animateHover);
    }

    animateHover();

    const heading = headingRef.current;
    window.addEventListener('mousemove', (e) => {
      const rect = heading.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const clampedX = Math.max(0, Math.min(relativeX, rect.width));
      const bgX = (clampedX / rect.width) * 100;
      heading.style.backgroundPosition = `${bgX}% 40%`;
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
        x: toLeft ? '100vw' : '-100vw',
        y: '30vh',
        zIndex: 2,
        rotation: toLeft ? 10 : -10,
      });

      const tl = gsap.timeline();
      tl.to(currentItem, {
        duration: 1.2,
        x: toLeft ? '-100vw' : '100vw',
        y: '30vh',
        autoAlpha: 0,
        ease: 'expo.inOut',
        rotation: toLeft ? -10 : 10,
        zIndex: 1,
      }, 0);

      tl.to(nextItem, {
        duration: 1.2,
        x: '0vw',
        y: '0vh',
        ease: 'expo.inOut',
        rotation: 0,
      }, 0);

      const gradientNum = next + 1;
      heading.style.backgroundImage = `url('/images/grad${gradientNum}.png')`;

      current = next;
    }

    document.querySelectorAll('.key').forEach((btn, index) => {
      btn.setAttribute('aria-label', index === 0 ? 'Previous slide' : 'Next slide');
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

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [isLoaded]);

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />

      <main id="main-content" className={isLoaded ? '' : 'hidden'}>
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[9998] pointer-events-none" aria-hidden="true"></canvas>
        <div className="cursor-wrapper">
          <div className="cursor" ref={cursorRef}></div>
        </div>


        <header className="flex justify-between items-center px-8 py-6 !bg-transparent text-black/70">
          <nav className="flex gap-6 text-sm font-bold uppercase">
            <a href="#" className="link-hover">Fietsen</a>
            <a href="#" className="link-hover">Onderdelen</a>
          </nav>
          <div className="w-32" alt="BikeTime Logo">
            <img src={logo} alt="w-32 h-full" />
          </div>
          <nav className="flex gap-6 text-sm font-bold uppercase">
            <a href="#" className="link-hover">Over</a>
            <a href="#" className="link-hover">Contact</a>
          </nav>
        </header>

        <section
        ref={hoverAreaRef}
          id="hover-area"
          className="relative h-screen flex flex-col items-center justify-center cursor-pointer max-w-4xl overflow-visible rounded-full mx-auto"
        >
          <h1
            id="dynamic-heading"
            className="bg-[url('/images/grad1.png')] bg-no-repeat bg-clip-text bg-origin-content absolute top-[0%] text-[#00000008] text-[9vw] font-black z-0 text-center tracking-tight leading-[9rem] uppercase w-[90vw]"
            ref={headingRef}
          >
            Ride for <br /> Your Passion
          </h1>

          <div className="absolute inset-0 overflow-visible" ref={carouselRef}>
            <div id="carousel" className="carousel">
              {[1, 2, 3, 4].map((item, i) => {
                const bikeImg = `/images/bike${item}.webp`;
                const rockA = `/images/rock${i * 2 + 1}.webp`;
                const rockB = `/images/rock${i * 2 + 2}.webp`;
                const mp4Src = ['Gravel', 'Electric', 'Road', 'Mountain'][i];

                return (
                  <div key={i} className="carousel-item w-full absolute h-full">
                    <img
                      src={bikeImg}
                      className="bike-img absolute top-[17%] left-[14%] animate-float w-[620px]"
                      alt={`${mp4Src} Bike`}
                    />
                    <div className="absolute top-[50%] left-[46%] z-20 bg-black text-white py-3 px-10 rounded-full text-sm font-bold rotate-[-10deg]">
                      {mp4Src} <br /> Bikes
                    </div>
                    <video
                      id={`land${i}`}
                      className="land-video absolute top-[40%] left-1/2 -translate-x-1/2 w-full"
                      width="100%"
                      height="100%"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source
                        src={`https://staging.face44.com/assets/bike-time/${mp4Src}%20Ped%20TT%20Alpha/Render-hevc-safari.mp4`}
                        type='video/mp4; codecs="hvc1"'
                      />
                      <source
                        src={`https://staging.face44.com/assets/bike-time/${mp4Src}%20Ped%20TT%20Alpha/Render-vp9-chrome.webm`}
                        type="video/webm"
                      />
                    </video>
                    <img src={rockA} className="absolute left-[20%] top-[5%] w-16 animation-rotate-float z-50" alt="Rock A" />
                    <img src={rockB} className="absolute right-[5%] top-[20%] w-16 animation-rotate-float rock2" alt="Rock B" />
                  </div>
                );
              })}
            </div>
          </div>

          <div
            ref={hoverBgRef}
            id="hover-bg"
            className="absolute w-[525px] h-[525px] rounded-full opacity-0 pointer-events-none -z-50 transition-all duration-500 ease-out "
          >
            <img src="/images/grad.png" className="w-full h-full" alt="Gradient BG" />
          </div>
          <img
            ref={hoverEyeRef}
            id="hover-eye"
            src="/images/eye.svg"
            alt="Eye"
            className="absolute w-10 h-10 opacity-0 pointer-events-none z-[999] transition-all duration-300 ease-out"
          />
        </section>

        {/* Arrows */}
        <button className="key key-left hover:scale-110 absolute duration-300 left-[22%] top-[47%] transform -translate-y-1/2 border border-gray-400 rounded-full w-16 h-16 p-4 inline-block z-10 text-[#e40767] hover:text-white text-xl font-bold">
          ←
        </button>
        <button className="key key-right hover:scale-110 absolute duration-300 right-[22%] top-[47%] transform -translate-y-1/2 border border-gray-400 rounded-full w-16 h-16 p-4 inline-block z-10 text-[#e40767] hover:text-white text-xl font-bold">
          →
        </button>
      </main>
    </>
  );
}

export default App;
