import { hsl2rgb } from "./hsl2rgb"
import { noise } from "./noise"

export const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec2 particleuv; 
    varying vec2 vUv; 
    varying float vWave; 
    varying float vWaveEdge; 
    varying float vTime; 
    varying float vStrength; 


    ${noise}
    ${hsl2rgb}

    void main() {

   
        //_  circular patterns
        float bigNoise = cnoise(vec3(particleuv.y, particleuv.x, 0.1)) * 8.0;
        float details = cnoise(vec3(bigNoise, 8.0, 8.0)); 
        details = floor(details);

        float direction = -vWave * 0.5;
 
        //_ color
        vec3 color = hsl2rgb(0.5 - details * 0.1 + direction, vStrength, vStrength + vWaveEdge);
        gl_FragColor = vec4(color, 1.0);
    }
`
