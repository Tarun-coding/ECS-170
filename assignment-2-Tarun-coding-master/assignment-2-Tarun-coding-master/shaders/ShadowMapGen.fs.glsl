precision mediump float;
uniform vec3 pointLightPosition;
uniform vec2 shadowClipNearFar; //the x component is the near cliping plane
//y component is the far clipping plane

varying vec3 fragmentPosition;

void main()
{
    vec3 fromLightToFrag=fragmentPosition-pointLightPosition;
    float lightFragDist = (length(fromLightToFrag)-shadowClipNearFar.x)/(shadowClipNearFar.y-shadowClipNearFar.x);

    gl_FragColor=vec4(lightFragDist,lightFragDist,lightFragDist,1.0);
}