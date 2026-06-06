import { useRef, useState } from "react";

export default function App() {
  const videoRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [error, setError] = useState("");

  const startCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStarted(true);
      }
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาต Camera Permission และเปิดผ่านมือถือ/HTTPS");
    }
  };

  return (
    <div className="app">
      <video ref={videoRef} autoPlay playsInline muted className="camera" />

      {!cameraStarted && (
        <div className="startPanel">
          <div className="logoOrb">𓂀</div>
          <h1>NETJER COMPANION</h1>
          <p>เปิดกล้องหน้าเพื่อเรียก Netjer ข้างกายของคุณ</p>
          <button onClick={startCamera}>START CAMERA</button>
          {error && <div className="error">{error}</div>}
        </div>
      )}

      {cameraStarted && (
        <>
          <div className="energyCircle"></div>
          <div className="netjerAvatar">
            <div className="head"></div>
            <div className="body"></div>
            <div className="wing left"></div>
            <div className="wing right"></div>
            <div className="aura"></div>
          </div>
          <div className="title">NETJER ACTIVE</div>
          <div className="hint">Your guardian is beside you</div>
        </>
      )}
    </div>
  );
}
