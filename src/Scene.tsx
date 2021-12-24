import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Panel from "./Panel"
import Player from "./Player"

const Scene = () => (
  <Canvas camera={{ position: [0, 0, 10] }}>
    <Panel />
    <OrbitControls />
    <Player />
  </Canvas>
)

export default Scene
