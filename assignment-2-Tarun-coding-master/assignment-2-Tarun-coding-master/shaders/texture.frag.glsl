precision mediump float;
varying vec3 fragColor;
varying vec2 fragTexture;
uniform sampler2D sampler;
void main()
{
 // gl_FragColor = vec4(fragTexture, 1.0,1.0);
  gl_FragColor = texture2D(sampler,fragTexture);
}