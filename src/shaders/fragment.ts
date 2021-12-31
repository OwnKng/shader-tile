import { hsl2rgb } from "./hsl2rgb"
import { noise } from "./noise"

export const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec2 particleuv; 
    varying vec2 vUv; 
    varying float vWave; 
    varying float vWaveEdge; 


    uniform sampler2D uTexture;

    ${noise}
    ${hsl2rgb}

    void main() {
        //_ depth strength
        vec4 col = texture2D(uTexture, particleuv);
        float strength = col.r * 0.21 + col.g * 0.71 + col.b * 0.07;

        //_ strips
        float colorStripe = mod(particleuv.y * 4.0, 1.0);
        colorStripe = 0.5 + strength * colorStripe * 0.5 + (vWave * 0.1);
        
        //_ color
        vec3 color = hsl2rgb(colorStripe, strength, strength + vWaveEdge);
        
        //_ final color
        gl_FragColor = vec4(color, 1.0);
    }
`
