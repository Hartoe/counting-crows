import { importHLSL } from "./hlsl-reader.js";
import { initShaderProgram } from "./shaders.js";
import { createTexture } from "./textures.js";

// Pass through shader
const passVertexShader = await importHLSL("./shaders/passVert.hlsl");

// Shader to calculate the position and velocity of a boid
const posFragShader = await importHLSL("./shaders/posFrag.hlsl");
const velFragShader = await importHLSL("./shaders/velFrag.hlsl");

//shaders for the rendering
const renderVertexShader = await importHLSL("./shaders/vertexBoids.hlsl")
const renderFragmentShader = await importHLSL("./shaders/fragmentBoids.hlsl")

// Width * Height = number of boids
async function runBoids(gl, width, height) {
    // Build shaders
    const positionProgram = initShaderProgram(gl, passVertexShader, posFragShader);
    const velocityProgram = initShaderProgram(gl, passVertexShader, velFragShader);

    //build render shader
    const renderProgram = initShaderProgram(gl, renderVertexShader, renderFragmentShader )

    // Build textures
    let posTex1 = createTexture(gl, width, height);
    let posTex2 = createTexture(gl, width, height);
    let velTex1 = createTexture(gl, width, height);
    let velTex2 = createTexture(gl, width, height);

    let readPosTex = posTex1; // The texture being read from
    let writePosTex = posTex2; // The texture being written to
    let readVelTex = velTex1; // The texture being read from
    let writeVelTex = velTex2; // The texture being written to
    
    // Get the texture dimensions (width and height)
    const texWidth = width;
    const texHeight = height;

    // Set the texture size uniform for both shaders
    const positionTexSizeLoc = gl.getUniformLocation(positionProgram, "texSize");
    const velocityTexSizeLoc = gl.getUniformLocation(velocityProgram, "texSize");

    gl.useProgram(positionProgram);  // Make sure the program is active
    gl.uniform2f(positionTexSizeLoc, texWidth, texHeight); // Set texSize uniform

    gl.useProgram(velocityProgram);  // Make sure the program is active
    gl.uniform2f(velocityTexSizeLoc, texWidth, texHeight); //set the uniforms

    const velocityFramebuffer = gl.createFramebuffer();
    const positionFramebuffer = gl.createFramebuffer();

    const positionBuffer = gl.createBuffer();
    const boidPositions = new Float32Array(width * height * 4); // x, y, z, a for each boid

    //setup render matrices
    const cameraPosition = [0, 0, 5];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, cameraPosition, target, up);

    const fov = Math.PI / 4;
    const aspect = gl.canvas.width / gl.canvas.height;
    const near = 0.1;
    const far = 1000;

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fov, aspect, near, far);

    const viewProjectionMatrix = mat4.create();
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    gl.useProgram(renderProgram);
    const viewProjLoc = gl.getUniformLocation(renderProgram, "uViewProjectionMatrix");
    gl.uniformMatrix4fv(viewProjLoc, false, viewProjectionMatrix);
    //end render matrix setup


    // Loop boids until further notice
    function render(time) {
        //Run the shaders with boids
        runVelocityCalculation();
        runPositionCalculation();

        //update buffers for rendering
        updateBoidPositions();
        updatePositionBuffer();

        //actually render the boids
        renderBoids();
        // Swap textures to prevent loops
        [readPosTex, writePosTex] = [writePosTex, readPosTex];
        [readVelTex, writeVelTex] = [writeVelTex, readVelTex];
        
        //TODO DRAW THE FUCKIN BURDS
        
        requestAnimationFrame(render);
    }

    render()

    function updateBoidPositions() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, positionFramebuffer);
        gl.readPixels(0, 0, width, height, gl.RGB, gl.FLOAT, boidPositions);
    }

    function updatePositionBuffer() {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, boidPositions); // Update position buffer with new positions
    }

    function renderBoids() {
        gl.useProgram(renderProgram);
        
        // Get attribute location for aPosition
        const positionLoc = gl.getAttribLocation(renderProgram, "aPosition");

        // Check if positionLoc is valid (non-zero)
        if (positionLoc === -1) {
            console.error('Failed to get attribute location for aPosition');
        } else {
            console.log('aPosition attribute location:', positionLoc);
        }
        const viewProjLoc = gl.getUniformLocation(renderProgram, "uViewProjectionMatrix");
    
        console.log(viewProjLoc);

        gl.enableVertexAttribArray(positionLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    
        gl.uniformMatrix4fv(viewProjLoc, false, viewProjectionMatrix);
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, boidPositions.length / 3);
    }

    function runVelocityCalculation() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, velocityFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, writeVelTex, 0);
    
        gl.useProgram(velocityProgram);
    
        gl.bindTexture(gl.TEXTURE_2D, readPosTex); // Read from current position texture
        gl.uniform1i(gl.getUniformLocation(velocityProgram, "positionSampler"), 0);
        gl.bindTexture(gl.TEXTURE_2D, readVelTex); // Read from current velocity texture
        gl.uniform1i(gl.getUniformLocation(velocityProgram, "velocitySampler"), 1);
    
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function runPositionCalculation() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, positionFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, writePosTex, 0);
    
        gl.useProgram(positionProgram);
    
        gl.bindTexture(gl.TEXTURE_2D, writeVelTex); // Read from updated velocity texture
        gl.uniform1i(gl.getUniformLocation(positionProgram, "velocitySampler"), 0); // velocitySampler uniform
        gl.bindTexture(gl.TEXTURE_2D, readPosTex); // Read from current position texture
        gl.uniform1i(gl.getUniformLocation(positionProgram, "positionSampler"), 1); // positionSampler uniform
    
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Perform the drawing
    }
}



export { runBoids };