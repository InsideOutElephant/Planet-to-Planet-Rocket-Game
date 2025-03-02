/**
 * WebGL shaders for 3D rendering in VR mode
 */

// Vertex shader for basic objects
const basicVertexShader = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vPosition = worldPos.xyz;
    vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
    vTexCoord = aTexCoord;
    
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}
`;

// Fragment shader for basic objects
const basicFragmentShader = `
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

uniform vec3 uColor;
uniform vec3 uLightPosition;
uniform vec3 uAmbient;
uniform vec3 uDiffuse;
uniform vec3 uSpecular;
uniform float uShininess;
uniform float uAlpha;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightPosition - vPosition);
    
    // Ambient component
    vec3 ambient = uAmbient * uColor;
    
    // Diffuse component
    float diffuseIntensity = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = uDiffuse * diffuseIntensity * uColor;
    
    // Specular component (view-dependent)
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float specularIntensity = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = uSpecular * specularIntensity;
    
    // Combine components
    vec3 finalColor = ambient + diffuse + specular;
    
    gl_FragColor = vec4(finalColor, uAlpha);
}
`;

// Vertex shader for stars (simplified with only position)
const starVertexShader = `
attribute vec3 aPosition;
attribute float aSize;
attribute float aBrightness;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying float vBrightness;

void main() {
    vBrightness = aBrightness;
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
    gl_PointSize = aSize * (300.0 / gl_Position.w);
}
`;

// Fragment shader for stars
const starFragmentShader = `
precision mediump float;

varying float vBrightness;

void main() {
    // Calculate distance from center of point (circular shape)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distance = length(coord);
    
    // Circular shape with soft edge
    float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
    
    // Star color (white with brightness)
    vec3 color = vec3(1.0) * vBrightness;
    
    if (distance > 0.5) {
        discard;
    }
    
    gl_FragColor = vec4(color, alpha);
}
`;

// Vertex shader for sun with glow effect
const sunVertexShader = `
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vPosition = worldPos.xyz;
    vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
    
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}
`;

// Fragment shader for sun with glow effect
const sunFragmentShader = `
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 uViewPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(uViewPosition - vPosition);
    
    // Base color
    vec3 baseColor = uColor;
    
    // Edge glow effect
    float edgeFactor = 1.0 - max(0.0, dot(normal, viewDir));
    float glowIntensity = pow(edgeFactor, 2.0) * 1.5;
    
    vec3 glowColor = vec3(1.0, 0.8, 0.2); // Brighter yellow/orange for the glow
    vec3 finalColor = mix(baseColor, glowColor, glowIntensity);
    
    // Brighten center
    float centerIntensity = pow(1.0 - edgeFactor, 2.0) * 1.2;
    finalColor += centerIntensity * vec3(1.0, 1.0, 0.7);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// Vertex shader for planet orbits (lines)
const orbitVertexShader = `
attribute vec3 aPosition;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
}
`;

// Fragment shader for planet orbits (lines)
const orbitFragmentShader = `
precision mediump float;

uniform vec3 uColor;

void main() {
    gl_FragColor = vec4(uColor, 0.5); // Semi-transparent
}
`;

// Vertex shader for rocket particles (trail/boost)
const particleVertexShader = `
attribute vec3 aPosition;
attribute float aSize;
attribute vec4 aColor;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vColor;

void main() {
    vColor = aColor;
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
    gl_PointSize = aSize * (100.0 / gl_Position.w);
}
`;

// Fragment shader for rocket particles
const particleFragmentShader = `
precision mediump float;

varying vec4 vColor;

void main() {
    // Soft circular particle
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distance = length(coord);
    
    if (distance > 0.5) {
        discard;
    }
    
    // Fade out at edges
    float alpha = vColor.a * (1.0 - smoothstep(0.2, 0.5, distance));
    gl_FragColor = vec4(vColor.rgb, alpha);
}
`;

// Vertex shader for text in VR space
const textVertexShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoord;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
`;

// Fragment shader for text in VR space
const textFragmentShader = `
precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec3 uColor;

void main() {
    vec4 texColor = texture2D(uTexture, vTexCoord);
    gl_FragColor = vec4(uColor, texColor.a);
}
`;

// Export shaders
export {
    basicVertexShader,
    basicFragmentShader,
    starVertexShader,
    starFragmentShader,
    sunVertexShader,
    sunFragmentShader,
    orbitVertexShader,
    orbitFragmentShader,
    particleVertexShader,
    particleFragmentShader,
    textVertexShader,
    textFragmentShader
};