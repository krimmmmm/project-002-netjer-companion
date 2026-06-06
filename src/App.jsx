import { useEffect, useRef } from "react";

export default function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    startCamera();
  }, []);

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
    } catch (error) {
      console.error(error);
      alert("Cannot access camera");
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

      <img
        src="https://i.imgur.com/8QfQF0P.png"
        alt="Netjer"
        className="netjer"
      />

      <div className="title">
        NETJER COMPANION
      </div>
    </div>
  );
}
