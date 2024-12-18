// This file will contain all functions pertaining to running the boid shaders and keeping track of the boid information

/*

    1. Initialize for the number of boids
    2. Fill buffer/array with initial positions
    3. Run both the position and the velocity shaders
        a. velocity shaders will take the seperation, cohesion, and allignment
           in addition to neighbourhood information (get via octree?) to compute
           the new velocities and save the xyz into the rgb components of a texture
        b. position shader reads out previous generated texture in conjunction with
           the velocity texture and adds the rgb values to generate the new position
           texture.
    4. Read out the position texture and fill buffer
    5. Render the animated model at the positions using projection/ModelView/World matrices
    6. Flush buffer to screen and goto step (3)

*/
import { importHLSL } from "./hlsl-reader.js";

// Pass through shaders
const passVertexShader = await importHLSL("./shaders/passVert.hlsl");
const passFragmentShader = await importHLSL("./shaders/passFrag.hlsl");

// Shader to calculate the position and velocity of a boid
const posFragShader = await importHLSL("./shaders/posFrag.hlsl");
const velFragShader = await importHLSL("./shaders/velFrag.hlsl");

// Octree shaders(?)
//? Find out if keeping track of the octree structure should be done fully in or partialy in the shaders

// Widht * Height = number of boids
async function runBoidsAlgorithm(width, height)
{
    // Build shaders
    await passFragmentShader, passVertexShader, posFragShader, velFragShader;

    // Build textures
    

    // Build octtree structure and flatten to array

    // In loop:
    //  - Calculate octtree position
    //  - Update boids pos/vel
    //  - Draw Scene

    // Exit criteria
}

function runVelocityCalculation()
{

}

function runPositionCalculation()
{
    
}