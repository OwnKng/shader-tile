import { useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import Material from "./Material"

const numPoints = 10000
const tempObject = new THREE.Object3D()

const Image = () => {
  const ref = useRef(null!)

  const positions = useMemo(
    () =>
      new Float32Array([
        -0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0,
      ]),
    []
  )

  const uvs = useMemo(
    () => new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]),
    []
  )

  const index = new Uint16Array([0, 2, 1, 2, 3, 1])

  // for the pixels

  const { indices, offsets } = useMemo(() => {
    const indices = new Uint16Array(numPoints)
    const offsets = new Float32Array(numPoints * 3)

    for (let i = 0; i < numPoints; i++) {
      offsets[i * 3 + 0] = i % 100
      offsets[i * 3 + 1] = Math.floor(i / 3)

      indices[i] = i
    }

    return { indices, offsets }
  }, [])

  return (
    <instancedMesh ref={ref} args={[null, null, numPoints]}>
      <instancedBufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "uvs"]}
          array={uvs}
          count={uvs.length / 2}
          itemSize={2}
        />
        <bufferAttribute
          attach='index'
          array={index}
          count={index.length}
          itemSize={1}
        />
        <instancedBufferAttribute
          attachObject={["attributes", "offset"]}
          args={[offsets, 3]}
        />
        <instancedBufferAttribute
          attachObject={["attributes", "pindex"]}
          args={[indices, 1]}
        />
      </instancedBufferGeometry>
      <Material />
    </instancedMesh>
  )
}

export default Image
