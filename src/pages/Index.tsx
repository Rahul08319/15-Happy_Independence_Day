import { useEffect, useRef, useState } from "react";
import flower1 from "@/assets/123.png";
import flower2 from "@/assets/124.png";
import bb from "@/assets/bb.gif";
import snow from "@/assets/snow.gif";
import wp from "@/assets/wp.png";

const Index = () => {
  const [name, setName] = useState<string>("");
  const [countdown, setCountdown] = useState("");
  const promptedRef = useRef(false);

  useEffect(() => {
    if (promptedRef.current) return;
    promptedRef.current = true;
    const n = window.prompt("Please Enter Your Name") || "Friend";
    setName(n);
  }, []);

  useEffect(() => {
    const target = new Date("Aug 15, 2026 00:00:00").getTime();
    const id = setInterval(() => {
      const distance = target - Date.now();
      if (distance < 0) {
        setCountdown("Techno Vedant");
        clearInterval(id);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown(`${days} Days, ${hours} Hrs, ${minutes} Min, ${seconds} Sec`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const leftCol = Array.from({ length: 10 });
  const rightCol = Array.from({ length: 10 });

  return (
    <div className="snow-body min-h-screen relative overflow-hidden">
      {/* Left vertical marquee */}
      <div className="marquee-col marquee-col-left">
        <div className="marquee-track marquee-up">
          {[...leftCol, ...leftCol].map((_, i) => (
            <img
              key={`l-${i}`}
              src={i % 2 === 0 ? flower1 : flower2}
              alt="flower border"
              className="mx-auto my-2"
              style={{ width: 35, height: 129 }}
            />
          ))}
        </div>
      </div>

      {/* Right vertical marquee */}
      <div className="marquee-col marquee-col-right">
        <div className="marquee-track marquee-down">
          {[...rightCol, ...rightCol].map((_, i) => (
            <img
              key={`r-${i}`}
              src={i % 2 === 0 ? flower1 : flower2}
              alt="flower border"
              className="mx-auto my-2"
              style={{ width: 35, height: 129 }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="container px-4 pt-6 pb-28 relative z-10">
        <div className="main-greeting mx-auto max-w-[420px] bg-[#808080] p-[5px] mb-12 shadow-[3px_4px_41px_0_rgba(0,0,0,0.64)]">
          <div className="greeting-box overflow-hidden bg-white/40 rounded-[inherit] py-4">
            <p className="text-white font-extrabold text-xl px-2">{countdown}</p>

            <figure className="wobble mt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <h1
                  key={i}
                  className="glow-h1 uppercase"
                  style={{ transform: `translateZ(${i * 5}px)` }}
                >
                  {name}
                </h1>
              ))}
            </figure>

            <div className="text-center mt-4">
              <img
                src={snow}
                alt="snow falling"
                className="swing1 w-full"
                style={{ height: 100 }}
              />
              <h2 className="rock-h2">
                <img src={bb} alt="Happy Independence Day" className="inline-block" style={{ width: "80%" }} />
              </h2>
              <h3 className="title-h3">Happy Independence Day</h3>
              <p className="text-[#405d9b] font-semibold tracking-wide px-3 py-2">
                Wishing you a joyful Independence Day filled with pride and patriotism.
              </p>
              <p className="text-[#b50dae] font-bold text-2xl my-2">— {name} —</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom share bar */}
      <div className="share-box fixed left-0 right-0 bottom-0 flex z-20">
        <a
          href="https://wa.me/?text=Happy%20Independence%20Day"
          className="share-btn whatsapp flex-1 flex items-center justify-center gap-2"
        >
          <img src={wp} alt="whatsapp" className="h-5 w-5" /> WHATSAPP
        </a>
        <a
          href="https://www.facebook.com/sharer/sharer.php?u="
          className="share-btn facebook flex-1 flex items-center justify-center"
        >
          FACEBOOK
        </a>
        <button
          onClick={() => {
            promptedRef.current = false;
            const n = window.prompt("Please Enter Your Name") || "Friend";
            setName(n);
          }}
          className="share-btn download flex-1"
        >
          NEW WISH
        </button>
      </div>
    </div>
  );
};

export default Index;
