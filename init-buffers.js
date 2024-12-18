function initBuffers(gl, obj)
{
    const positionBuffer = initPositionBuffer(gl, obj.vertices);
    const colorBuffer = initColorBuffer(gl);
    const indexBuffer = initIndexBuffer(gl, obj.faces);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    };
}

function initIndexBuffer(gl, indices)
{
    const indexBuffer = gl.createBuffer();
    if (indexBuffer == null) throw new Error("Error creating index buffer!");

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indexBuffer;
}

function initPositionBuffer(gl, positions)
{
    const positionBuffer = gl.createBuffer();
    if (positionBuffer == null) throw new Error("Error creating position buffer!");

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initColorBuffer(gl)
{
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
      ];
      
      // Convert the array of colors into a table for all the vertices.
      
      var colors = [];
      
      for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
      }

    const colorBuffer = gl.createBuffer();
    if (colorBuffer == null) throw new Error("Error creating the color buffer!");

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return colorBuffer;
}

export { initBuffers };