import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RawShaderMaterial, Vector2 } from "three"
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
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [texture, image]
  )

  useFrame(({ clock, mouse, viewport }) => {
    ref.current.uniforms.uTime.value = clock.getElapsedTime()
    ref.current.uniforms.uMouse.value = new Vector2(
      mouse.x * 0.5 + 0.5,
      mouse.y
    )

    ref.current.uniformsNeedUpdate = true
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
