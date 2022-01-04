//@ts-nocheck
import { Canvas } from "@react-three/fiber"
import Panel from "./Panel"
import { Suspense } from "react"

const Scene = () => (
  <Canvas
    camera={{ position: [-20, 60, 280] }}
    onCreated={({ camera }) => camera.lookAt(0, 40, 0)}
  >
    <Suspense fallback={null}>
      <Panel />
    </Suspense>
  </Canvas>
)

export default Scene
