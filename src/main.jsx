import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'

function Netjer3D() {
  const groupRef = useRef(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.35
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.18
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.4}>
      <group ref={groupRef} position={[1.25, -0.35, 0]}>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.34, 48, 48]} />
          <meshStandardMaterial
            color="#d9f7ff"
            emissive="#00eaff"
            emissiveIntensity={0.35}
            roughness={0.28}
            metalness={0.15}
          />
        </mesh>

        <mesh position={[0, 0.18, 0]}>
          <capsuleGeometry args={[0.34, 0.85, 8, 32]} />
          <meshStandardMaterial
            color="#101827"
            emissive="#005a76"
            emissiveIntensity={0.35}
            roughness={0.32}
            metalness={0.45}
          />
        </mesh>

        <mesh position={[-0.55, 0.28, 0]} rotation={[0, 0, 0.75]}>
          <capsuleGeometry args={[0.11, 0.75, 8, 24]} />
          <meshStandardMaterial color="#00cfff" emissive="#00eaff" emissiveIntensity={0.8} />
        </mesh>

        <mesh position={[0.55, 0.28, 0]} rotation={[0, 0, -0.75]}>
          <capsuleGeometry args={[0.11, 0.75, 8, 24]} />
          <meshStandardMaterial color="#00cfff" emissive="#00eaff" emissiveIntensity={0.8} />
        </mesh>

        <mesh position={[0, 0.18, -0.08]} scale={[1.8, 2.2, 0.08]}>
          <torusGeometry args={[0.48, 0.035, 16, 96]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.6}
            transparent
            opacity={0.8}
          />
        </mesh>

        <mesh position={[0, 0.2, -0.16]} scale={[1.3, 1.3, 1.3]}>
          <torusGeometry args={[0.72, 0.02, 16, 128]} />
          <meshStandardMaterial
            color="#ffd166"
            emissive="#ffb703"
            emissiveIntensity={1.2}
            transparent
            opacity={0.55}
          />
        </mesh>

        <pointLight position={[0, 1.5, 1]} intensity={3} color="#00eaff" />
      </group>
    </Float>
  )
}

function App() {
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [message, setMessage] = useState('')

  const startCamera = async () => {
    try {
      setMessage('')

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMessage('This browser does not support camera access.')
        return
      }

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
      console.error(err)
      setStarted(false)
      setMessage('Camera permission is required. Please allow camera access and press START CAMERA again.')
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
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)',
          zIndex: 1
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 4, 5]} intensity={2} />
          <Netjer3D />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>

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
        NETJER 3D COMPANION
      </div>

      {message && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '108px',
            transform: 'translateX(-50%)',
            width: '88%',
            maxWidth: '520px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.72)',
            color: 'white',
            textAlign: 'center',
            fontSize: '15px',
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
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
