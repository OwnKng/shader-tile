import { Canvas } from "@react-three/fiber"
import Panel from "./Panel"
import { Suspense } from "react"

const Scene = () => (
  <Canvas camera={{ position: [-100, 80, 450] }}>
    <Suspense fallback={null}>
      <Panel />
    </Suspense>
  </Canvas>
)

export default Scene
