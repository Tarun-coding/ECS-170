
precision mediump float;

uniform vec3 pointLightPosition;

uniform samplerCube lightShadowMap;
uniform vec2 shadowClipNearFar;


varying vec3 fragNormal;
varying vec3 fragmentPosition;
varying vec3 fragColor;



void main()
{


//   //ambient component
//   float ka=0.9; //
//   vec3 ambient=ka * ia; //lightColor is ia

//   //diffuse component
//   vec3 N=normalize(fragNormal);
//     //the L component might have to change depending on directional or point light
//     //for directional light, it's simply the direction vector 
//   //vec3 L= normalize(sun.direction-fragmentPosition);
//   vec3 L=normalize(sun.direction);
//   vec3 id=sun.color;
//   vec3 diffuse= max(dot(N,L),0.0) * id;

//  //specular component
//   float Ks=0.5;
//   vec3 V=normalize(viewPosition-fragmentPosition);
//   vec3 R=reflect(-L,N);
//   float spec=pow(max(dot(R,V),0.0),128.0);
//   vec3 specular=Ks * spec * is;

//   vec3 lightIntensity=ambient +  diffuse + specular; 
//   gl_FragColor = vec4(fragColor * lightIntensity, 1.0);

  //gl_FragColor = vec4(fragNormal, 1.0);

  vec3 toLightNormal=normalize(pointLightPosition-fragmentPosition);
  float fromLightToFrag=(length(fragmentPosition-pointLightPosition)-shadowClipNearFar.x)
                        /(shadowClipNearFar.y - shadowClipNearFar.x);
  float shadowMapValue=textureCube(lightShadowMap,toLightNormal).r;
  float lightIntensity = 0.6;
  if(shadowMapValue >= fromLightToFrag){
      lightIntensity+=0.4 * max(dot(fragNormal,toLightNormal),0.0);
  }
   gl_FragColor = vec4(fragColor * lightIntensity, 1.0);

}