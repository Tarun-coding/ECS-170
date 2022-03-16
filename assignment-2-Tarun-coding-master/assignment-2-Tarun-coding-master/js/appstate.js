'use strict'
import input from "./input.js"
import {unproject} from "./raycaster.js"
import {rayIntersectsTriangle} from "./raycaster.js"
import
{

    hex2rgb,
    
}
from './utils.js'
class AppState
{

    constructor( app )
    {

        this.app = app
        this.is_selecting = false

        // get list of ui indicators
        this.ui_categories = {

            "camera_mode":
            {

                "fps": document.getElementById( "fpsCamMode" ),
                "stationary": document.getElementById( "statCamMode" )

            },
            "projection_mode":
            {

                "perspective": document.getElementById( "perspProjMode" ),
                "orthographic": document.getElementById( "orthoProjMode" )

            },
            "selection":
            {

                "raycasting": document.getElementById( "selectionRaycasting" ),
                "target": document.getElementById( "selectionTarget" )

            },
            "shading":
            {
                "flat": document.getElementById( "flat" ),
                "gouraud": document.getElementById( "gouraud" ),
                "phong": document.getElementById("phong"),
            }
            // "ka":
            // {
            //     "kaOne":document.getElementById("value-slider")
            // }

        }

        this.foundObject=-1
        // update ui with default values
        this.updateUI( "camera_mode", "stationary" )
        this.cameraMode="stationary"
        this.updateUI( "shading", "phong" )
        this.shading="phong"
        this.updateUI( "projection_mode", "perspective" )
        this.projectionMode="perspective"
        this.updateUI( "selection", "target" )
        this.selection="target"

        //modifications
        this.modificationObjectOrLight=document.getElementById("objectOrLight").value;
        this.modificationSelectVariable=document.getElementById("selectVariable").value
        this.modificationChangeValue=document.getElementById("value-slider").value
        this.modificationColor=document.getElementById("color-picker").value
        this.modificationTextureComputation=document.getElementById("textureComputation").value;
        //console.log(this.modificationTextureComputation)
     //   console.log(this.modificationObjectOrLight[0])
    }

