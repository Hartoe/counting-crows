main();

function initShaderProgram(gl, vsSource, fsSource)
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If failing the program, alert
    if (!gl.getProgramParameters(shaderProgram, gl.LINK_STATUS))
    {
        alert(`Unable to initialize shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source)
{
    const shader = gl.createShader(type);

    // Send source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // Check if compilation is successful
    if (!gl.getShaderParameters(shader, gl.COMPILE_STATUS))
    {
        alert(`An error occured compiling the shader: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function main()
{
    // Setup WebGL
    const canvas = document.querySelector("#gl-canvas");
    const gl = canvas.getContext("webgl");

    if (gl == null)
    {
        alert("Unable to initialize WebGL! Your browser may not support it.");
        return;
    }

    const vsSource = `
                    attribute vec4 aVertexPosition;
                    uniform mat4 uModelViewMatrix;
                    uniform mat4 uProjectionMatrix;
                    void main() {
                        gl_Position =uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                    }
                    `;
    const fsSource = `
                    void main() {
                        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                    }
                    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}