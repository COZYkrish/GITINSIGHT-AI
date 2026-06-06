import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ConvSphere({ score }: { score: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  const positions = new Float32Array(600 * 3)
  for (let i = 0; i < 600; i++) {
    const phi = Math.acos(-1 + (2 * i) / 600)
    const theta = Math.sqrt(600 * Math.PI) * phi
    const r = 1.8 + Math.random() * 0.3
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.1
      particlesRef.current.rotation.x += delta * 0.05
    }
  })

  const color = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ec4899'

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.4}
          transparent opacity={0.15} wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.05} />
      </mesh>
      <Points ref={particlesRef} positions={positions} stride={3}>
        <PointMaterial transparent color={color} size={0.03} sizeAttenuation depthWrite={false} opacity={0.6} />
      </Points>
    </>
  )
}

export function ScoreSphere({ score }: { score: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ width: '100%', height: '100%' }} gl={{ alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} color={score >= 70 ? '#10b981' : '#f59e0b'} intensity={2} />
      <pointLight position={[-3, -2, 2]} color="#8b5cf6" intensity={1} />
      <ConvSphere score={score} />
    </Canvas>
  )
}