    /**
     * Updates the app state by checking the input module for changes in user input
     */
    update( )
    {
        this.modificationObjectOrLight=document.getElementById("objectOrLight").value;
        this.modificationSelectVariable=document.getElementById("selectVariable").value
        this.modificationChangeValue=document.getElementById("value-slider").value
        this.modificationColor=document.getElementById("color-picker").value
        this.modificationTextureComputation=document.getElementById("textureComputation").value;
        this.app.textureComputation=this.modificationTextureComputation
       // console.log(this.modificationColor)
        

        //
        if(this.modificationObjectOrLight[0]=="o"){
            //console.log("it's an object")
            if(this.modificationSelectVariable=="ka"){
               // console.log(this.modificationChangeValue*0.01)
                //console.log("we are changing ka")
                this.app.kaModifier=this.modificationChangeValue*0.01
             // console.log(this.modificationChangeValue)
            }else if(this.modificationSelectVariable=="kd"){
                this.app.kdModifier=this.modificationChangeValue*0.01;
            }else if(this.modificationSelectVariable=="ks"){
                this.app.ksModifier=this.modificationChangeValue*0.01;
            }
        }else if(this.modificationObjectOrLight=="pointLight Two"){//we are in point light
            //console.log(this.modificationObjectOrLight) 
            if(this.modificationSelectVariable=="position"){
                var secondary=this.modificationChangeValue%1000
                this.app.scene.light.pointLights[1].position=[0,0,15];
                this.app.scene.light.pointLights[1].position[2]+=secondary
            }else if(this.modificationSelectVariable=="color"){
                this.app.scene.light.pointLights[1].color=this.modificationColor
               // console.log(hex2rgb(this.app.scene.light.pointLights[1].color)[0]+1)
                // this.app.scene.light.pointLights[1].color[1]+=this.modificationChangeValue*0.01
                // this.app.scene.light.pointLights[1].color[2]+=this.modificationChangeValue*0.01
            }
        }else if(this.modificationObjectOrLight=="pointLight One"){
            if(this.modificationSelectVariable=="position"){
                var secondary=this.modificationChangeValue%1000
                this.app.scene.light.pointLights[0].position=[10,0,0];
                this.app.scene.light.pointLights[0].position[0]+=secondary
            }else if(this.modificationSelectVariable=="color"){
                this.app.scene.light.pointLights[0].color=this.modificationColor

            }
        }
        // TODO check user input using the input module and create appropriate handlers to manipulate the canvas

        // TODO don't forget to update the ui as seen in the constructor to tell the ui what mode you're in
        //console.log(document.getElementById("objectOrLight").value)
        if(input.isKeyPressed('r'))
        {
            if(this.selection!='raycasting'){
                this.updateUI("selection","raycasting")
                this.selection="raycasting";
            }else{
                this.updateUI("selection","target")
                this.selection="target"
                this.foundObject=-1
            }
        }
        if(input.isKeyPressed('p')){
            this.updateUI('projection_mode','perspective')
            this.projectionMode='perspective'
        }
        if(input.isKeyPressed('o')){
            this.updateUI('projection_mode','orthographic')
            this.projectionMode="orthographic"
        }
        if(input.isKeyPressed('1')){
            this.updateUI('shading','phong')
            this.shading='phong'
        }
        if(input.isKeyPressed('2')){
            this.updateUI('shading','flat')
            this.shading='flat'
        }if(input.isKeyPressed('3')){
            this.updateUI('shading','gouraud');
            this.shading='gouraud';
        }
       
        if(this.selection=="raycasting"){
            if(input.isMouseClicked('0')){
                if(this.foundObject<0){
            

                    // console.log("hey")
                    this.projectionInverse=mat4.create();
                    this.viewInverse=mat4.create();
                    //console.log(this.app.scene.camera.projMatrix)
                    mat4.invert(this.projectionInverse,this.app.scene.camera.orthoAndProjMatrix)
                    // console.log(projectionInverse)
                    //console.log(this.app.scene.camera.viewMatrix)
                    mat4.invert(this.viewInverse,this.app.scene.camera.viewMatrix)
                    //console.log(viewInverse)
                    // console.log(input.last_mousex)
                    this.ray=unproject([input.mousex,input.mousey],[0,0,this.app.canvas.width,this.app.canvas.height],this.projectionInverse,this.viewInverse)
                    console.log(this.ray)
                    
                        //console.log("that's the ray")
                        //console.log(this.app.scene.scene.children[1].vbo_data)
                        

                    // for(var objectIndex=this.app.scene.scene.children.length-1;objectIndex>0;objectIndex--){
                        // if(this.objectSelected(objectIndex))

                // }
                    this.foundObject=this.objectSelected();
                 }
             }
        if(input.isMouseDown('2')){
             if(this.foundObject>0){
             console.log("object selected is",this.app.scene.scene.children[this.foundObject].name);
        //here we must manipulate the object given user input
        
            console.log("we are in here")
            var dy=input.getMouseDy();
            if(dy!=0){
                this.app.scene.scene.children[this.foundObject].update(dy,0);
            }
        }
       }else if(input.isMouseDown('0')){
           if(this.foundObject>0){
                var dx=input.getMouseDx();
                var dy=input.getMouseDy();
             if(Math.abs(dx)>Math.abs(dy)){
                 if(dx<0){
                 mat4.rotate(this.app.scene.scene.children[this.foundObject].modelMatrix,this.app.scene.scene.children[this.foundObject].modelMatrix,glMatrix.glMatrix.toRadian(10),[0,1,0])
                 }else{
                    mat4.rotate(this.app.scene.scene.children[this.foundObject].modelMatrix,this.app.scene.scene.children[this.foundObject].modelMatrix,glMatrix.glMatrix.toRadian(10),[0,1,0])

                 }

             }else if(Math.abs(dy)>Math.abs(dx)){
                mat4.rotate(this.app.scene.scene.children[this.foundObject].modelMatrix,this.app.scene.scene.children[this.foundObject].modelMatrix,glMatrix.glMatrix.toRadian(10),[1,0,0])

             }
           }
       }

         //rayIntersectsTriangle(this.app.scene.camera.position,ray)
         
        
    }
    
        //this is the end of ray casting
        else{
            if(input.isMouseDown('2')){
           
                var dy=input.getMouseDy();
                if(dy!=0){
                 this.app.scene.camera.update(dy,2)
                // this.scene.camera.distanceFromCenter=this.scene.camera.position[2]
                 }
                 //this.scene.camera.angle=0
     
            }
            if(input.isMouseDown('0')){
                // console.log("the mouse was pressed")
             var dx=input.getMouseDx();
             var dy=input.getMouseDy();
             if(Math.abs(dx)>Math.abs(dy)){
                
                // for(var objectIndex=0; objectIndex<this.scene.scene.children.length;objectIndex++){
                    // mat4.rotate(this.scene.scene.children[objectIndex].modelMatrix,this.scene.scene.children[objectIndex].modelMatrix,glMatrix.glMatrix.toRadian(angle),[0,1,0])
                    this.app.scene.camera.update(dx,0)
 
                 //}
             }else if(Math.abs(dy)>Math.abs(dx)){
                 this.app.scene.camera.update(dy,3)
                 }
         }
        }


    }

