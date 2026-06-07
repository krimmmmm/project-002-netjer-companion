import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useFBX
} from "@react-three/drei";

import * as THREE from "three";

function EnergyRing({
  radius,
  color,
  speed,
  y
}) {
  const ringRef = useRef();

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += speed;
    }
  });

  return (
    <mesh ref={ringRef} position={[1, y, -0.2]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />

      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function EyeGlow({ x }) {
  return (
    <mesh position={[x, 1.45, 0.55]}>
      <sphereGeometry args={[0.03, 16, 16]} />

      <meshStandardMaterial
        color="cyan"
        emissive="cyan"
        emissiveIntensity={10}
      />
    </mesh>
  );
}

function Avatar() {
  const group = useRef();

  const fbx = useFBX("/models/avatar.fbx");

  useEffect(() => {
    if (!fbx) return;

    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;

        child.material = child.material.clone();

        child.material.roughness = 0.3;

        child.material.metalness = 0.15;
      }
    });
  }, [fbx]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (group.current) {
      // ลอยขึ้นลง
      group.current.position.y =
        -2.2 + Math.sin(t * 2) * 0.12;

      // หมุนเบาๆ
      group.current.rotation.y =
        Math.sin(t * 0.8) * 0.25;
    }
  });

  return (
    <group
      ref={group}
      scale={0.022}
      position={[1, -2.2, 0]}
    >
      <primitive object={fbx} />

      {/* ตาเรืองแสง */}
      <EyeGlow x={-0.08} />
      <EyeGlow x={0.08} />
    </group>
  );
}

function Scene3D() {
  return (
    <Canvas
      camera={{
        position: [0, 0.5, 8],
        fov: 40
      }}
    >
      {/* LIGHT */}
      <ambientLight intensity={2} />

      <directionalLight
        position={[3, 5, 3]}
        intensity={5}
      />

      <pointLight
        position={[1, 1, 2]}
        intensity={8}
        color="cyan"
      />

      {/* AURA */}
      <EnergyRing
        radius={1.2}
        color="cyan"
        speed={0.01}
        y={-0.1}
      />

      <EnergyRing
        radius={1.55}
        color="#ffd166"
        speed={-0.006}
        y={-0.1}
      />

      {/* CHARACTER */}
      <Avatar />

      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
      />
    </Canvas>
  );
}

function App() {
  const videoRef = useRef();

  const [started, setStarted] =
    useState(false);

  const startCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true
          }
        );

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStarted(true);
    } catch (err) {
      alert("Camera Error");
    }
  };

  return (
    <div className="app">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera"
      />

      <div className="avatar3d">
        <Scene3D />
      </div>

      <div className="title">
        NETJER AI COMPANION
      </div>

      {!started && (
        <button
          className="startBtn"
          onClick={startCamera}
        >
          START CAMERA
        </button>
      )}

      {started && (
        <div className="status">
          NETJER ACTIVE
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
