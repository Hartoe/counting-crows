import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { importHLSL } from "./hlsl-reader.js";
import { initShaderProgram } from "./shaders.js";
import { runBoids } from "./boid-simulation.js";

// Temp values for some naïve animation approach
let squareRotation = 0.0;
let deltaTime = 0;

main();

// Async because it needs to read out files
async function main()
{
    // Setup WebGL
    const canvas = document.querySelector("#gl-canvas");
    if (canvas == null) throw new Error("Could not find canvas element.");

    const gl = canvas.getContext("webgl");
    if (gl == null) throw new Error("Unable to initialize WebGL! Your browser may not support it.");

    // Run Boids
    runBoids(gl, 250, 250);

    // Read in the vertex & fragment files
    const vsSource = await importHLSL("./shaders/vertex.hlsl");
    const fsSource = await importHLSL("./shaders/fragment.hlsl");

    // Create the WebGLProgram that runs the shaders
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collate the program info into an object for ease of use
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    const buffers = initBuffers(gl);

    // Animate a rotating cube on the HTMLCanvas element
    let then = 0;
    function render(now) {
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, squareRotation);
        squareRotation += deltaTime;

        requestAnimationFrame(render);
    }
    // requestAnimationFrame(render);

}