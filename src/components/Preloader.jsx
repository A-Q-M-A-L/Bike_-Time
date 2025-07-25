import React, { useEffect, useRef, useState } from 'react';
import img1 from '../assets/images/img1.webp';
import img2 from '../assets/images/img2.webp';
import img3 from '../assets/images/img2.webp';
import img4 from '../assets/images/img4.webp';
import img5 from '../assets/images/img5.webp';

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  const imagesRef = useRef([]);
  const preloaderRef = useRef(null);
  const mainContentRef = useRef(null);
  const lineRef = useRef(null);
  const intervalRef = useRef(null);

  // Image sources
  const imageSources = [
    img1,
    img2,
    img3,
    img4,
    img5,
  ];

  useEffect(() => {
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= 100) {
        clearInterval(intervalRef.current);
        // Fade out
        preloaderRef.current.classList.add("opacity-0", "transition-opacity", "duration-1000");
        setTimeout(() => {
          setDone(true);
          if (onComplete) onComplete();
        }, 1000);
        return;
      }

      i++;
      setCount(i);

      if (lineRef.current) {
        lineRef.current.style.width = `${i}%`;
      }

      // Update z-index of images
      const index = Math.floor((i / 100) * imageSources.length);
      imagesRef.current.forEach((img, idx) => {
        if (img) img.style.zIndex = idx === index ? "50" : "0";
      });
    }, 20);

    return () => clearInterval(intervalRef.current);
  }, []);

  if (done) return null;

  return (
    <div
      ref={preloaderRef}
      id="preloader"
      className="relative flex items-center justify-center bg-[#f0e3d84f] w-screen h-screen overflow-hidden z-50"
    >
      {/* Counter */}
      <div id="counting" className="absolute top-[20%] font-[900] text-[15vh] text-white z-50">
        {count}
      </div>


      {/* Images */}
      <div id="images" className="relative w-full h-full">

        {imageSources.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="rider"
            ref={el => (imagesRef.current[i] = el)}
            className={`rider-img absolute top-1/2 left-1/2 w-[215px] h-[260px] rounded-xl -translate-x-1/2 -translate-y-1/2 ${i % 2 === 0 ? 'rotate-[3deg]' : '-rotate-[3deg]'}`}
          />
        ))}
      </div>

      {/* Progress line */}
      <div
        ref={lineRef}
        id="line"
        className="absolute top-[67%] left-[49%] -rotate-[8deg] max-w-[8rem] h-[1vh] w-0 bg-red-700 rounded-full transition-all duration-1000"
      ></div>

    </div>
  );
};

export default Preloader;
