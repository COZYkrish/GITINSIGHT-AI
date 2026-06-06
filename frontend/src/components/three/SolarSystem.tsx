import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PLANETS = [
  { name: 'Portfolio Score', color: '#3b82f6', radius: 0.25, orbit: 2.2, speed: 0.8, angle: 0 },
  { name: 'AI Recruiter', color: '#8b5cf6', radius: 0.22, orbit: 3.0, speed: 0.6, angle: 1 },
  { name: 'Repo Ranking', color: '#06b6d4', radius: 0.2, orbit: 3.8, speed: 0.5, angle: 2 },
  { name: 'README', color: '#10b981', radius: 0.18, orbit: 4.5, speed: 0.4, angle: 3 },
  { name: 'Wrapped', color: '#f59e0b', radius: 0.22, orbit: 5.2, speed: 0.35, angle: 4 },
  { name: 'AI Mentor', color: '#ec4899', radius: 0.2, orbit: 5.9, speed: 0.3, angle: 5 },
  { name: 'Career', color: '#8b5cf6', radius: 0.18, orbit: 6.6, speed: 0.25, angle: 0.5 },
  { name: 'LinkedIn', color: '#06b6d4', radius: 0.16, orbit: 7.2, speed: 0.22, angle: 1.5 },
]

function Planet({ color, radius, orbit, speed, angle: initAngle }: typeof PLANETS[0]) {
  const ref = useRef<THREE.Mesh>(null)
  const angle = useRef(initAngle)

  useFrame((_, delta) => {
    angle.current += speed * delta
    if (ref.current) {
      ref.current.position.x = Math.cos(angle.current) * orbit
      ref.current.position.z = Math.sin(angle.current) * orbit
      ref.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  )
}

function OrbitRing({ radius }: { radius: number }) {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
  }
  const geom = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={geom}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
    </line>
  )
}

function CenterGlobe() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.2 })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} wireframe />
    </mesh>
  )
}

export function SolarSystem() {
  return (
    <Canvas camera={{ position: [0, 6, 12], fov: 55 }} style={{ position: 'absolute', inset: 0 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} color="#3b82f6" intensity={3} />
      <CenterGlobe />
      {PLANETS.map((p) => (
        <group key={p.name}>
          <OrbitRing radius={p.orbit} />
          <Planet {...p} />
        </group>
      ))}
    </Canvas>
  )
}
