import { noise } from "./noise"

export const vertexShader = /* glsl */ `
    precision highp float;

	uniform mat4 modelViewMatrix;
	uniform mat4 projectionMatrix;
	uniform float uTime;
    uniform vec2 uTextureSize; 
    uniform vec2 uMouse; 

    uniform sampler2D uTexture;

	attribute vec3 position;
	attribute vec2 uv;
	attribute vec3 offset;
    attribute float pindex; 

    varying vec2 particleuv; 
    varying float vWave;
    varying float vWaveEdge; 
    varying float vStrength; 
    varying float vTime; 
    varying vec2 vMouse; 
    varying float vRidge; 
    varying float vEyes; 

    float random(float n) {
	    return fract(sin(n) * 43758.5453123);
    }

    ${noise}
 
    void main() {
        vec3 displaced = offset; 

        //_ particle uv coords
        particleuv = offset.xy / uTextureSize;

        //_ get the lighter image areas
        vec4 col = texture2D(uTexture, particleuv);
        float strength = col.r * 0.21 + col.g * 0.71 + col.b * 0.07;

        //_ particle position
        displaced.z += strength * 20.0;

        //_ eyeline
        float eyeLevel = 0.56; 
        float eye = step(eyeLevel, particleuv.y);
        float eyeEdge = step(eyeLevel, particleuv.y) + (1.0 - step(eyeLevel + 0.03, particleuv.y)) - 1.0;

        displaced.xyz += eye * 2.0;
        displaced.z += eyeEdge * 10.0;

        //_ tear
        float time = sin(uTime) * 0.5 + 0.5;
        float edge = 0.6;
        vec2 wavePattern = vec2(particleuv.x + sin(particleuv.y * 25.0), particleuv.y + sin(particleuv.x * 25.0)); 
        edge += cnoise(vec3(wavePattern + time * 0.25, strength)) * 0.1; 

        float alpha = step(edge, distance(vec2(particleuv.xy), vec2(0.0)));
        float alphaEdge = alpha + (1.0 - step(edge + 0.2, distance(vec2(particleuv.xy), vec2(0.0)))) - 1.0;
        displaced.z += alphaEdge * 2.0;

        //_ size
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        float pSize = strength * ((alphaEdge + 2.0) / 2.0);
        pSize *= 0.8;
        pSize *= 1.0 - eyeEdge; 

        //_ final position
        mvPosition.xyz += position * pSize;
        gl_Position = projectionMatrix * mvPosition;

        //_ pass the varyings
        vTime = uTime; 
        vStrength = strength; 
        vMouse = uMouse; 
        vRidge = alphaEdge; 
        vEyes = eyeEdge; 
    }
`
