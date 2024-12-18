// Passed texture coords and texture
varying vec2 vUv;
uniform sampler2D passTex;

void main()
{
    vec3 color = texture2D(passTex, vUv.xy).rgb;
    gl_FragColor = vec4(color, 1.0);
}