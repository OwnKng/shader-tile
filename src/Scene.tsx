import { Canvas } from "@react-three/fiber"
import Panel from "./Panel"
import { Suspense } from "react"

const Scene = () => (
  <Canvas shadows camera={{ position: [-100, 100, 400] }}>
    <ambientLight intensity={0.1} />
    <Suspense fallback={null}>
      <Panel />
    </Suspense>
  </Canvas>
)

export default Scene
