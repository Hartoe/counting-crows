attribute vec3 aPosition;
uniform mat4 uViewProjectionMatrix;

void main() {
    gl_Position = uViewProjectionMatrix * vec4(aPosition, 1.0);
    gl_PointSize = 3.0; // Set point size
}
