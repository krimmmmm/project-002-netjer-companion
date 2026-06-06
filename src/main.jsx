import React, { useRef } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";

function Avatar() {
  const group = useRef();

  const fbx = useFBX("/models/avatar.fbx");

  // หมุนช้า ๆ
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group
      ref={group}
      scale={0.018}
      position={[0, -2.5, 0]}
    >
      <primitive object={fbx} />
    </group>
  );
}

function App() {
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true
        });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
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

      <div className="title">
        NETJER FBX COMPANION
      </div>

      <div className="avatar3d">
        <Canvas camera={{ position: [0, 1, 8], fov: 40 }}>
          <ambientLight intensity={2} />

          <directionalLight
            position={[3, 5, 3]}
            intensity={5}
          />

          <directionalLight
            position={[-3, 5, -3]}
            intensity={2}
          />

          <Avatar />

          <OrbitControls
            enableZoom={false}
            autoRotate={false}
          />
        </Canvas>
      </div>

      <button
        className="startBtn"
        onClick={startCamera}
      >
        START CAMERA
      </button>
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
