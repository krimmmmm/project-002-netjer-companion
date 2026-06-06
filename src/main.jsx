import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

function NetjerAura() {
  const auraRef = useRef(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!auraRef.current) return;

    auraRef.current.rotation.z = time * 0.7;
    auraRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
  });

  return (
    <group ref={auraRef} position={[1.15, -0.65, -0.25]}>
      <mesh>
        <torusGeometry args={[0.52, 0.012, 16, 128]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.8}
          transparent
          opacity={0.78}
        />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.66, 0.009, 16, 128]} />
        <meshStandardMaterial
          color="#ffd166"
          emissive="#ffb703"
          emissiveIntensity={1.2}
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  );
}

function AvatarFBX() {
  const model = useLoader(FBXLoader, "/models/avatar.fbx");
  const avatarRef = useRef(null);

  const clonedModel = useMemo(() => {
    const clone = model.clone(true);

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();
          child.material.emissive = new THREE.Color("#002a33");
          child.material.emissiveIntensity = 0.12;
          child.material.roughness = 0.35;
          child.material.metalness = 0.08;
        }
      }
    });

    return clone;
  }, [model]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!avatarRef.current) return;

    avatarRef.current.position.y = -1.05 + Math.sin(time * 1.6) * 0.04;
    avatarRef.current.rotation.y = Math.sin(time * 0.8) * 0.22;
  });

  return (
    <group
      ref={avatarRef}
      position={[1.15, -1.05, 0]}
      rotation={[0, Math.PI, 0]}
      scale={[0.00045, 0.00045, 0.00045]}
    >
      <primitive object={clonedModel} />
      <pointLight position={[0, 120, 80]} intensity={2.5} color="#00eaff" />
    </group>
  );
}

function NetjerScene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 45
      }}
      gl={{
        alpha: true,
        antialias: true
      }}
      shadows
    >
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 5, 6]} intensity={2.4} />
      <pointLight position={[0, 2, 3]} intensity={2.5} color="#00eaff" />

      <Suspense fallback={null}>
        <NetjerAura />
        <AvatarFBX />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
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
      setMessage(
        "Camera permission is required. Please allow camera access and press START CAMERA again."
      );
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
        playsInline
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
          zIndex: 1
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none"
        }}
      >
        <NetjerScene />
      </div>

      <div
        style={{
          position: "absolute",
          top: "18px",
          left: 0,
          width: "100%",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          letterSpacing: "3px",
          textShadow: "0 0 12px cyan",
          fontSize: "clamp(18px, 4vw, 30px)",
          zIndex: 3
        }}
      >
        NETJER FBX COMPANION
      </div>

      {message && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "108px",
            transform: "translateX(-50%)",
            width: "88%",
            maxWidth: "520px",
            padding: "12px 14px",
            borderRadius: "12px",
            background: "rgba(0,0,0,0.72)",
            color: "white",
            textAlign: "center",
            fontSize: "15px",
            zIndex: 4
          }}
        >
          {message}
        </div>
      )}

      {!started && (
        <button
          onClick={startCamera}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 24px",
            fontSize: "20px",
            border: "none",
            borderRadius: "12px",
            background: "cyan",
            color: "black",
            fontWeight: "bold",
            zIndex: 4
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
