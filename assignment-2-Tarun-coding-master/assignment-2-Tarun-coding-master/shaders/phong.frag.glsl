#version 300 es
precision mediump float;
out vec4 FragColor;

struct DirectionalLight
{
  vec3 direction; //Lm
  vec3 color; //id
};
struct PointLight
{
  vec3 direction; //Lm
  vec3 color; //id
  float attenuationConstant;
  float attenuationLinear;
  float attenuationQuadratic;
};
in vec3 fragColor;
in vec3 fragNormal;
in vec3 fragmentPosition;
in vec2 fragTexture;
in mat3 fragTBN;
uniform vec3 ia; 
uniform vec3 viewPosition;
uniform int pointLightsCount;
uniform int directionalLightsCount;
uniform PointLight pointLights[10]; //
uniform DirectionalLight directionalLights[10];
uniform float objectKa;
uniform float objectKd;
uniform float objectKs;
uniform float Ns;
uniform sampler2D diffuseMapping;
uniform sampler2D normalMapping;




vec3 calcAmbientLight(float ka,vec3 ia){
  return ka * ia;
}
vec3 calcDiffuseLight(float kd,vec3 N,vec3 L,vec3 id){
  return kd * max(dot(N,L),0.0) * id;
  
}
vec3 calcSpecularLight(float ks,vec3 V,vec3 R,vec3 is){
  float spec=pow(max(dot(R,V),0.0),Ns);
  return ks * spec * is;
}
vec3 calcDirectionalLight (DirectionalLight dirLight,float kd,vec3 fragNormal,vec3 viewPosition,vec3 fragmentPosition,float ks,vec3 N){

    //calculating diffuse component
    //vec3 N=normalize(fragNormal);
    vec3 id=normalize(dirLight.color);
    vec3 is =normalize(dirLight.color);
    vec3 L=normalize(dirLight.direction); //this is the part that might have to change for spot lighting
    vec3 diffuse=calcDiffuseLight(kd,N,L,id);

    //calculating specular componenet
    vec3 V=normalize(viewPosition-fragmentPosition);
    vec3 R=reflect(-L,N);
    vec3 specular=calcSpecularLight(ks,V,R,is);
    

  
    return diffuse+specular;
}
vec3 calcPointLight(PointLight pointLight,float kd,vec3 fragNormal,vec3 viewPosition,vec3 fragmentPosition,float ks,vec3 N){
    //The difference is just a difference in computing L and adding attenuation

    //calculating diffuse component
    //vec3 N=normalize(fragNormal);
    vec3 id=normalize(pointLight.color);
    vec3 is=normalize(pointLight.color);
    vec3 L=normalize(pointLight.direction-fragmentPosition);
    vec3 diffuse=calcDiffuseLight(kd,N,L,id);

    //calculating specular component
    vec3 V=normalize(viewPosition-fragmentPosition);
    vec3 R=reflect(-L,N);
    vec3 specular=calcSpecularLight(ks,V,R,is);

    //now we add attenuation
    float distance= length(pointLight.direction-fragmentPosition);
    float attenuation= 1.0 / (pointLight.attenuationConstant + pointLight.attenuationLinear * distance + 
  			     pointLight.attenuationQuadratic * (distance * distance));
    diffuse*=attenuation;
    specular*=attenuation;

    return diffuse+specular;



}
void main()
{
  
  float ka=objectKa;
  float kd=objectKd;
  float ks=objectKs;
  //calculating N
  vec3 N=texture(normalMapping,fragTexture).rgb;
  N=N * 2.0 - 1.0;
  N=normalize(fragTBN * N);
  //vec3 N=normalize(fragNormal);

  vec3 ambient=calcAmbientLight(ka,ia); //we are calculating the ambient component in main since it isn't recomputed for each light
  vec3 lightIntensity=ambient;//+calcDirectionalLight(sun, kd, fragNormal, viewPosition, fragmentPosition, ks);
  //This is where the loop for the point light goes. we are going to lightIntensity+=
  //first let's see the working of one point light:
  for(int i=0;i<directionalLightsCount;i++){
   lightIntensity+=calcDirectionalLight(directionalLights[i],kd,fragNormal,viewPosition,fragmentPosition,ks,N);
  }
  for(int i=0;i<pointLightsCount;i++){
    lightIntensity+=calcPointLight(pointLights[i],kd,fragNormal,viewPosition,fragmentPosition,ks,N);
  }
  FragColor = vec4(texture(diffuseMapping,fragTexture).xyz * lightIntensity, 1.0);

}


