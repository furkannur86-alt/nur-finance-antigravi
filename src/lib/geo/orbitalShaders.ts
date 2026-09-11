/**
 * NUR EARTH 3D — Custom Three.js Shaders for Atmospheric Glow, FLIR & DEFCON-1
 */

import * as THREE from "three";

/**
 * Atmospheric Fresnel Scattering Shader Material
 * Produces a realistic glowing blue Rayleigh atmosphere on the limb/rim of the planet.
 */
export function createAtmosphericGlowMaterial(color = 0x38bdf8, intensity = 1.2): THREE.ShaderMaterial {
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 glowColor;
    uniform float coef;
    uniform float power;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewCameraDir = normalize(-vPosition);
      float intensity = pow(coef - dot(vNormal, viewCameraDir), power);
      gl_FragColor = vec4(glowColor, intensity * 0.85);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      coef: { value: 0.95 },
      power: { value: 3.2 },
      glowColor: { value: new THREE.Color(color).multiplyScalar(intensity) },
    },
    vertexShader,
    fragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

/**
 * DEFCON 1 / Tactical Wireframe Hologram Material
 */
export function createDefconHoloMaterial(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: 0xef4444,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
  });
}
