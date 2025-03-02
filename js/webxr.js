/**
 * VR support for the Planet to Planet Rocket Game
 * Uses WebXR API for immersive VR experience
 */

// Import required modules
import { mat4, vec3 } from './vr-math.js';
import * as shaders from './vr-shaders.js';
import { createSphere, createRing, createRocket, createStarField, createQuad } from './vr-models.js';

// VR state variables
let xrSession = null;
let xrReferenceSpace = null;
let xrViewerSpace = null;
let xrHitTestSource = null;
let gl = null;
let vrCanvas = null;
let vrMode = false;

// VR controller state
let leftController = null;
let rightController = null;
let controllerGrip = false;

// XR required matrices and data
let projectionMatrix = mat4.create();
let viewMatrix = mat4.create();
let viewMatrixInverse = mat4.create();

// 3D scene objects
let vrSun, vrPlanet1, vrPlanet2, vrRocket;
let vrStars = [];

// WebGL program objects
let basicProgram, starProgram, sunProgram, orbitProgram, particleProgram, textProgram;

// 3D meshes
let sphereMesh, ringMesh, rocketMesh, starsMesh, quadMesh;

/**
 * Initialize WebXR capabilities
 * @param {HTMLCanvasElement} canvas - The canvas element for rendering
 */
function initWebXR(canvas) {
    // Store canvas for later use
    vrCanvas = canvas;
    
    // Check if WebXR is available
    if (navigator.xr) {
        // Initialize WebGL for XR
        gl = canvas.getContext('webgl', { xrCompatible: true });
        if (!gl) {
            console.error('WebGL not available for XR');
            return;
        }
        
        // Add VR button if VR is supported
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            if (supported) {
                createVRButton();
            }
        });
    } else {
        console.log('WebXR not supported in this browser');
    }
}

/**
 * Create a button to enter VR mode
 */
function createVRButton() {
    const vrButton = document.createElement('button');
    vrButton.id = 'vrButton';
    vrButton.textContent = 'Enter VR';
    vrButton.className = 'vr-button';
    document.body.appendChild(vrButton);
    
    vrButton.addEventListener('click', startVRSession);
}

/**
 * Start a WebXR VR session
 */
async function startVRSession() {
    if (navigator.xr) {
        try {
            xrSession = await navigator.xr.requestSession('immersive-vr', {
                requiredFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
                optionalFeatures: ['hit-test']
            });
            
            // Set up session events
            xrSession.addEventListener('end', onVRSessionEnded);
            
            // Initialize VR-compatible rendering
            await initVRRendering();
            
            // Switch game to VR mode
            enterVRMode();
            
            // Start the XR rendering loop
            xrSession.requestAnimationFrame(onXRFrame);
        } catch (error) {
            console.error('Error starting VR session:', error);
        }
    }
}

/**
 * Initialize WebGL rendering for VR
 */
async function initVRRendering() {
    // Configure WebGL for XR
    gl.canvas.width = vrCanvas.width;
    gl.canvas.height = vrCanvas.height;
    
    // Initialize WebGL layer
    const glLayer = new XRWebGLLayer(xrSession, gl);
    xrSession.updateRenderState({ baseLayer: glLayer });
    
    // Get reference space
    xrReferenceSpace = await xrSession.requestReferenceSpace('local-floor');
    xrViewerSpace = await xrSession.requestReferenceSpace('viewer');
    
    // Initialize WebGL programs
    initShaderPrograms();
    
    // Initialize controller tracking
    setupVRControllers();
    
    // Convert game objects to 3D representations
    createVR3DObjects();
}

/**
 * Initialize WebGL shader programs
 */
function initShaderPrograms() {
    // Create basic shader program for planets and rocket
    basicProgram = createShaderProgram(gl, shaders.basicVertexShader, shaders.basicFragmentShader);
    
    // Create star shader program
    starProgram = createShaderProgram(gl, shaders.starVertexShader, shaders.starFragmentShader);
    
    // Create sun shader program with glow effect
    sunProgram = createShaderProgram(gl, shaders.sunVertexShader, shaders.sunFragmentShader);
    
    // Create orbit shader program
    orbitProgram = createShaderProgram(gl, shaders.orbitVertexShader, shaders.orbitFragmentShader);
    
    // Create particle shader program
    particleProgram = createShaderProgram(gl, shaders.particleVertexShader, shaders.particleFragmentShader);
    
    // Create text shader program
    textProgram = createShaderProgram(gl, shaders.textVertexShader, shaders.textFragmentShader);
}

