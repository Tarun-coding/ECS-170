#version 300 es

precision mediump float;
in vec3 a_position;
in vec3 vertColor;
in vec3 vertNormal; //normal
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj; 
uniform vec3 ia;
uniform vec3 viewPosition;
uniform float objectKa;
uniform float objectKd;
uniform float objectKs;
uniform float Ns;

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
uniform PointLight pointLights[10]; //
uniform DirectionalLight directionalLights[10];
uniform int pointLightsCount;
uniform int directionalLightsCount;





out vec4 fragColor;




//all the functions for calculations


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
vec3 calcDirectionalLight (DirectionalLight dirLight,float kd,vec3 fragNormal,vec3 viewPosition,vec3 fragmentPosition,float ks){

    //calculating diffuse component
    vec3 N=normalize(fragNormal);
    vec3 id=normalize(dirLight.color);
    vec3 is=normalize(dirLight.color);
    vec3 L=normalize(dirLight.direction); //this is the part that might have to change for spot lighting
    vec3 diffuse=calcDiffuseLight(kd,N,L,id);

    //calculating specular componenet
    vec3 V=normalize(viewPosition-fragmentPosition);
    vec3 R=reflect(-L,N);
    vec3 specular=calcSpecularLight(ks,V,R,is);
    

  
    return diffuse+specular;
}
vec3 calcPointLight(PointLight pointLight,float kd,vec3 fragNormal,vec3 viewPosition,vec3 fragmentPosition,float ks){
    //The difference is just a difference in computing L and adding attenuation

    //calculating diffuse component
    vec3 N=normalize(fragNormal);
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
void main() {
  vec3 fragmentPosition= vec3(mWorld * vec4(a_position,1.0));
  vec3 fragNormal=mat3(transpose(inverse(mWorld))) * vertNormal;
  
//ambient component
     float ka=objectKa;
     vec3 ambient=calcAmbientLight(ka,ia);



     float ks=objectKs;
     float kd=objectKd;
     vec3 lightIntensity=ambient;//+ calcDirectionalLight(sun,kd,fragNormal,viewPosition,fragmentPosition,ks);
     for(int i=0;i<directionalLightsCount;i++){
        lightIntensity+=calcDirectionalLight(directionalLights[i],kd,fragNormal,viewPosition,fragmentPosition,ks);
      }

       for(int i=0;i<pointLightsCount;i++){
         lightIntensity+=calcPointLight(pointLights[i],kd,fragNormal,viewPosition,fragmentPosition,ks);
       }

    fragColor = vec4(vertColor * lightIntensity, 1.0);
    gl_Position = mProj * mView * mWorld * vec4(a_position, 1.0);


}