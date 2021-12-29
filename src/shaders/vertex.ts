import { noise } from "./noise"

export const vertexShader = /* glsl */ `
    precision highp float;
	uniform mat4 modelViewMatrix;
	uniform mat4 projectionMatrix;
	uniform float uTime;
    uniform vec2 uTextureSize; 
    uniform float uRandom;
    uniform float uDepth; 
    uniform sampler2D uTexture;
    uniform vec2 uMouse; 
   
	attribute vec3 position;
	attribute vec2 uv;
	attribute vec3 offset;
    attribute float pindex; 
    attribute vec3 pColor; 

    varying vec2 particleuv; 
    varying vec2 vUv; 
    varying float vTime; 
    varying float vWave;


    float random(float n) {
	    return fract(sin(n) * 43758.5453123);
    }

    ${noise}
 
    void main() {
        vec3 displaced = offset; 

        //_ particle uv coords
        particleuv = offset.xy / uTextureSize;
        vUv = uv; 

        //_ get the darker image areas
        vec4 col = texture2D(uTexture, particleuv);
        float strength = col.r * 0.21 + col.g * 0.71 + col.b * 0.07;

        float rndz = (random(pindex) + noise(vec2(pindex * 0.1, uTime * 0.1))) * 4.0;

        //_ randomise the particle position
        displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
        displaced.xy += (strength + noise(vec2(pindex * 0.1, uTime * 0.1))) * 10.0;
        displaced.z += (strength + noise(vec2(pindex * 0.1, uTime * 0.1))) * 40.0;

        //_ wave
        float wave = 1.0 - step(0.3, abs(distance(particleuv, vec2(uMouse)) - 0.25));
        displaced.xy += wave * 5.0;
        displaced.z += wave * 10.0;

        //_ tails 
        float rightTails = smoothstep(0.82, 1.0, particleuv.x); 
        float leftTails = 1.0 - smoothstep(0.0, 0.4, particleuv.x);

        displaced.x += rightTails * 200.0 * (uMouse.x + 1.0);
        displaced.x += leftTails * 5.0 * (uMouse.x - 1.0); 
  
        //_ scale the particles
        float psize = (noise(vec2(uTime, pindex) * 0.5) + 2.0);
        psize *= 0.6;
        psize *= max(strength, 0.2);
         
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        mvPosition.xyz += position * psize;
         
        gl_Position = projectionMatrix * mvPosition;

        //_ pass the varyings
        vTime = uTime; 
        vWave = wave; 
    }
`