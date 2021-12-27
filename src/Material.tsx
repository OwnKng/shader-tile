//@ts-nocheck
import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RawShaderMaterial } from "three"
import { noise } from "./noise"

const vertexShader = /* glsl */ `
    precision highp float;
	uniform mat4 modelViewMatrix;
	uniform mat4 projectionMatrix;
	uniform float uTime;
    uniform vec2 uTextureSize; 
    uniform float uRandom;
    uniform float uDepth; 
    uniform sampler2D uTexture;

	attribute vec3 position;
	attribute vec2 uv;
	attribute vec3 offset;
    attribute float pindex; 

    varying vec2 particleVuv; 
    varying vec2 vUv; 
    varying float vTime; 

    float random(float n) {
	    return fract(sin(n) * 43758.5453123);
    }

    ${noise}
 
    void main() {
        vec3 displaced = offset; 

        //_ particle uv coords
        particleVuv = offset.xy / uTextureSize;
        vUv = uv; 

        //_ get the darker image areas
        vec4 col = texture2D(uTexture, particleVuv);
        float grey = 1.0 - (col.r * 0.21 + col.g * 0.71 + col.b * 0.07);
  
        //_ randomise the particle position
        displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
        float rndz = (random(pindex) + noise(vec2(pindex * 0.1, uTime * 0.1)));
        displaced.z *= grey;
        displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
      

        //_ scale the particles
        float psize = (noise(vec2(uTime, pindex) * 0.5) + 2.0);
        psize *= 0.2;
        psize *= max(grey, 0.2);
        
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        mvPosition.xyz += position * psize;
        gl_Position = projectionMatrix * mvPosition;

        //_ pass the varyings
        vTime = uTime; 
    }
`

const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec2 particleVuv; 
    varying vec2 vUv; 
    varying float vTime; 

    uniform sampler2D uTexture;

    void main() {
            vec4 color = vec4(0.0);
            
            //_ pixel color
            vec4 col = texture2D(uTexture, particleVuv);

        	//_ greyscale
            float grey = 1.0 - (col.r * 0.21 + col.g * 0.71 + col.b * 0.07);
            vec4 colB = vec4(grey, grey, grey, 1.0);

            //_ alpha
            float border = 0.3;
            float radius = 0.5; 
            float dist = radius - distance(vUv, vec2(0.5));
            float alpha = smoothstep(0.0, border, dist);

            //_ final color
            color = colB; 
            color.a = 1.0; 

            gl_FragColor = color;
    }
`

const Material = ({ texture }: any) => {
  const { image } = texture
  const ref = useRef<RawShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uTexture: { value: texture },
      uTextureSize: { value: new THREE.Vector2(image.width, image.height) },
      uRandom: { value: 1.0 },
      uDepth: { value: 2.0 },
    }),
    [texture]
  )

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    ref.current.uniforms.uTime.value = time
  })

  return (
    <rawShaderMaterial
      ref={ref}
      uniforms={uniforms}
      fragmentShader={fragmentShader}
      vertexShader={vertexShader}
      transparent={true}
      blending={THREE.AdditiveBlending}
    />
  )
}

export default Material
