// UV of texture
varying vec2 vUv;

// Texture storing x, y, and z position of the boids
uniform sampler2D posTex;

// Texture storing x, y, and z velocity of the boids
uniform sampler2D velTex;

void main()
{
    vec3 currentPosition = texture2D(posTex, vUv.xy).xyz;
    vec3 currentVelocity = texture2D(velTex, vUv.xy).xyz;
    ivec2 dim = textureSize(posTex);

    vec3 alignment = vec3(0,0,0);
    vec3 cohesion = vec3(0,0,0);
    vec3 separation = vec3(0,0,0);
    int count = 0;

    float neighbourhood = 4.0;

    // Iterate through boids (this needed an acceleration structure, but alas...)
    for (int x = 0; x < dim.x; x++)
    {
        for (int y = 0; y < dim.y; y++)
        {
            // Skip boid if self
            vec2 newUv = vec2(x,y) / dim;
            if (newUv == vUv.xy)
                continue;

            vec3 bPos = texture2D(posTex, newUv).xyz;
            vec3 bVel = texture2D(velTex, newUv).xyz;
            vec3 difference = currentPosition - bPos;
            float dist = sqrt((difference.x*difference.x) + (difference.y*difference.y) + (difference.z*difference.z));

            // Skip boid if outside of neighbourhood
            if (dist > neighbourhood)
                continue;
            count += 1;
            
            // Alignment
            alignment += bVel;
            // Cohesion
            cohesion += bPos;
            // Separation
            separation += difference
        }
    }

    // Average the values
    alignment = alignment / count;
    cohesion = cohesion / count;
    separation = separation / count;

    // Add them to the velocity and update texture
    vec3 newVelocity = currentVelocity + alignment + cohesion + separation;
    gl_FragColor = vec4(newVelocity, 1.0);
}