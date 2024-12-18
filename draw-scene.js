// Draws a scene based on the buffers and program passed to the WebGL controller
function drawScene(gl, programInfo, buffers, squareRotation)
{
    // Clear screen and enable depth filtering (things behind other things don't get drawn)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Calculate camera & model matrices
    const fieldOfView = (45 * Math.PI) /180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();

    mat4.translate(
        modelViewMatrix, // Destination
        modelViewMatrix, // Source
        [-0.0, 0.0, -6.0]
    );
    mat4.rotate(
        modelViewMatrix, // Destination
        modelViewMatrix, // Source
        squareRotation,
        [0, 0, 1]
    );
    mat4.rotate(
        modelViewMatrix, // Destination
        modelViewMatrix, // Source
        squareRotation * 0.7,
        [0, 1, 0]
    );
    mat4.rotate(
        modelViewMatrix, // Destination
        modelViewMatrix, // Source
        squareRotation * 0.3,
        [1, 0, 0]
    );

    // Bind the buffers to the shaders
    setPositionAttribute(gl, buffers, programInfo);
    setColorAttribute(gl, buffers, programInfo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Draw the elements of the buffers onto the canvas with the given shader program
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    {
        const offset = 0;
        const type = gl.UNSIGNED_SHORT;
        const vertexCount = 36;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

// Binds the position buffers to the shader attributes
function setPositionAttribute(gl, buffers, programInfo)
{
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Binds the color buffer to the shader attributes
function setColorAttribute(gl, buffers, programInfo)
{
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export { drawScene };