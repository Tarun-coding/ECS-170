#version 300 es
precision mediump float;
// TODO implement a flat-shading vertex shader
//youtube example


in vec3 a_position;
in vec3 vertColor;
in vec3 vertNormal; //normal
in vec2 vertTexture;
in vec3 vertTangent;
in vec3 vertBitangent;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj; 

out vec2 fragTexture;
out vec3 fragColor;
out vec3 fragNormal;
out vec3 fragmentPosition;
out mat3 fragTBN;



//uniform mat4 u_mvp_matrix;

void main() {
  fragmentPosition= vec3(mWorld * vec4(a_position,1.0));
  fragColor = vertColor;
  fragTexture=vertTexture;
  //fragNormal=(mWorld * vec4(vertNormal,0.0)).xyz;
  //fragNormal=transpose(mat3(mWorld)) * vertNormal;
  vec3 T = normalize(vec3(mWorld * vec4(vertTangent,   0.0)));
  vec3 B = normalize(vec3(mWorld * vec4(vertBitangent, 0.0)));
  vec3 N = normalize(vec3(mWorld * vec4(vertNormal,    0.0)));
  fragTBN = mat3(T,B,N);
  fragNormal = mat3(transpose(inverse(mWorld))) * vertNormal; 
  gl_Position = mProj * mView * mWorld * vec4(a_position, 1.0);


  
  // gl_Position = vec4(vertPosition, 1.0);
 // gl_Position = u_mvp_matrix * vec4(a_position, 1.0);
  
  //gl_position = u_mvp_matrix * vec4(vertPosition, 1.0);

}