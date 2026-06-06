import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setStarted(true)
    } catch (err) {
      alert('Camera Error: Please allow camera permission')
      console.error(err)
    }
  }

  useEffect(() => {
    startCamera()
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: 'black'
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)'
        }}
      />

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg"
        alt="netjer"
        style={{
          position: 'absolute',
          right: '5%',
          bottom: '10%',
          width: '35vw',
          maxWidth: '260px',
          borderRadius: '18px',
          animation: 'float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 0 22px cyan)',
          zIndex: 2
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '22px',
          left: 0,
          width: '100%',
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          letterSpacing: '3px',
          textShadow: '0 0 12px cyan',
          zIndex: 3
        }}
      >
        NETJER COMPANION
      </div>

      {!started && (
        <button
          onClick={startCamera}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '14px 24px',
            fontSize: '20px',
            border: 'none',
            borderRadius: '12px',
            background: 'cyan',
            color: 'black',
            fontWeight: 'bold',
            zIndex: 4
          }}
        >
          START CAMERA
        </button>
      )}

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
