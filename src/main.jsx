import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

function NetjerAura() {
  const auraRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!auraRef.current) return;

    auraRef.current.rotation.z = t * 0.6;
  });

  return (
    <group ref={auraRef} position={[1.2, -2.1, -0.2]}>
      <mesh>
        <torusGeometry args={[1.2, 0.02, 16, 100]} />

        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
        />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.45, 0.015, 16, 100]} />

        <meshStandardMaterial
          color="#ffd166"
          emissive="#ffb703"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

function AvatarFBX() {
  const model = useLoader(FBXLoader, "/models/avatar.fbx");

  const ref = useRef();

  const cloned = useMemo(() => {
    const c = model.clone(true);

    c.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();

          child.material.emissive = new THREE.Color("#003344");

          child.material.emissiveIntensity = 0.15;
        }
      }
    });

    return c;
  }, [model]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!ref.current) return;

    ref.current.rotation.y = Math.sin(t) * 0.25;

    ref.current.position.y = -2.1 + Math.sin(t * 2) * 0.05;
  });

  return (
    <group
      ref={ref}
      position={[1.2, -2.1, 0]}
      scale={[0.0015, 0.0015, 0.0015]}
    >
      <primitive object={cloned} />
    </group>
  );
}

function Scene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 40
      }}
    >
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
      />

      <pointLight
        position={[0, 2, 2]}
        intensity={2}
        color="#00ffff"
      />

      <Suspense fallback={null}>
        <NetjerAura />

        <AvatarFBX />
      </Suspense>

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

  const [started, setStarted] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      videoRef.current.srcObject = stream;

      setStarted(true);
    } catch (err) {
      alert("Please allow camera permission");
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "black"
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0
        }}
      >
        <Scene />
      </div>

      <div
        style={{
          position: "absolute",
          top: 20,
          width: "100%",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          letterSpacing: 4,
          textShadow: "0 0 15px cyan",
          fontSize: "32px"
        }}
      >
        NETJER FBX COMPANION
      </div>

      {!started && (
        <button
          onClick={startCamera}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "16px 30px",
            fontSize: "24px",
            borderRadius: "15px",
            border: "none",
            background: "cyan",
            color: "black",
            fontWeight: "bold"
          }}
        >
          START CAMERA
        </button>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
