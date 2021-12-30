import { Canvas } from "@react-three/fiber"
import Panel from "./Panel"
import { Suspense } from "react"
import { OrbitControls } from "@react-three/drei"

const Scene = () => (
  <Canvas shadows camera={{ position: [-120, 100, 400] }}>
    <ambientLight intensity={0.1} />
    <Suspense fallback={null}>
      <OrbitControls />
      <Panel />
    </Suspense>
  </Canvas>
)

export default Scene