/**
 * Create a WebGL shader program
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {string} vsSource - Vertex shader source code
 * @param {string} fsSource - Fragment shader source code
 * @returns {WebGLProgram} The shader program
 */
function createShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return null;
    }
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
    }
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Shader program linking failed:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    
    return program;
}

/**
 * Setup VR controller tracking
 */
function setupVRControllers() {
    xrSession.addEventListener('inputsourceschange', (event) => {
        // Handle new controllers
        for (const source of event.added) {
            if (source.handedness === 'left') {
                leftController = source;
            } else if (source.handedness === 'right') {
                rightController = source;
            }
        }
        
        // Handle removed controllers
        for (const source of event.removed) {
            if (source.handedness === 'left') {
                leftController = null;
            } else if (source.handedness === 'right') {
                rightController = null;
            }
        }
    });
}

/**
 * Convert the 2D game objects to 3D representations for VR
 */
function createVR3DObjects() {
    // Create meshes
    sphereMesh = createSphere(gl, 1.0, 32, 16);
    ringMesh = createRing(gl, 1.0, 64);
    rocketMesh = createRocket(gl, 0.5);
    
    // Create 3D sun
    vrSun = {
        position: [0, 0, -5],  // Center of the scene, slightly in front
        radius: sun.radius / 20, // Scale down for VR scene
        color: hexToRgb(sun.color)
    };
    
    // Create 3D planets
    vrPlanet1 = {
        position: [planet1.distance / 40, 0, -5],
        radius: planet1.radius / 20,
        color: hexToRgb(planet1.color),
        orbit: planet1.orbitSpeed,
        angle: planet1.angle
    };
    
    vrPlanet2 = {
        position: [planet2.distance / 40, 0, -5],
        radius: planet2.radius / 20,
        color: hexToRgb(planet2.color),
        orbit: planet2.orbitSpeed,
        angle: planet2.angle
    };
    
    // Create 3D rocket
    vrRocket = {
        position: [0, 0, -5],
        scale: rocket.radius / 10,
        color: hexToRgb(rocket.color)
    };
    
    // Create 3D stars
    vrStars = [];
    for (let i = 0; i < 200; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 15 + Math.random() * 5;
        
        vrStars.push({
            position: [
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi) - 5
            ],
            size: 0.05 + Math.random() * 0.05,
            brightness: 0.5 + Math.random() * 0.5
        });
    }
    
    // Create star field mesh
    starsMesh = createStarField(gl, vrStars);
    
    // Create quad mesh for UI
    quadMesh = createQuad(gl);
}

/**
 * Convert hex color string to RGB array
 * @param {string} hex - Hex color string (e.g., "#ff0000")
 * @returns {Array} RGB array [r, g, b] with values from 0 to 1
 */
function hexToRgb(hex) {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
}

/**
 * Enter VR mode - adjust game state for VR
 */
function enterVRMode() {
    vrMode = true;
    currentState = GAME_STATE.PLAYING;
    
    // Hide regular UI elements
    document.querySelectorAll('.controls, .game-info').forEach(el => {
        el.style.display = 'none';
    });
    
    // Create VR UI elements
    createVRUI();
}

/**
 * Create UI elements for VR
 */
function createVRUI() {
    // Will create 3D UI elements in the VR space
    // This would include launch controls, speed settings, etc.
    
    // In a full implementation, we would create textures for buttons and panels,
    // and position them in 3D space for the user to interact with.
}

/**
 * Handle VR session end
 */
function onVRSessionEnded() {
    vrMode = false;
    xrSession = null;
    
    // Show regular UI elements again
    document.querySelectorAll('.controls, .game-info').forEach(el => {
        el.style.display = '';
    });
    
    // Return to regular game rendering
    requestAnimationFrame(gameLoop);
}

