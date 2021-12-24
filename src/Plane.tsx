import { useThree } from "@react-three/fiber"

const Plane = () => {
  const { viewport } = useThree()

  return (
    <mesh receiveShadow position={[0, 0, -2]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshPhongMaterial />
    </mesh>
  )
}

export default Plane
