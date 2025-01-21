// Precision for floats in fragment shaders
precision mediump float;

// UV of texture
varying vec2 vTexCoord;

// Texture storing x, y, and z position of the boids
uniform sampler2D posTex;

// Texture storing x, y, and z velocity of the boids
uniform sampler2D velTex;

// Texture size passed from JavaScript
uniform vec2 texSize;

void main()
{
    // Get current position and velocity from textures
    vec3 currentPosition = texture2D(posTex, vTexCoord.xy).xyz;
    vec3 currentVelocity = texture2D(velTex, vTexCoord.xy).xyz;

    // Get the size of the texture (passed as uniform)
    vec2 dim = texSize;

    vec3 alignment = vec3(0,0,0);
    vec3 cohesion = vec3(0,0,0);
    vec3 separation = vec3(0,0,0);
    int count = 0;

    float neighbourhood = 4.0;

    // Iterate through boids (this needed an acceleration structure, but alas...)
    for (int x = 0; x < int(250); x++)
    {
        for (int y = 0; y < int(250); y++)
        {
            // Skip boid if self
            vec2 newUv = vec2(float(x), float(y)) / dim;
            if (newUv == vTexCoord.xy)
                continue;

            // Get position and velocity of other boids
            vec3 bPos = texture2D(posTex, newUv).xyz;
            vec3 bVel = texture2D(velTex, newUv).xyz;

            // Calculate distance to other boid
            vec3 difference = currentPosition - bPos;
            float dist = length(difference);  // Use length() to calculate the distance

            // Skip boid if outside of neighbourhood
            if (dist > neighbourhood)
                continue;

            count += 1;

            // Alignment
            alignment += bVel;
            // Cohesion
            cohesion += bPos;
            // Separation
            separation += difference;
        }
    }

    // Avoid division by zero if count is zero
    if (count > 0) {
        alignment = alignment / float(count);
        cohesion = cohesion / float(count);
        separation = separation / float(count);
    }

    // Add them to the velocity and update texture
    vec3 newVelocity = currentVelocity + alignment + cohesion + separation;

    // Output new velocity as fragment color
    gl_FragColor = vec4(newVelocity, 1.0);
}
