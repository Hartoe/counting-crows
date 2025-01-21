import { importHLSL } from "./hlsl-reader.js";
import { initShaderProgram } from "./shaders.js";
import { createTexture } from "./textures.js";

// Pass through shader
const passVertexShader = await importHLSL("./shaders/passVert.hlsl");

// Shader to calculate the position and velocity of a boid
const posFragShader = await importHLSL("./shaders/posFrag.hlsl");
const velFragShader = await importHLSL("./shaders/velFrag.hlsl");

// Width * Height = number of boids
async function runBoids(gl, width, height) {
    // Build shaders
    const positionProgram = initShaderProgram(gl, passVertexShader, posFragShader);
    const velocityProgram = initShaderProgram(gl, passVertexShader, velFragShader);

    // Build textures
    const posTex = createTexture(gl, width, height);
    const velTex = createTexture(gl, width, height);
    
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

    // Loop boids until further notice
    function render(time) {
        // Prepare Buffers
        
        // Bind textures & attributes

        runVelocityCalculation();
        runPositionCalculation();

        //TODO DRAW THE FUCKIN BURDS

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function runVelocityCalculation()
{
    // Call draw to run the shaders
}

function runPositionCalculation()
{
    // Call draw to run the shaders
}

export { runBoids };