/**
 * Main XR frame rendering loop
 * @param {number} time - Current timestamp
 * @param {XRFrame} frame - The current XR frame
 */
function onXRFrame(time, frame) {
    // Continue loop for next frame
    if (xrSession) {
        xrSession.requestAnimationFrame(onXRFrame);
    }
    
    // Get pose
    const pose = frame.getViewerPose(xrReferenceSpace);
    if (!pose) {
        return;
    }
    
    // Begin WebGL rendering
    const glLayer = xrSession.renderState.baseLayer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    
    // Render for each eye (stereo rendering)
    for (const view of pose.views) {
        const viewport = glLayer.getViewport(view);
        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        
        // Use view and projection matrices from WebXR
        mat4.copy(projectionMatrix, view.projectionMatrix);
        mat4.copy(viewMatrix, view.transform.inverse.matrix);
        
        // Render VR scene
        renderVRScene();
    }
    
    // Handle controller input
    processVRControllers(frame);
    
    // Update game state in VR
    updateVRGameState(time);
}

/**
 * Process controller input in VR
 * @param {XRFrame} frame - The current XR frame
 */
function processVRControllers(frame) {
    if (!xrSession) return;
    
    // Process right controller (primary control)
    if (rightController) {
        const gamepad = rightController.gamepad;
        if (gamepad) {
            // A/X button - Launch or Boost
            if (gamepad.buttons[0].pressed && !controllerGrip) {
                handleActionButton();
                controllerGrip = true;
            } else if (!gamepad.buttons[0].pressed) {
                controllerGrip = false;
            }
            
            // B/Y button - Reset
            if (gamepad.buttons[1].pressed) {
                resetGame();
            }
            
            // Thumbstick - Adjust speed
            if (!rocket.active && Math.abs(gamepad.axes[1]) > 0.1) {
                const newSpeed = rocket.speed - gamepad.axes[1] * 2;
                rocket.speed = Math.max(10, Math.min(120, newSpeed));
                updateVRSpeedDisplay();
            }
        }
        
        // Get controller pose
        const pose = frame.getPose(rightController.gripSpace, xrReferenceSpace);
        if (pose) {
            // Could use controller position to point at things in VR
        }
    }
}

/**
 * Update VR speed display
 */
function updateVRSpeedDisplay() {
    // Would update a 3D text element in VR space
}

/**
 * Update game state in VR mode
 * @param {number} time - Current timestamp
 */
function updateVRGameState(time) {
    // Calculate delta time similar to regular game loop
    const deltaTime = 0.016; // Approximately 60fps
    
    // Update planets position in VR
    updateVRPlanetPositions(deltaTime);
    
    // Update rocket in VR
    if (rocket.active) {
        updateVRRocket(deltaTime);
    }
    
    // Update game time
    if (rocket.active && gameActive) {
        gameTime += deltaTime;
    }
    
    // Check win/lose conditions
    checkVRGameConditions();
}

/**
 * Update planet positions in VR
 * @param {number} deltaTime - Time elapsed since last update
 */
function updateVRPlanetPositions(deltaTime) {
    // Update planet angles using same logic as 2D game
    planet1.angle += planet1.orbitSpeed * deltaTime;
    planet2.angle += planet2.orbitSpeed * deltaTime;
    
    // Update 3D positions
    const p1Radius = planet1.distance / 40;
    vrPlanet1.position[0] = Math.cos(planet1.angle) * p1Radius;
    vrPlanet1.position[2] = Math.sin(planet1.angle) * p1Radius - 5;
    
    const p2Radius = planet2.distance / 40;
    vrPlanet2.position[0] = Math.cos(planet2.angle) * p2Radius;
    vrPlanet2.position[2] = Math.sin(planet2.angle) * p2Radius - 5;
}

/**
 * Update rocket in VR
 * @param {number} deltaTime - Time elapsed since last update
 */
