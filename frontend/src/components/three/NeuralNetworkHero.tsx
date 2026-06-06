import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function NeuralParticles() {
  const ref = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)

  const { positions, linePositions } = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const nodes: THREE.Vector3[] = []

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12
      const y = (Math.random() - 0.5) * 8
      const z = (Math.random() - 0.5) * 6
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      nodes.push(new THREE.Vector3(x, y, z))
    }

    // Create connections between nearby nodes
    const lineVerts: number[] = []
    const threshold = 2.5
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < threshold) {
          lineVerts.push(nodes[i].x, nodes[i].y, nodes[i].z)
          lineVerts.push(nodes[j].x, nodes[j].y, nodes[j].z)
        }
      }
    }

    return { positions, linePositions: new Float32Array(lineVerts) }
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.04
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
    }
  })

  return (
    <>
      <Points ref={ref} positions={positions} stride={3}>
        <PointMaterial
          transparent color="#3b82f6" size={0.06}
          sizeAttenuation depthWrite={false} opacity={0.8}
        />
      </Points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.12} />
      </lineSegments>
    </>
  )
}

function MouseReactiveSphere() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ mouse, clock }) => {
    if (ref.current) {
      ref.current.position.x += (mouse.x * 2 - ref.current.position.x) * 0.05
      ref.current.position.y += (mouse.y * 1.5 - ref.current.position.y) * 0.05
      ref.current.rotation.z = clock.elapsedTime * 0.2
    }
  })

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color="#3b82f6" wireframe transparent opacity={0.15}
        emissive="#3b82f6" emissiveIntensity={0.3}
      />
    </mesh>
  )
}

export function NeuralNetworkHero() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} color="#3b82f6" intensity={1} />
      <pointLight position={[-5, -3, 3]} color="#8b5cf6" intensity={0.8} />
      <NeuralParticles />
      <MouseReactiveSphere />
    </Canvas>
  )
}
