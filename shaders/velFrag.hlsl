// TODO: THIS SHADER IS NOT FINISHED!

void main()
{
    vec3 oldVelocity = texture2D(velTex, vUv.xy).xyz;
    vec3 currentPosition = texture2D(posTex, vUv.xy).xyz;
    vec3 currentVelocity = texture2D(velTex, vUv.xy).xyz;
}