function updateVRRocket(deltaTime) {
    // Simplified physics for VR
    // In a full implementation, we'd convert the 2D physics to 3D
    
    // Update rocket position based on velocity
    vrRocket.position[0] += rocket.velX * deltaTime / 40;
    vrRocket.position[2] += rocket.velY * deltaTime / 40;
    
    // Apply gravity (simplified)
    const dx = vrSun.position[0] - vrRocket.position[0];
    const dz = vrSun.position[2] - vrRocket.position[2];
    const distSq = dx * dx + dz * dz;
    const dist = Math.sqrt(distSq);
    
    const gravity = 0.5 / distSq;
    rocket.velX += (dx / dist) * gravity;
    rocket.velY += (dz / dist) * gravity;
    
    // Add trail for rocket
    // (In a full implementation, we'd add 3D particles)
}

/**
 * Check win/lose conditions in VR
 */
function checkVRGameConditions() {
    // Check for collision with target planet
    const dx = vrPlanet2.position[0] - vrRocket.position[0];
    const dz = vrPlanet2.position[2] - vrRocket.position[2];
    const distSq = dx * dx + dz * dz;
    
    if (distSq < (vrPlanet2.radius + vrRocket.scale) * (vrPlanet2.radius + vrRocket.scale)) {
        // Win condition
        gameWon = true;
        gameActive = false;
        
        // Would show VR celebration effects
        
        // After delay, show completion screen
        setTimeout(() => {
            // Exit VR and show completion
            xrSession.end();
            
            // Calculate star rating and show completion
            const stars = calculateStarRating(currentLevel, gameTime, rocket.fuel);
            const newLevelUnlocked = unlockNextLevel(currentLevel, stars);
            showLevelCompleteScreen(newLevelUnlocked, stars);
        }, 2000);
    }
    
    // Check time limit
    if (gameTime >= maxGameTime && !gameWon && gameActive) {
        gameActive = false;
        
        // Show time's up message in VR
        
        // After delay, exit VR
        setTimeout(() => {
            xrSession.end();
        }, 2000);
    }
    
    // Check out of bounds
    const boundaryRadius = 10;
    const rocketDistSq = 
        vrRocket.position[0] * vrRocket.position[0] + 
        vrRocket.position[2] * vrRocket.position[2];
    
    if (rocketDistSq > boundaryRadius * boundaryRadius) {
        gameActive = false;
        
        // Show out of bounds message in VR
        
        // After delay, exit VR
        setTimeout(() => {
            xrSession.end();
        }, 2000);
    }
}

/**
 * Render the VR scene
 */
function renderVRScene() {
    // 1. Render stars (background)
    renderStars();
    
    // 2. Render sun with glow effect
    renderSun();
    
    // 3. Render planet orbits
    renderOrbits();
    
    // 4. Render planets
    renderPlanet(vrPlanet1);
    renderPlanet(vrPlanet2);
    
    // 5. Render rocket if active
    if (rocket.active) {
        renderRocket();
    }
    
    // 6. Render UI elements
    renderVRUI();
}

/**
 * Render background stars
 */
