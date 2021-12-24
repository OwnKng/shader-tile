import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Panel from "./Panel"
import Player from "./Player"
import Plane from "./Plane"

const Scene = () => (
  <Canvas shadows camera={{ position: [0, 0, 10] }}>
    <OrbitControls />
    <ambientLight intensity={0.1} />
    <Player />
    <Plane />
    <Panel />
  </Canvas>
)

export default Scene
