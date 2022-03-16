'use strict'

import SceneNode from "./scenenode.js";
import AppState from "./appstate.js";
class ObjectNode extends SceneNode
{

    constructor( vbo_data, name, parent, translation = vec3.create( ), rotation = vec3.create( ), scale = vec3.fromValues( 1, 1, 1 ) )
    {

        super( name, parent, translation, rotation, scale )
        // if(name=="cube"){
        //     console.log(vbo_data)
        // }
        this.vbo_data = new Float32Array( vbo_data )
        this.vbo = null
        
        //this.modelMatrix=mat4.create();
       // mat4.multiply(this.modelMatrix,rotation,scale)
        //mat4.multiply(this.modelMatrix,this.modelMatrix,translation)
       // console.log(this.modelMatrix)
        //this.modelMatrix=mat4.create();
        //this.modelMatrix=this.scale
        
        //this.modelMatrix=mat4.create();
        //mat4.fromRotationTranslationScale(this.modelMatrix,vec4.create(this.rotation,1.0),this.translation,this.scale)
    //        console.log(this.vbo_data)
        mat4.mul(parent.modelMatrix,parent.modelMatrix,this.modelMatrix)
      //  mat4.fromRotationTranslationScale(this.modelMatrix,vec4.create(this.rotation,1.0),this.translation,this.scale)
        
      
    }

    update(dy,conditionNumber)
    {
        if(conditionNumber==0){
        super.update( )
        if(dy<0){
        this.scale[0]=this.scale[0]*dy
        this.scale[1]=this.scale[1]*dy
        this.scale[2]=this.scale[2]*dy
       // this.translation[0]=this.translation[0]*dy
        //this.translation[1]=this.translation[1]*dy
        //this.translation[2]=this.translation[2]*dy

        }else{
        this.scale[0]=this.scale[0]/dy
        this.scale[1]=this.scale[1]/dy
        this.scale[2]=this.scale[2]/dy
        //this.translation[0]=this.translation[0]/dy
       // this.translation[1]=this.translation[1]/dy
       // this.translation[2]=this.translation[2]/dy

        }
        mat4.fromRotationTranslationScale(this.modelMatrix,vec4.create(this.rotation,1.0),this.translation,this.scale)
        //console.log(this.translation)
        }//else if(conditionNumber==1){

       // }
       mat4.fromRotationTranslationScale(this.modelMatrix,vec4.create(this.rotation,1.0),this.translation,this.scale)


        // TODO Make any updates to your object here

    }

    createBuffers( gl )
    {
        // TODO Create your VBO buffer here and upload data to the GPU
        
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vbo_data), gl.STATIC_DRAW);
        
    
    }

    render( gl, shader,colorCondition )
    {

        if ( this.vbo == null )
            this.createBuffers( gl )

        // TODO Link your VBO to your shader variables here
        // TODO Remember that your VBO contains not only vertex data but also colors and normals - chose stride and offset appropriately
        	//	var mvp=mat4.create()

        //mat4.mul(mvp,viewMatrix, this.modelMatrix)
        //mat4.mul(mvp,projMatrix,mvp)
       // shader.setUniform4x4f('u_mvp_matrix',mvp);
       
    //     shader.setArrayBuffer('a_position',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,0);
    //    // if(colorCondition){
    //     shader.setArrayBuffer('vertColor',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
    //     shader.setArrayBuffer('vertTexture',this.vbo,2,17*Float32Array.BYTES_PER_ELEMENT,9*Float32Array.BYTES_PER_ELEMENT)
    //     if(colorCondition!="flat"){
    //     shader.setArrayBuffer('vertNormal',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,6*Float32Array.BYTES_PER_ELEMENT);
    //     shader.setArrayBuffer('vertTangent',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,11*Float32Array.BYTES_PER_ELEMENT);
    //     shader.setArrayBuffer('vertBitangent',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,14*Float32Array.BYTES_PER_ELEMENT);


    //     }
        if(colorCondition=="flat"){
            shader.setArrayBuffer('a_position',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,0);
             shader.setArrayBuffer('vertColor',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
             shader.setArrayBuffer('vertTexture',this.vbo,2,17*Float32Array.BYTES_PER_ELEMENT,9*Float32Array.BYTES_PER_ELEMENT)
        }else if(colorCondition=="gouraud"){
            shader.setArrayBuffer('a_position',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,0);
            shader.setArrayBuffer('vertColor',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
            shader.setArrayBuffer('vertNormal',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,6*Float32Array.BYTES_PER_ELEMENT);

        }else if(colorCondition=="phong"){
            shader.setArrayBuffer('a_position',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,0);
            // if(colorCondition){
             shader.setArrayBuffer('vertColor',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
             shader.setArrayBuffer('vertTexture',this.vbo,2,17*Float32Array.BYTES_PER_ELEMENT,9*Float32Array.BYTES_PER_ELEMENT)
             shader.setArrayBuffer('vertNormal',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,6*Float32Array.BYTES_PER_ELEMENT);
             shader.setArrayBuffer('vertTangent',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,11*Float32Array.BYTES_PER_ELEMENT);
             shader.setArrayBuffer('vertBitangent',this.vbo,3,17*Float32Array.BYTES_PER_ELEMENT,14*Float32Array.BYTES_PER_ELEMENT);
     
        }
       // }
        //have to still do: linking normals
        //console.log(this.vbo_data)
        // TODO Call drawArrays to draw the geometry
        gl.drawArrays(gl.TRIANGLES,0,this.vbo_data.length/9) 

    }
}

export default ObjectNode
