import { hsl2rgb } from "./hsl2rgb"
import { noise } from "./noise"

export const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec2 particleuv; 
    varying vec2 vUv; 
    varying float vTime; 
    varying vec2 vMouse; 
    varying vec3 vColor; 
    varying float vWave; 

    uniform sampler2D uTexture;

    ${noise}
    ${hsl2rgb}

    void main() {
        //_ depth strength
        vec4 col = texture2D(uTexture, particleuv);
        float strength = col.r * 0.21 + col.g * 0.71 + col.b * 0.07;
        if(strength < 0.2) discard;

        //_ color
        float colorStrength = (0.5 + strength * (1.0 - particleuv.x) * (1.0 - particleuv.y)); 
        vec3 color = hsl2rgb(0.6 + vWave * 0.4, 0.5 + vWave * 0.1, strength);
        
        //_ final color
        gl_FragColor = vec4(color, 1.0);
    }
`
