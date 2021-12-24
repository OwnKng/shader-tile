//@ts-nocheck
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const num = 100
const tempObject = new THREE.Object3D()
const tempPos = new THREE.Vector3()

const Panel = () => {
  const ref = useRef(null!)

  const vertices = useMemo(
    () =>
      new Float32Array([
        -0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0,
      ])
  )

  const index = useMemo(() => new Uint16Array([0, 2, 1, 2, 3, 1]))

  useFrame(({ mouse, viewport }) => {
    const mouseX = (mouse.x * viewport.width) / 2
    const mouseY = (mouse.y * viewport.height) / 2

    for (let i = 0; i < num; i++) {
      const x = (i % 10) - 5
      const y = Math.floor(i / 10) - 5
      const z = 0

      tempObject.position.set(x, y, z)
      tempPos.set(mouseX, mouseY, 2)
      tempObject.lookAt(tempPos)

      tempObject.updateMatrix()

      ref.current.setMatrixAt(i, tempObject.matrix)
    }

    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[null, null, num]}>
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
      <meshBasicMaterial color='cyan' wireframe />
    </instancedMesh>
  )
}

export default Panel
