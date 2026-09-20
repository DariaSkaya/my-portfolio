"use client";

import gsap from "gsap";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const FONT = "/fonts/jetbrains-mono-700.woff2";

const BIG_TEXT =
  "DIGITAL DESIGN · PRODUCT DESIGN · UX/UI · WEB · ";

const SMALL_TEXT =
  "CREATIVE DESIGN · UX/UI · WEB · PRODUCT DESIGN";

type TextArcProps = {
  text: string;
  radiusX: number;
  radiusY: number;
  depth: number;
  fontSize: number;
  startAngle: number;
  endAngle: number;
  opacity?: number;
};

function TextArc({
  text,
  radiusX,
  radiusY,
  depth,
  fontSize,
  startAngle,
  endAngle,
  opacity = 1,
}: TextArcProps) {
  const letters = text.toUpperCase().split("");

  return (
    <group>
      {letters.map((letter, index) => {
        const progress =
          letters.length === 1
            ? 0.5
            : index / (letters.length - 1);

        const angle =
          startAngle +
          (endAngle - startAngle) * progress;

        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        const z = Math.cos(angle) * depth;

        return (
          <Text
            key={`${letter}-${index}`}
            font={FONT}
            fontSize={fontSize}
            fontWeight={700}
            color="black"
            fillOpacity={opacity}
            anchorX="center"
            anchorY="middle"
            position={[x, y, z]}
            rotation={[
              0,
              -Math.sin(angle) * 0.18,
              angle + Math.PI / 2,
            ]}
            frustumCulled={false}
          >
            {letter}
          </Text>
        );
      })}
    </group>
  );
}

function LoaderScene({
  onReady,
}: {
  onReady: () => void;
}) {
  const sceneRef = useRef<THREE.Group>(null);

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  const targetMouse = useRef({
    x: 0,
    y: 0,
  });

  const readyCalled = useRef(false);

  const { camera } = useThree();

  useEffect(() => {
    let active = true;

    document.fonts
      .load(`700 100px "JetBrains Mono"`)
      .then(() => {
        if (!active || readyCalled.current) return;

        readyCalled.current = true;
        onReady();
      });

    return () => {
      active = false;
    };
  }, [onReady]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetMouse.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      targetMouse.current.y =
        (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame((_, delta) => {
    if (!sceneRef.current) return;

    mouse.current.x +=
      (targetMouse.current.x - mouse.current.x) * 0.05;

    mouse.current.y +=
      (targetMouse.current.y - mouse.current.y) * 0.05;

    /*
      Наклон от мыши.
    */

    const targetRotationX =
      -0.48 + mouse.current.y * 0.3;

    const targetRotationY =
      mouse.current.x * 0.42;

    sceneRef.current.rotation.x +=
      (targetRotationX - sceneRef.current.rotation.x) * 0.035;

    sceneRef.current.rotation.y +=
      (targetRotationY - sceneRef.current.rotation.y) * 0.035;

    /*
      Постоянное вращение большого кольца.
    */

    sceneRef.current.rotation.z += delta * 0.24;

    /*
      Лёгкое движение камеры.
    */

    const cameraTargetX =
      mouse.current.x * 0.4;

    const cameraTargetY =
      -mouse.current.y * 0.25;

    camera.position.x +=
      (cameraTargetX - camera.position.x) * 0.025;

    camera.position.y +=
      (cameraTargetY - camera.position.y) * 0.025;

    camera.lookAt(0, 0, 0);
  });

  return (
    <group
      ref={sceneRef}
      rotation={[-0.48, 0.08, 0]}
    >
      {/* БОЛЬШОЕ КОЛЬЦО */}

      <TextArc
        text={BIG_TEXT}
        radiusX={1.72}
        radiusY={0.78}
        depth={0.38}
        fontSize={0.39}
        startAngle={0}
        endAngle={Math.PI * 2}
      />

      {/* МЕЛКАЯ ПОДПИСЬ ПОД КОЛЬЦОМ */}

      <group position={[0, -1.12, 0.05]}>
        <TextArc
          text={SMALL_TEXT}
          radiusX={1.42}
          radiusY={0.34}
          depth={0.12}
          fontSize={0.105}
          startAngle={Math.PI}
          endAngle={Math.PI * 2}
          opacity={0.62}
        />
      </group>
    </group>
  );
}

type LoaderProps = {
  onComplete?: () => void;
};

export default function Loader({
  onComplete,
}: LoaderProps) {
  const loaderRef =
    useRef<HTMLDivElement>(null);

  const sceneRef =
    useRef<HTMLDivElement>(null);

  const counterRef =
    useRef<HTMLDivElement>(null);

  const [progress, setProgress] =
    useState(0);

  const [visible, setVisible] =
    useState(true);

  const [sceneReady, setSceneReady] =
    useState(false);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  useEffect(() => {
    if (!sceneReady) return;

    let progressTimer: number | null = null;
    let exitTimer: number | null = null;
    let cancelled = false;

    const startExit = () => {
      if (
        cancelled ||
        !loaderRef.current ||
        !sceneRef.current ||
        !counterRef.current
      ) {
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          if (cancelled) return;

          setVisible(false);
          onComplete?.();
        },
      });

      /*
        Кольцо медленно уходит
        вправо-вниз, уменьшается
        и растворяется.
      */

      timeline.to(
        sceneRef.current,
        {
          x: window.innerWidth * 0.34,
          y: window.innerHeight * 0.28,
          scale: 0.22,
          opacity: 0,
          duration: 2.8,
          ease: "power3.inOut",
        },
        0
      );

      timeline.to(
        counterRef.current,
        {
          opacity: 0,
          y: 18,
          duration: 1.2,
          ease: "power2.out",
        },
        0.45
      );

      timeline.to(
        loaderRef.current,
        {
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
        },
        1.4
      );
    };

    progressTimer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + 1;

        if (next >= 100) {
          if (progressTimer) {
            window.clearInterval(progressTimer);
          }

          exitTimer = window.setTimeout(
            startExit,
            500
          );

          return 100;
        }

        return next;
      });
    }, 35);

    return () => {
      cancelled = true;

      if (progressTimer) {
        window.clearInterval(progressTimer);
      }

      if (exitTimer) {
        window.clearTimeout(exitTimer);
      }

      gsap.killTweensOf([
        loaderRef.current,
        sceneRef.current,
        counterRef.current,
      ]);
    };
  }, [onComplete, sceneReady]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#f5f5f5]"
    >
      <div
        ref={sceneRef}
        className="absolute left-1/2 top-[43%] h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2"
      >
        <Canvas
          camera={{
            position: [0, 0, 6.8],
            fov: 38,
          }}
          dpr={[1, 2]}
        >
          <LoaderScene
            onReady={handleSceneReady}
          />
        </Canvas>
      </div>

      <div
        ref={counterRef}
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-black"
        style={{
          fontFamily:
            '"JetBrains Mono", monospace',
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        {String(progress).padStart(3, "0")}%
      </div>
    </div>
  );
}