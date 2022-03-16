precision mediump float;
attribute vec3 a_position;
attribute vec3 vertColor;
varying vec3 fragColor;

//uniform mat4 u_mvp_matrix;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;


void main()
{
  fragColor = vertColor;
  gl_Position = mProj * mView * mWorld * vec4(a_position, 1.0);
  
}