import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { parseOBJ } from "./read-obj.js";

let squareRotation = 0.0;
let deltaTime = 0;

main();

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

async function main()
{
    await parseOBJ()
    // Setup WebGL


    const canvas = document.querySelector("#gl-canvas");
    if (canvas == null) throw new Error("Could not find canvas element.");

    const gl = canvas.getContext("webgl");
    if (gl == null) throw new Error("Unable to initialize WebGL! Your browser may not support it.");

    const vsSource = `
                    attribute vec4 aVertexPosition;
                    attribute vec4 aVertexColor;

                    uniform mat4 uModelViewMatrix;
                    uniform mat4 uProjectionMatrix;
                    
                    varying lowp vec4 vColor;
                    
                    void main() {
                        gl_Position =uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                        vColor = aVertexColor;
                    }
                    `;
    const fsSource = `
                    varying lowp vec4 vColor;

                    void main() {
                        gl_FragColor = vColor;
                    }
                    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

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