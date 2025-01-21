// Texture coords used in fragment shader
attribute vec2 aTexCoord;

attribute vec3 position;

varying highp vec2 vTexCoord;

void main()
{
    gl_Position = vec4(position, 1.0);
    vTexCoord = aTexCoord;
}