function renderStars() {
    gl.useProgram(starProgram);
    
    // Set uniforms
    const viewUniform = gl.getUniformLocation(starProgram, 'uViewMatrix');
    const projUniform = gl.getUniformLocation(starProgram, 'uProjectionMatrix');
    
    gl.uniformMatrix4fv(viewUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projUniform, false, projectionMatrix);
    
    // Bind position buffer
    const posAttrib = gl.getAttribLocation(starProgram, 'aPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, starsMesh.position);
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    // Bind size buffer
    const sizeAttrib = gl.getAttribLocation(starProgram, 'aSize');
    gl.bindBuffer(gl.ARRAY_BUFFER, starsMesh.size);
    gl.vertexAttribPointer(sizeAttrib, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(sizeAttrib);
    
    // Bind brightness buffer
    const brightnessAttrib = gl.getAttribLocation(starProgram, 'aBrightness');
    gl.bindBuffer(gl.ARRAY_BUFFER, starsMesh.brightness);
    gl.vertexAttribPointer(brightnessAttrib, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(brightnessAttrib);
    
    // Enable point sprites
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Draw stars
    gl.drawArrays(gl.POINTS, 0, starsMesh.count);
    
    // Clean up
    gl.disableVertexAttribArray(posAttrib);
    gl.disableVertexAttribArray(sizeAttrib);
    gl.disableVertexAttribArray(brightnessAttrib);
    gl.disable(gl.BLEND);
}

/**
 * Render the sun with glow effect
 */
function renderSun() {
    gl.useProgram(sunProgram);
    
    // Get uniform locations
    const modelUniform = gl.getUniformLocation(sunProgram, 'uModelMatrix');
    const viewUniform = gl.getUniformLocation(sunProgram, 'uViewMatrix');
    const projUniform = gl.getUniformLocation(sunProgram, 'uProjectionMatrix');
    const normalUniform = gl.getUniformLocation(sunProgram, 'uNormalMatrix');
    const colorUniform = gl.getUniformLocation(sunProgram, 'uColor');
    const viewPosUniform = gl.getUniformLocation(sunProgram, 'uViewPosition');
    
    // Create model matrix for sun
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vrSun.position);
    mat4.scale(modelMatrix, modelMatrix, [vrSun.radius, vrSun.radius, vrSun.radius]);
    
    // Create normal matrix (inverse transpose of model-view matrix)
    const normalMatrix = mat4.create();
    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, modelViewMatrix);
    
    // Set uniforms
    gl.uniformMatrix4fv(modelUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(normalUniform, false, normalMatrix);
    gl.uniform3fv(colorUniform, vrSun.color);
    
    // View position comes from inverse of view matrix (camera position)
    const viewPosition = [viewMatrix[12], viewMatrix[13], viewMatrix[14]];
    gl.uniform3fv(viewPosUniform, viewPosition);
    
    // Bind position buffer
    const posAttrib = gl.getAttribLocation(sunProgram, 'aPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereMesh.position);
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    // Bind normal buffer
    const normalAttrib = gl.getAttribLocation(sunProgram, 'aNormal');
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereMesh.normal);
    gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalAttrib);
    
    // Bind indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereMesh.indices);
    
    // Enable blending for glow effect
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    
    // Draw sun
    gl.drawElements(gl.TRIANGLES, sphereMesh.count, gl.UNSIGNED_SHORT, 0);
    
    // Clean up
    gl.disableVertexAttribArray(posAttrib);
    gl.disableVertexAttribArray(normalAttrib);
    gl.disable(gl.BLEND);
}

/**
 * Render planet orbits
 */
function renderOrbits() {
    gl.useProgram(orbitProgram);
    
    // Get uniform locations
    const viewUniform = gl.getUniformLocation(orbitProgram, 'uViewMatrix');
    const projUniform = gl.getUniformLocation(orbitProgram, 'uProjectionMatrix');
    const colorUniform = gl.getUniformLocation(orbitProgram, 'uColor');
    
    // Set common uniforms
    gl.uniformMatrix4fv(viewUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projUniform, false, projectionMatrix);
    
    // Bind position buffer
    const posAttrib = gl.getAttribLocation(orbitProgram, 'aPosition');
    
    // Draw planet 1 orbit
    let modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0, 0, -5]); // Center at sun
    mat4.scale(modelMatrix, modelMatrix, [planet1.distance / 40, 1, planet1.distance / 40]);
    
    // Create model-view matrix
    let mvMatrix = mat4.create();
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    
    // Upload model-view-projection matrix
    let mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    
    gl.uniform3f(colorUniform, 0.5, 0.5, 0.5); // Gray orbit lines
    
    gl.bindBuffer(gl.ARRAY_BUFFER, ringMesh.position);
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ringMesh.indices);
    
    // Enable line rendering
    gl.lineWidth(1.0);
    
    // Draw orbit
    gl.drawElements(gl.LINES, ringMesh.count, gl.UNSIGNED_SHORT, 0);
    
    // Draw planet 2 orbit
    modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, [0, 0, -5]); // Center at sun
    mat4.scale(modelMatrix, modelMatrix, [planet2.distance / 40, 1, planet2.distance / 40]);
    
    // Create model-view matrix
    mvMatrix = mat4.create();
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    
    // Upload model-view-projection matrix
    mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    
    // Draw orbit
    gl.drawElements(gl.LINES, ringMesh.count, gl.UNSIGNED_SHORT, 0);
    
    // Clean up
    gl.disableVertexAttribArray(posAttrib);
}

