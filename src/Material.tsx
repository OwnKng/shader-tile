import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RawShaderMaterial } from "three"
import { vertexShader } from "./shaders/vertex"
import { fragmentShader } from "./shaders/fragment"

const Material = ({ texture }: any) => {
  const { image } = texture
  const ref = useRef<RawShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uTexture: { value: texture },
      uTextureSize: { value: new THREE.Vector2(image.width, image.height) },
      uRandom: { value: 10.0 },
      uDepth: { value: 2.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  )

  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime()
    ref.current.uniforms.uTime.value = time

    const y = mouse.y / 2 + 1
    const x = THREE.MathUtils.lerp(
      ref.current.uniforms.uMouse.value.x,
      mouse.x,
      0.1
    )

    ref.current.uniforms.uMouse.value = new THREE.Vector2(x, y)
  })

  return (
    <rawShaderMaterial
      ref={ref}
      uniforms={uniforms}
      fragmentShader={fragmentShader}
      vertexShader={vertexShader}
      transparent={true}
    />
  )
}

export default Material
