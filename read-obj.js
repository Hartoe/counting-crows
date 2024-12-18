// Function to parse .obj file content
async function parseOBJ() {
  let data;
  
  // Read in an .obj file
  await fetch("cube.obj")
        .then((res)  => res.text())
        .then((text) => {
            data = text;
        })
        .catch((e) => console.error(e));
    
    // parsing
    const vertices = [];
    const faces = [];
    const lines = data.split("\n");
  
    for (const line of lines) {
      const trimmed = line.trim();
  
      if (trimmed.startsWith("v ")) {
        // Parse vertex line: "v x y z"
        const [, x, y, z] = trimmed.split(/\s+/);
        vertices.push(parseFloat(x) -0.5, parseFloat(y) -0.5, parseFloat(z) -0.5);
      } else if (trimmed.startsWith("f ")) {
        // Parse face line: "f v1 v2 v3 ..."
        const face = trimmed.split(/\s+/).slice(1).map(index => parseInt(index.split("/")[0], 10));
        faces.push(face[0]-1, face[1]-1, face[2]-1);
      }
    }
    console.log(vertices);
    console.log(faces);
    return { vertices, faces };
  }

  export {parseOBJ}