precision mediump float;
attribute vec3 a_position;
attribute vec3 vertColor;
attribute vec2 vertTexture; //this should contain the UV coordinates for each vertex 
varying vec3 fragColor;
varying vec2 fragTexture;

//uniform mat4 u_mvp_matrix;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;


void main()
{
  fragTexture=vertTexture;
  fragColor = vertColor;
  gl_Position = mProj * mView * mWorld * vec4(a_position, 1.0);
  
}