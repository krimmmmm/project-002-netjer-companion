import { useEffect, useRef, useState } from "react";

export default function App() {
  const videoRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);

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

      setCameraStarted(true);
    } catch (error) {
      console.error(error);
      alert("Cannot access camera");
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

      <img
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop"
        alt="Netjer"
        className="netjer"
      />

      <div className="title">
        NETJER COMPANION
      </div>

      {!cameraStarted && (
        <button
          onClick={startCamera}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 24px",
            fontSize: "18px",
            borderRadius: "12px",
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
