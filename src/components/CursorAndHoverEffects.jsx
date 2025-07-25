import { useEffect, useRef } from 'react';

function CursorAndHoverEffects() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const hoverBgRef = useRef(null);
  const hoverEyeRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const mouse = { x: 0, y: 0 };
    let prevMouse = { x: 0, y: 0 };
    const trail = [];
    const maxTrail = 8;
    const trimSpeed = 2;

    const drawTrail = () => {
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
    };

    const cursor = cursorRef.current;
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cursor.style.top = `${mouse.y}px`;
      cursor.style.left = `${mouse.x}px`;
    });

    drawTrail();

    // Hover Effects
    const hoverArea = document.getElementById('hover-area');
    const hoverBg = hoverBgRef.current;
    const hoverEye = hoverEyeRef.current;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isHovering = false;

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

    const animateHover = () => {
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
    };

    animateHover();

    // Heading Gradient Follow
    const heading = headingRef.current;
    window.addEventListener('mousemove', (e) => {
      const rect = heading.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const clampedX = Math.max(0, Math.min(relativeX, rect.width));
      const bgX = (clampedX / rect.width) * 100;
      heading.style.backgroundPosition = `${bgX}% 40%`;
    });

  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="cursor-canvas" className="fixed top-0 left-0 w-full h-full z-[9998] pointer-events-none" />
      <div ref={cursorRef} className="cursor" id="cursor"></div>
      <div ref={hoverBgRef} id="hover-bg" className="absolute w-[525px] h-[525px] rounded-full opacity-0 pointer-events-none -z-50 transition-all duration-500 ease-out scale-0">
        <img src="/assets/grad.png" className="w-full h-full" alt="Gradient BG" />
      </div>
      <img ref={hoverEyeRef} id="hover-eye" src="/assets/eye.svg" alt="Eye" className="absolute w-10 h-10 opacity-0 pointer-events-none z-[999] transition-all duration-300 ease-out" />
      <h1 ref={headingRef} id="dynamic-heading" className="bg-[url('/assets/grad1.png')] bg-no-repeat bg-clip-text bg-origin-content absolute top-[0%] text-[#00000008] text-[9vw] font-black z-0 text-center tracking-tight leading-[9rem] uppercase w-[90vw]">
        Ride for <br /> Your Passion
      </h1>
    </>
  );
}

export default CursorAndHoverEffects;
