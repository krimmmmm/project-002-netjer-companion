import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import * as THREE from "three";

function EnergyRing({ radius, color, speed, y }) {
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

function GarudaRex() {
  const group = useRef();
  const fbx = useFBX("/models/garuda.fbx");

  useEffect(() => {
    if (!fbx) return;

    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();
          child.material.side = THREE.DoubleSide;
          child.material.roughness = 0.28;
          child.material.metalness = 0.55;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [fbx]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (group.current) {
      group.current.position.y = -2.2 + Math.sin(t * 2) * 0.12;
      group.current.rotation.y = Math.sin(t * 0.8) * 0.25;
    }
  });

  return (
    <group ref={group} scale={0.022} position={[1, -2.2, 0]}>
      <primitive object={fbx} />
    </group>
  );
}

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0.5, 8], fov: 40 }}>
      <ambientLight intensity={2} />

      <directionalLight position={[3, 5, 3]} intensity={5} />

      <pointLight position={[1, 1, 2]} intensity={8} color="cyan" />

      <EnergyRing radius={1.2} color="cyan" speed={0.01} y={-0.1} />

      <EnergyRing radius={1.55} color="#ffd166" speed={-0.006} y={-0.1} />

      <GarudaRex />

      <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
    </Canvas>
  );
}

function App() {
  const videoRef = useRef();
  const [started, setStarted] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user"
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStarted(true);
    } catch (err) {
      alert("Camera Error: Please allow camera permission.");
      console.error(err);
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

      <div className="title">GARUDA REX COMPANION</div>

      {!started && (
        <button className="startBtn" onClick={startCamera}>
          START CAMERA
        </button>
      )}

      {started && <div className="status">GARUDA REX ACTIVE</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