/**
 * Render a planet
 * @param {Object} planet - Planet data (position, radius, color)
 */
function renderPlanet(planet) {
    gl.useProgram(basicProgram);
    
    // Get uniform locations
    const modelUniform = gl.getUniformLocation(basicProgram, 'uModelMatrix');
    const viewUniform = gl.getUniformLocation(basicProgram, 'uViewMatrix');
    const projUniform = gl.getUniformLocation(basicProgram, 'uProjectionMatrix');
    const normalUniform = gl.getUniformLocation(basicProgram, 'uNormalMatrix');
    const colorUniform = gl.getUniformLocation(basicProgram, 'uColor');
    const lightPosUniform = gl.getUniformLocation(basicProgram, 'uLightPosition');
    const ambientUniform = gl.getUniformLocation(basicProgram, 'uAmbient');
    const diffuseUniform = gl.getUniformLocation(basicProgram, 'uDiffuse');
    const specularUniform = gl.getUniformLocation(basicProgram, 'uSpecular');
    const shininessUniform = gl.getUniformLocation(basicProgram, 'uShininess');
    const alphaUniform = gl.getUniformLocation(basicProgram, 'uAlpha');
    
    // Create model matrix for planet
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, planet.position);
    mat4.scale(modelMatrix, modelMatrix, [planet.radius, planet.radius, planet.radius]);
    
    // Create normal matrix (inverse transpose of model-view matrix)
    const normalMatrix = mat4.create();
    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, modelViewMatrix);
    
    // Set uniforms
    gl.uniformMatrix4fv(modelUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(normalUniform, false, normalMatrix);
    gl.uniform3fv(colorUniform, planet.color);
    gl.uniform3fv(lightPosUniform, vrSun.position); // Sun is the light source
    gl.uniform3f(ambientUniform, 0.2, 0.2, 0.2); // Ambient light
    gl.uniform3f(diffuseUniform, 0.7, 0.7, 0.7); // Diffuse light
    gl.uniform3f(specularUniform, 0.3, 0.3, 0.3); // Specular light
    gl.uniform1f(shininessUniform, 32.0); // Shininess
    gl.uniform1f(alphaUniform, 1.0); // Fully opaque
    
    // Bind position buffer
    const posAttrib = gl.getAttribLocation(basicProgram, 'aPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereMesh.position);
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    // Bind normal buffer
    const normalAttrib = gl.getAttribLocation(basicProgram, 'aNormal');
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereMesh.normal);
    gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalAttrib);
    
    // Bind texture coords (if needed)
    if (sphereMesh.texCoord) {
        const texAttrib = gl.getAttribLocation(basicProgram, 'aTexCoord');
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereMesh.texCoord);
        gl.vertexAttribPointer(texAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texAttrib);
    }
    
    // Bind indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereMesh.indices);
    
    // Draw planet
    gl.drawElements(gl.TRIANGLES, sphereMesh.count, gl.UNSIGNED_SHORT, 0);
    
    // Clean up
    gl.disableVertexAttribArray(posAttrib);
    gl.disableVertexAttribArray(normalAttrib);
    if (sphereMesh.texCoord) {
        const texAttrib = gl.getAttribLocation(basicProgram, 'aTexCoord');
        gl.disableVertexAttribArray(texAttrib);
    }
}

/**
 * Render the rocket
 */
