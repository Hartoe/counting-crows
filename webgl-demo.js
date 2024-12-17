import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { importHLSL } from "./hlsl-reader.js";

// Temp values for some naïve animation approach
let squareRotation = 0.0;
let deltaTime = 0;

main();

// Loads in the shader program from two string sources
function initShaderProgram(gl, vsSource, fsSource)
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    if (shaderProgram == null) throw new Error("Error creating shader program!");

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If failing the program, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        throw new Error(`Unable to initialize shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    }

    return shaderProgram;
}

//  Loads a single WebGLShader element from a source string
function loadShader(gl, type, source)
{
    const shader = gl.createShader(type);
    if (shader == null) throw new Error("Error creating shader!");

    // Send source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // Check if compilation is successful
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`An error occured compiling the shader: ${info}`);
    }

    return shader;
}

// Async because it needs to read out files
async function main()
{
    // Setup WebGL
    const canvas = document.querySelector("#gl-canvas");
    if (canvas == null) throw new Error("Could not find canvas element.");

    const gl = canvas.getContext("webgl");
    if (gl == null) throw new Error("Unable to initialize WebGL! Your browser may not support it.");

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
    requestAnimationFrame(render);

}