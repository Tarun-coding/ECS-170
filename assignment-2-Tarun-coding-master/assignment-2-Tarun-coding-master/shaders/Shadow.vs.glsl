// TODO implement a flat-shading vertex shader
//youtube example
precision mediump float;
attribute vec3 a_position;
attribute vec3 vertColor;
attribute vec3 vertNormal; //normal
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj; 

varying vec3 fragColor;
varying vec3 fragNormal;
varying vec3 fragmentPosition;



//uniform mat4 u_mvp_matrix;

void main() {
  fragmentPosition= vec3(mWorld * vec4(a_position,1.0));
  fragColor = vertColor;
  fragNormal=(mWorld * vec4(vertNormal,0.0)).xyz;
  gl_Position = mProj * mView * mWorld * vec4(a_position, 1.0);


  
  // gl_Position = vec4(vertPosition, 1.0);
 // gl_Position = u_mvp_matrix * vec4(a_position, 1.0);
  
  //gl_position = u_mvp_matrix * vec4(vertPosition, 1.0);

}