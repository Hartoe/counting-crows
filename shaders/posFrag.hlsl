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
    gl_FragColor = vec4(currentPosition + currentVelocity, 1.0);
}