    /**
     * Updates the ui to represent the current interaction
     * @param { String } category The ui category to use; see this.ui_categories for reference
     * @param { String } name The name of the item within the category
     * @param { String | null } value The value to use if the ui element is not a toggle; sets the element to given string 
     */
    objectSelected(objectIndex)
    {
        for(var objectIndex=this.app.scene.scene.children.length-1;objectIndex>0;objectIndex--){

        var arrayOfPoints=[]
            var arrayOfVectors=[];
        //   console.log(this.app.scene.scene.children[1].vbo_data)
        for(var vboIndex=0;vboIndex<this.app.scene.scene.children[objectIndex].vbo_data.length;vboIndex++){
            for(var verticesIndex=0;verticesIndex<3;verticesIndex++){
                arrayOfPoints.push(this.app.scene.scene.children[objectIndex].vbo_data[vboIndex])

                vboIndex++;
                
            }
            arrayOfVectors.push(vec3.fromValues(arrayOfPoints[0],arrayOfPoints[1],arrayOfPoints[2]))
            arrayOfPoints=[]
            
            
            vboIndex+=5;
        }
        //now we have an array of vertices push 3 of them into an array and pass them into rayIntersectsTriangle
        for(var vectorsIndex=0;vectorsIndex<arrayOfVectors.length;vectorsIndex+=3){
            var triangle=[]
            for(var vertexIndex=0;vertexIndex<3;vertexIndex++){
                triangle.push(arrayOfVectors[vertexIndex+vectorsIndex])
                //console.log(arrayOfVectors[vertexIndex])
            }
            // console.log(triangle[0])
            //console.log(triangle[1])
            //console.log(triangle[2])


            
            for(var eachVertex=0;eachVertex<triangle.length;eachVertex++){
                //  console.log(triangle[eachVertex])
                var vectorFourforVertex=vec4.fromValues(triangle[eachVertex][0],triangle[eachVertex][1],triangle[eachVertex][2],1)
                //multiplying by model matrix
                // console.log(vectorFourforVertex)
                vec4.transformMat4(vectorFourforVertex,vectorFourforVertex,this.app.scene.scene.children[objectIndex].modelMatrix)
                //console.log(vectorFourforVertex)

                //console.log(this.app.scene.scene.modelMatrix)
                //console.log(this.app.scene.scene.children[1].modelMatrix)

                //now passing it back into triangle
                triangle[eachVertex]=vec3.fromValues(vectorFourforVertex[2],vectorFourforVertex[0],vectorFourforVertex[1])
                //console.log(triangle[eachVertex])
                
            }
                //console.log(triangle[0])
            //console.log(triangle[1])
            //console.log(triangle[2])
            var intersectionPoint=null;
            console.log(rayIntersectsTriangle(this.app.scene.camera.position,this.ray,triangle,intersectionPoint))
        


            //console
            if(rayIntersectsTriangle(this.app.scene.camera.position,this.ray,triangle,intersectionPoint)){
                //console.log(this.app.scene.scene.children[objectIndex].name)
                return objectIndex
                    //console.log("plane")

            }
            
        }
    }
    return -1
}
    updateUI( category, name, value = null )
    {

        for ( let key in this.ui_categories[ category ] )
        {

            this.updateUIElement( this.ui_categories[ category ][ key ], key == name, value )

        }

    }

    /**
     * Updates a single ui element with given state and value
     * @param { Element } el The dom element to update
     * @param { Boolean } state The state (active / inactive) to update it to
     * @param { String | null } value The value to use if the ui element is not a toggle; sets the element to given string 
     */
    updateUIElement( el, state, value )
    {

        el.classList.remove( state ? "inactive" : "active" )
        el.classList.add( state ? "active" : "inactive" )

        if ( state && value != null )
            el.innerHTML = value

    }

}

export default AppState
