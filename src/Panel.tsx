//@ts-nocheck
import { useFrame } from "@react-three/fiber"
import { useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { Instance, Instances } from "@react-three/drei"

const num = 100
const tempObject = new THREE.Object3D()
const tempPos = new THREE.Vector3()

const Panel = () => {
  const ref = useRef(null!)

  const vertices = useMemo(
    () =>
      new Float32Array([
        -0.25, 0.25, 0.0, 0.25, 0.25, 0.0, -0.25, -0.25, 0.0, 0.25, -0.25, 0.0,
      ])
  )

  const index = useMemo(() => new Uint16Array([0, 2, 1, 2, 3, 1]))

  const positions = useMemo(() => {
    const positions = []

    for (let i = 0; i < num; i++) {
      const tempPosition = new THREE.Vector3()

      const x = (i % 10) - 5
      const y = Math.floor(i / 10) - 5
      const z = 0
      positions[i] = tempPosition.set(x, y, z)
    }

    return positions
  })

  return (
    <Instances castShadow receiveShadow ref={ref} limit={num}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          array={vertices}
          count={vertices.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach='index'
          array={index}
          count={index.length}
          itemSize={1}
        />
      </bufferGeometry>
      <meshNormalMaterial side={THREE.DoubleSide} />
      {positions.map((position, i) => (
        <Pixel key={i} position={position} />
      ))}
    </Instances>
  )
}

const Pixel = ({ position }) => {
  const ref = useRef()

  useFrame(({ mouse, viewport }) => {
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2

    ref.current.position.set(...position)
    ref.current.lookAt(x, y, 0)
  })

  return <Instance ref={ref} />
}

export default Panel
