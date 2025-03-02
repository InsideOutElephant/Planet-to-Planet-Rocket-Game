/**
 * 3D model/mesh creation for VR mode
 */

/**
 * Create a sphere mesh for planets and sun
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {number} radius - Sphere radius
 * @param {number} widthSegments - Number of horizontal segments
 * @param {number} heightSegments - Number of vertical segments
 * @returns {Object} Sphere mesh data
 */
function createSphere(gl, radius, widthSegments, heightSegments) {
    const positions = [];
    const normals = [];
    const texCoords = [];
    const indices = [];
    
    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));
    
    for (let y = 0; y <= heightSegments; y++) {
        const v = y / heightSegments;
        const phi = v * Math.PI;
        
        for (let x = 0; x <= widthSegments; x++) {
            const u = x / widthSegments;
            const theta = u * Math.PI * 2;
            
            // Calculate vertex position
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            
            const x = -radius * cosTheta * sinPhi;
            const y = radius * cosPhi;
            const z = radius * sinTheta * sinPhi;
            
            // Add vertex data
            positions.push(x, y, z);
            normals.push(x / radius, y / radius, z / radius);
            texCoords.push(u, v);
            
            // Add indices
            if (y < heightSegments && x < widthSegments) {
                const a = y * (widthSegments + 1) + x;
                const b = a + 1;
                const c = a + widthSegments + 1;
                const d = c + 1;
                
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }
    }
    
    // Create and bind vertex position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Create and bind normal buffer
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
    // Create and bind texture coordinate buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    
    // Create and bind index buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return {
        position: positionBuffer,
        normal: normalBuffer,
        texCoord: texCoordBuffer,
        indices: indexBuffer,
        count: indices.length
    };
}

/**
 * Create a ring mesh for planet orbits
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {number} radius - Ring radius
 * @param {number} segments - Number of segments
 * @returns {Object} Ring mesh data
 */
function createRing(gl, radius, segments) {
    const positions = [];
    const indices = [];
    
    segments = Math.max(24, Math.floor(segments));
    
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        
        positions.push(x, 0, z);
        
        if (i < segments) {
            indices.push(i, i + 1);
        }
    }
    
    // Close the ring
    indices.push(segments, 0);
    
    // Create and bind vertex position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Create and bind index buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return {
        position: positionBuffer,
        indices: indexBuffer,
        count: indices.length
    };
}

/**
 * Create a rocket mesh
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {number} size - Rocket size scale
 * @returns {Object} Rocket mesh data
 */
function createRocket(gl, size) {
    // Simplified rocket shape (cone with cylindrical body)
    const positions = [];
    const normals = [];
    const indices = [];
    
    // Parameters
    const bodyLength = size * 3;
    const bodyRadius = size;
    const noseLength = size * 2;
    const bodySegments = 12;
    const radialSegments = 12;
    
    // Create nose cone
    const tipIndex = 0;
    positions.push(0, bodyLength + noseLength, 0); // Rocket tip
    normals.push(0, 1, 0);
    
    // Base of nose cone (ring of vertices)
    for (let i = 0; i < radialSegments; i++) {
        const theta = (i / radialSegments) * Math.PI * 2;
        const x = Math.cos(theta) * bodyRadius;
        const z = Math.sin(theta) * bodyRadius;
        
        positions.push(x, bodyLength, z);
        
        // Approximate normals for cone
        const nx = x / Math.sqrt(x*x + noseLength*noseLength);
        const ny = noseLength / Math.sqrt(x*x + noseLength*noseLength);
        const nz = z / Math.sqrt(z*z + noseLength*noseLength);
        normals.push(nx, ny, nz);
        
        // Connect tip to base
        if (i < radialSegments - 1) {
            indices.push(tipIndex, i + 1, i + 2);
        } else {
            indices.push(tipIndex, i + 1, 1); // Close the cone
        }
    }
    
    // Create cylindrical body
    const baseIndex = positions.length / 3;
    
    // Generate rings of vertices along the body
    for (let j = 0; j <= bodySegments; j++) {
        const y = bodyLength - (j / bodySegments) * bodyLength;
        
        for (let i = 0; i < radialSegments; i++) {
            const theta = (i / radialSegments) * Math.PI * 2;
            const x = Math.cos(theta) * bodyRadius;
            const z = Math.sin(theta) * bodyRadius;
            
            positions.push(x, y, z);
            normals.push(x / bodyRadius, 0, z / bodyRadius);
            
            // Create faces
            if (j < bodySegments && i < radialSegments - 1) {
                const a = baseIndex + j * radialSegments + i;
                const b = baseIndex + j * radialSegments + i + 1;
                const c = baseIndex + (j + 1) * radialSegments + i;
                const d = baseIndex + (j + 1) * radialSegments + i + 1;
                
                indices.push(a, b, c);
                indices.push(b, d, c);
            } else if (j < bodySegments) {
                // Close the cylinder
                const a = baseIndex + j * radialSegments + i;
                const b = baseIndex + j * radialSegments;
                const c = baseIndex + (j + 1) * radialSegments + i;
                const d = baseIndex + (j + 1) * radialSegments;
                
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }
    }
    
    // Create and bind vertex position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Create and bind normal buffer
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
    // Create and bind index buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return {
        position: positionBuffer,
        normal: normalBuffer,
        indices: indexBuffer,
        count: indices.length
    };
}

/**
 * Create a star field (points)
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {Array} stars - Array of star data objects
 * @returns {Object} Star field mesh data
 */
function createStarField(gl, stars) {
    const positions = [];
    const sizes = [];
    const brightnesses = [];
    
    // Process star data
    for (const star of stars) {
        positions.push(...star.position);
        sizes.push(star.size);
        brightnesses.push(star.brightness);
    }
    
    // Create and bind vertex position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Create and bind size buffer
    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.STATIC_DRAW);
    
    // Create and bind brightness buffer
    const brightnessBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, brightnessBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(brightnesses), gl.STATIC_DRAW);
    
    return {
        position: positionBuffer,
        size: sizeBuffer,
        brightness: brightnessBuffer,
        count: stars.length
    };
}

/**
 * Create a quad mesh for UI elements
 * @param {WebGLRenderingContext} gl - WebGL context
 * @returns {Object} Quad mesh data
 */
function createQuad(gl) {
    const positions = [
        -1, -1, 0,
        1, -1, 0,
        1, 1, 0,
        -1, 1, 0
    ];
    
    const texCoords = [
        0, 0,
        1, 0,
        1, 1,
        0, 1
    ];
    
    const indices = [0, 1, 2, 0, 2, 3];
    
    // Create and bind vertex position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Create and bind texture coordinate buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    
    // Create and bind index buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return {
        position: positionBuffer,
        texCoord: texCoordBuffer,
        indices: indexBuffer,
        count: indices.length
    };
}

// Export model creation functions
export {
    createSphere,
    createRing,
    createRocket,
    createStarField,
    createQuad
};