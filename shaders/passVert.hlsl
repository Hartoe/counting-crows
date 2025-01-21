// Texture coords used in fragment shader
attribute vec2 aTexCoord;

varying highp vec2 vTexCoord;

void main()
{
    gl_Position = vec4(position, 1.0);
    vTexCoord = aTexCoord;
}