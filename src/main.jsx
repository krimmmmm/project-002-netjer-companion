import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import * as THREE from "three";

function Avatar() {
  const group = useRef();

  // โหลด FBX
  const fbx = useFBX("/models/avatar.fbx");

  // AUTO CENTER + AUTO SCALE
  React.useEffect(() => {
    if (!fbx) return;

    const box = new THREE.Box3().setFromObject(fbx);

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // จัดตำแหน่งให้อยู่กลาง
    fbx.position.x -= center.x;
    fbx.position.y -= center.y;

    // คำนวณ scale อัตโนมัติ
    const maxAxis = Math.max(size.x, size.y, size.z);

    const scale = 2.5 / maxAxis;

    fbx.scale.set(scale, scale, scale);

    // ยกตัวขึ้นนิด
    fbx.position.y = -1.5;
  }, [fbx]);

  // หมุนช้า ๆ
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={group}>
      <primitive object={fbx} />
    </group>
  );
}

function App() {
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
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

      {/* 3D */}
      <div className="avatar3d">
        <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 5, 3]} intensity={3} />

          <Avatar />

          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Canvas>
      </div>

      <button className="startBtn" onClick={startCamera}>
        START CAMERA
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
