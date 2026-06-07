import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import * as THREE from "three";

function EnergyRing({ radius = 1.15, color = "#00ffff", speed = 0.01, z = -0.18 }) {
  const ringRef = useRef(null);

  useFrame(() => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += speed;
  });

  return (
    <mesh ref={ringRef} position={[0.95, -0.1, z]}>
      <torusGeometry args={[radius, 0.018, 16, 160]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

function EnergyCore() {
  const coreRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!coreRef.current) return;

    const s = 1 + Math.sin(t * 2.5) * 0.08;
    coreRef.current.scale.set(s, s, s);
    coreRef.current.rotation.z = t * 0.8;
  });

  return (
    <group ref={coreRef} position={[0.95, -0.15, -0.22]}>
      <mesh>
        <torusGeometry args={[1.45, 0.012, 16, 160]} />
        <meshStandardMaterial
          color="#ffd166"
          emissive="#ffb703"
          emissiveIntensity={1.3}
          transparent
          opacity={0.55}
        />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.02, 0.012, 16, 160]} />
        <meshStandardMaterial
          color="#7df9ff"
          emissive="#00ffff"
          emissiveIntensity={1.4}
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  );
}

function Avatar() {
  const group = useRef(null);
  const fbx = useFBX("/models/avatar.fbx");

  useEffect(() => {
    if (!fbx) return;

    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();
          child.material.emissive = new THREE.Color("#111111");
          child.material.emissiveIntensity = 0.08;
          child.material.roughness = 0.38;
          child.material.metalness = 0.08;
        }
      }
    });
  }, [fbx]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!group.current) return;

    group.current.position.y = -2.35 + Math.sin(t * 1.7) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.85) * 0.25;
  });

  return (
    <group
      ref={group}
      position={[1.05, -2.35, 0]}
      scale={0.022}
      rotation={[0, 0, 0]}
    >
      <primitive object={fbx} />
    </group>
  );
}

function NetjerScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 8], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      shadows
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 6, 5]} intensity={4.2} />
      <directionalLight position={[-4, 4, -4]} intensity={1.8} />
      <pointLight position={[1.2, 0.4, 3]} intensity={3.8} color="#00ffff" />
      <pointLight position={[0.8, -1.4, 2]} intensity={2.2} color="#ffdd66" />

      <EnergyCore />
      <EnergyRing radius={1.22} color="#00ffff" speed={0.012} z={-0.2} />
      <EnergyRing radius={1.55} color="#ffd166" speed={-0.007} z={-0.24} />
      <Avatar />

      <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
    </Canvas>
  );
}

function App() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState("");

  const startCamera = async () => {
    try {
      setMessage("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMessage("This browser does not support camera access.");
        return;
      }

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
      console.error(err);
      setStarted(false);
      setMessage("Please allow camera permission, then press START CAMERA again.");
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div className="app">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera"
      />

      <div className="netjerLayer">
        <NetjerScene />
      </div>

      <div className="title">NETJER FBX COMPANION</div>

      {message && <div className="message">{message}</div>}

      {!started && (
        <button className="startBtn" onClick={startCamera}>
          START CAMERA
        </button>
      )}

      {started && (
        <div className="statusPill">
          3D NETJER ACTIVE
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