function renderRocket() {
    gl.useProgram(basicProgram);
    
    // Get uniform locations
    const modelUniform = gl.getUniformLocation(basicProgram, 'uModelMatrix');
    const viewUniform = gl.getUniformLocation(basicProgram, 'uViewMatrix');
    const projUniform = gl.getUniformLocation(basicProgram, 'uProjectionMatrix');
    const normalUniform = gl.getUniformLocation(basicProgram, 'uNormalMatrix');
    const colorUniform = gl.getUniformLocation(basicProgram, 'uColor');
    const lightPosUniform = gl.getUniformLocation(basicProgram, 'uLightPosition');
    const ambientUniform = gl.getUniformLocation(basicProgram, 'uAmbient');
    const diffuseUniform = gl.getUniformLocation(basicProgram, 'uDiffuse');
    const specularUniform = gl.getUniformLocation(basicProgram, 'uSpecular');
    const shininessUniform = gl.getUniformLocation(basicProgram, 'uShininess');
    const alphaUniform = gl.getUniformLocation(basicProgram, 'uAlpha');
    
    // Calculate rocket direction based on velocity
    let rocketDir = [0, 0, -1]; // Default direction
    if (rocket.active) {
        // Calculate direction from velocity
        const velLength = Math.sqrt(rocket.velX * rocket.velX + rocket.velY * rocket.velY);
        if (velLength > 0.001) {
            rocketDir = [rocket.velX / velLength, 0, rocket.velY / velLength];
        }
    }
    
    // Create model matrix for rocket
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, vrRocket.position);
    
    // Create rotation to face direction of travel
    const upVector = [0, 1, 0];
    const rightVector = vec3.cross([], upVector, rocketDir);
    vec3.normalize(rightVector, rightVector);
    const newUpVector = vec3.cross([], rocketDir, rightVector);
    vec3.normalize(newUpVector, newUpVector);
    
    // Set rotation matrix based on direction vectors
    modelMatrix[0] = rightVector[0];
    modelMatrix[1] = rightVector[1];
    modelMatrix[2] = rightVector[2];
    
    modelMatrix[4] = newUpVector[0];
    modelMatrix[5] = newUpVector[1];
    modelMatrix[6] = newUpVector[2];
    
    modelMatrix[8] = rocketDir[0];
    modelMatrix[9] = rocketDir[1];
    modelMatrix[10] = rocketDir[2];
    
    // Scale the rocket
    mat4.scale(modelMatrix, modelMatrix, [vrRocket.scale, vrRocket.scale, vrRocket.scale]);
    
    // Create normal matrix (inverse transpose of model-view matrix)
    const normalMatrix = mat4.create();
    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, modelViewMatrix);
    
    // Set uniforms
    gl.uniformMatrix4fv(modelUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(normalUniform, false, normalMatrix);
    gl.uniform3fv(colorUniform, vrRocket.color);
    gl.uniform3fv(lightPosUniform, vrSun.position); // Sun is the light source
    gl.uniform3f(ambientUniform, 0.3, 0.3, 0.3); // Slightly higher ambient for rocket
    gl.uniform3f(diffuseUniform, 0.6, 0.6, 0.6); // Diffuse light
    gl.uniform3f(specularUniform, 0.5, 0.5, 0.5); // Higher specular for metallic look
    gl.uniform1f(shininessUniform, 64.0); // Higher shininess
    gl.uniform1f(alphaUniform, 1.0); // Fully opaque
    
    // Bind position buffer
    const posAttrib = gl.getAttribLocation(basicProgram, 'aPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, rocketMesh.position);
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);
    
    // Bind normal buffer
    const normalAttrib = gl.getAttribLocation(basicProgram, 'aNormal');
    gl.bindBuffer(gl.ARRAY_BUFFER, rocketMesh.normal);
    gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalAttrib);
    
    // Bind indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rocketMesh.indices);
    
    // Draw rocket
    gl.drawElements(gl.TRIANGLES, rocketMesh.count, gl.UNSIGNED_SHORT, 0);
    
    // Clean up
    gl.disableVertexAttribArray(posAttrib);
    gl.disableVertexAttribArray(normalAttrib);
}

/**
 * Render UI elements in VR space
 */
function renderVRUI() {
    // In a full implementation, we would render UI elements like:
    // - Speed indicator
    // - Fuel gauge
    // - Game status messages
    // - Level information
    
    // This would use the quad mesh and text shader
    // with appropriate textures for text and UI elements
}

// Export VR functions for use in main.js
export { initWebXR, vrMode };