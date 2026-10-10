
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function Orb() {
  const group = useRef(null);
  const orb = useRef(null);
  const particles = useRef(null);
  const ringOne = useRef(null);
  const ringTwo = useRef(null);
  const scroll = useRef(0);

  const [hovered, setHovered] = useState(false);

  const positions = useMemo(() => {
    const count =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches
        ? 300
        : 500;

    const result = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 1.35 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      result[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta);
      result[i * 3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);
      result[i * 3 + 2] =
        radius * Math.cos(phi);
    }

    return result;
  }, []);

  useEffect(() => {
    let frame = 0;

    const handleScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        scroll.current = Math.min(
          window.scrollY / Math.max(window.innerHeight, 1),
          1
        );
        frame = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !orb.current) return;

    const { pointer, viewport, clock } = state;
    const progress = scroll.current;
    const time = clock.elapsedTime;

    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      pointer.y * 0.3 + progress * 0.2,
      3,
      delta
    );

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.x * 0.4,
      3,
      delta
    );

    const targetX =
      viewport.width > 7 ? 1.3 : viewport.width > 4 ? 0.6 : 0;

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      targetX + pointer.x * 0.12,
      3,
      delta
    );

    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      Math.sin(time * 0.5) * 0.08 +
        pointer.y * 0.08 -
        progress * 0.18,
      3,
      delta
    );

    const targetScale = hovered ? 1.07 : 1;
    const scale = THREE.MathUtils.damp(
      orb.current.scale.x,
      targetScale * (1 - progress * 0.03),
      4,
      delta
    );

    orb.current.scale.setScalar(scale);

    if (ringOne.current) {
      ringOne.current.rotation.z += delta * 0.12;
      ringOne.current.rotation.x += delta * 0.025;
    }

    if (ringTwo.current) {
      ringTwo.current.rotation.y += delta * 0.09;
      ringTwo.current.rotation.z -= delta * 0.04;
    }

    if (particles.current) {
      particles.current.rotation.y += delta * 0.025;
      particles.current.rotation.x = THREE.MathUtils.damp(
        particles.current.rotation.x,
        pointer.y * 0.12,
        2,
        delta
      );
    }
  });

  return (
    <group ref={group}>
      {/* Soft halo */}
      <mesh position={[0, 0, -0.9]}>
        <circleGeometry args={[2.1, 64]} />
        <meshBasicMaterial
          color="#c4b5fd"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* Main liquid orb */}
      <mesh
        ref={orb}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 96, 96]} />
        <MeshDistortMaterial
          color="#c4b5fd"
          roughness={0.12}
          metalness={0.12}
          distort={0.28}
          speed={1.2}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Glass shell */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          color="#eee8ff"
          transmission={0.85}
          thickness={0.35}
          roughness={0.08}
          ior={1.2}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.08}
          distortionScale={0.12}
          temporalDistortion={0.04}
          samples={4}
          resolution={256}
          backside
        />
      </mesh>

      {/* Orbit rings */}
      <mesh ref={ringOne} rotation={[1, 0.3, -0.4]}>
        <torusGeometry args={[1.42, 0.008, 8, 128]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh ref={ringTwo} rotation={[0.5, 1, 0.7]}>
        <torusGeometry args={[1.68, 0.006, 8, 128]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Floating particles */}
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          color="#9f8cff"
          size={0.018}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <pointLight
        position={[2, 2, 3]}
        intensity={30}
        color="#e9ddff"
      />

      <pointLight
        position={[-3, -1, 1]}
        intensity={20}
        color="#a5e7ff"
      />

      <pointLight
        position={[0, -3, 2]}
        intensity={10}
        color="#fbcfe8"
      />
    </group>
  );
}

export default function OrbScene() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="size-64 rounded-full bg-gradient-to-br from-violet-200 via-purple-100 to-sky-200 opacity-70 blur-2xl" />
      </div>
    );
  }

  return (
    <div className="pointer-events-auto absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        dpr={[1, 1.25]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        fallback={
          <div className="grid h-full place-items-center text-sm text-zinc-500">
            3D graphics unavailable.
          </div>
        }
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault();
              setFailed(true);
            },
            { once: true }
          );
        }}
      >
        <ambientLight intensity={0.7} />
        <Environment preset="studio" />
        <Orb />
      </Canvas>
    </div>
  );
}
