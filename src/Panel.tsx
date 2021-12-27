//@ts-nocheck
import { useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import Material from "./Material"
import { useTexture } from "@react-three/drei"

const Panel = () => {
  const ref = useRef(null!)

  const texture = useTexture("bio.png")
  const width = texture.image.width
  const height = texture.image.height
  const num = width * height

  const vertices = useMemo(
    () =>
      new Float32Array([
        -0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0,
      ]),
    []
  )

  const index = useMemo(() => new Uint16Array([0, 2, 1, 2, 3, 1]), [vertices])

  const { offsets, indices } = useMemo(() => {
    const offsets = new Float32Array(num * 3)
    const indices = new Uint16Array(num)

    for (let i = 0; i < num; i++) {
      offsets[i * 3 + 0] = i % width
      offsets[i * 3 + 1] = Math.floor(i / width)
      offsets[i * 3 + 2] = 0

      indices[i] = i
    }

    return { offsets, indices }
  }, [vertices])

  const uvs = useMemo(
    () => new Float32Array([0, 0, 0, 1.0, 1.0, 0, 1.0, 1.0]),
    [vertices]
  )

  useLayoutEffect(() => {
    ref.current.setMatrixAt(0, new THREE.Matrix4())
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      position={[-width / 2, -height / 2, 0]}
      args={[null, null, num]}
      ref={ref}
    >
      <bufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          args={[vertices, 3]}
        />
        <bufferAttribute attachObject={["attributes", "uv"]} args={[uvs, 2]} />
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
      </bufferGeometry>
      <Material texture={texture} />
    </instancedMesh>
  )
}

export default Panel
