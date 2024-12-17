// Return the different buffers to pass to the WebGL Shaders
function initBuffers(gl)
{
    const positionBuffer = initPositionBuffer(gl);
    const colorBuffer = initColorBuffer(gl);

    return {
        position: positionBuffer,
        color: colorBuffer,
    };
}

// Initializes the position buffer
function initPositionBuffer(gl)
{
    const positionBuffer = gl.createBuffer();
    if (positionBuffer == null) throw new Error("Error creating position buffer!");

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

// Initializes the color buffer
function initColorBuffer(gl)
{
    const colors = [
        1.0, // White
        1.0,
        1.0,
        1.0,
        1.0, // Red
        0.0,
        0.0,
        1.0,
        0.0, // Green
        1.0,
        0.0,
        1.0,
        0.0, // Blue
        0.0,
        1.0,
        1.0
    ];

    const colorBuffer = gl.createBuffer();
    if (colorBuffer == null) throw new Error("Error creating the color buffer!");

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return colorBuffer;
}

export { initBuffers };