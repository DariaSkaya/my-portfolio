"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import Loader from "@/components/Loader";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!loaded) return;

    const words = titleRef.current?.children;

    if (!words) return;

    const tl = gsap.timeline();

    tl.fromTo(
      words[0],
      {
        opacity: 0,
        filter: "blur(14px)",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 2.5,
        ease: "power2.out",
      }
    );

    tl.fromTo(
      words[1],
      {
        opacity: 0,
        filter: "blur(14px)",
        x: -80,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
        duration: 2,
        ease: "power2.out",
      },
      "-=1.5"
    );
  }, [loaded]);

  return (
    <>
      <Loader onComplete={() => setLoaded(true)} />

      <main
        className={`relative flex min-h-screen flex-col justify-between bg-black px-8 py-8 text-white transition-opacity duration-1000 md:px-16 md:py-12 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <nav className="flex items-center justify-between text-sm tracking-wide">
          <span className="font-semibold">
            DARIA SOSNITSKAYA
          </span>

          <div className="hidden gap-8 text-zinc-400 md:flex">
            <span>[ ABOUT ]</span>
            <span>[ WORKS ]</span>
            <span>[ CONTACT ]</span>
          </div>
        </nav>

        <div className="flex flex-col gap-4">
          <h1
            ref={titleRef}
            className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight"
          >
            <span className="block">DIGITAL</span>
            <span className="block">DESIGNER</span>
          </h1>

          <p className="max-w-md text-lg text-zinc-400">
            Product · UX/UI · Web
            <br />
            Designstudio based in Berlin
          </p>
        </div>

        <div className="flex items-end justify-between text-sm text-zinc-500">
          <span>BERLIN, DE</span>
          <span>2026</span>
        </div>
      </main>
    </>
  );
}