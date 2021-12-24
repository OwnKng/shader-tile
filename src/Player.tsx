import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"

const Player = () => {
  const ref = useRef<Mesh>(null!)

  useFrame(({ mouse, viewport }) => {
    const mouseX = (mouse.x * viewport.width) / 2
    const mouseY = (mouse.y * viewport.height) / 2

    ref.current.position.set(mouseX, mouseY, 0)
  })

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <pointLight castShadow intensity={0.1} distance={0} decay={4} />
      <sphereGeometry args={[0.25, 32]} />
      <meshPhongMaterial color='white' />
    </mesh>
  )
}

export default Player
