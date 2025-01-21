// Precision for floats in fragment shaders
precision mediump float;

// Texture storing x, y, and z position of the boids
uniform sampler2D posTex;

// Texture storing x, y, and z velocity of the boids
uniform sampler2D velTex;

varying highp vec2 vTexCoord;

void main()
{
    vec3 currentPosition = texture2D(posTex, vTexCoord).xyz;
    vec3 currentVelocity = texture2D(velTex, vTexCoord).xyz;
    gl_FragColor = vec4(currentPosition + currentVelocity, 1.0);
}