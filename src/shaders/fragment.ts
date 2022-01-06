import { hsl2rgb } from "./hsl2rgb"
import { noise } from "./noise"

export const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec2 particleuv; 
    varying float vWave; 
    varying float vWaveEdge; 
    varying float vStrength; 
    varying float vTime; 
    varying vec2 vMouse; 
    varying float vRidge; 
    varying float vEyes;

    ${noise}
    ${hsl2rgb}

    void main() {
        float time = sin(vTime * 0.5) * 0.5 + 0.5;
        float noise = cnoise(vec3(particleuv, time * 0.5)) * vRidge;
        vec3 color = hsl2rgb(0.8 + noise * 0.5, vRidge, 0.9 - vRidge * 0.1);
        gl_FragColor = vec4(color, 1.0);
    }
`
