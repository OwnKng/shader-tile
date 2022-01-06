import { hsl2rgb } from "./hsl2rgb"
import { noise } from "./noise"

export const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec2 particleuv; 
    varying float vStrength; 
    varying float vTime; 
    varying vec2 vMouse; 

    ${noise}
    ${hsl2rgb}

    void main() {
        float time = sin(vTime * 0.5) * 0.5 + 0.5;
        vec2 grid = vec2(particleuv.x * 8.0, particleuv.y * 6.0);
        vec2 ipos = ceil(grid); 

        float checks = cnoise(vec3(ipos * 10.0 + time, vStrength * 0.5));

        vec3 color = hsl2rgb(0.5 + checks * 0.1, 0.5, vStrength);

        gl_FragColor = vec4(color, checks);
    }
`
