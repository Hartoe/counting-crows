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

export { initShaderProgram };