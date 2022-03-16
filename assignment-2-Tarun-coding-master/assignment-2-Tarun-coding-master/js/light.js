'use strict'
//import SceneNode from "./scenenode.js"
class Light {
    constructor (name,position,color){
        this.name=name;
        console.log("we are in light constructor")
        this.position=position;
        this.color=color;
        this.directionalLights=[] //array of directional lights
        this.pointLights=[]
     //   console.log(pointLights.attenuationConstant)
        
    }
}
class directionalLight extends Light{
    constructor(name,position,color){
        super(name,position,color)
    }
}
class pointLight extends Light{
    constructor(name,position,color,attenuationConstant,attenuationLinear,attenuationQuadratic){
        super(name,position,color)
        this.attenuationConstant=attenuationConstant;
        this.attenuationLinear=attenuationLinear;
        this.attenuationQuadratic=attenuationQuadratic
    }
}


export
{

    Light,
    directionalLight,
    pointLight

}