'use strict'

import Input from "./input.js"
import AppState from "./appstate.js"
import Shader from "./shader.js"
import { colorPicked, sliderChanged } from "./script.js";

import
{

    hex2rgb,
    loadMtlFile
}
from './utils.js'
//my import




class App
{

    constructor( scene )
    {
      
    //let data=loadMtlFile("../shaders/blenderSphere.mtl")
    //console.log(parseFloat(data[2]))
    this.app_state = new AppState( this )
    console.log('This is working');

	this.canvas = document.getElementById('canvas');
    this.canvas.addEventListener( "contextmenu", event => event.preventDefault( ) );

	this.gl = this.initGl();
    this.gl.enable(this.gl.DEPTH_TEST);
	//
	// Create shaders
	// 
   this.shader= new Shader( this.gl, "../shaders/wireframe.vert.glsl", "../shaders/wireframe.frag.glsl" );
   this.shadowShader=new Shader(this.gl,"../shaders/Shadow.vs.glsl","../shaders/Shadow.fs.glsl");
   this.shadowMapGenShader=new Shader(this.gl,"../shaders/ShadowmapGen.vs.glsl","../shaders/ShadowMapGen.fs.glsl");

	//
	// Create buffer
	//
    
    this.Xangle=0;
    this.Yangle=0;
    
   this.kaModifier=0;
   this.kdModifier=0;
   this.ksModifier=0;
    this.scene=scene;

     
    this.shader.use();
    this.shadowShader.use();
    

	var worldMatrix=new Float32Array(16);
	
	mat4.identity(worldMatrix);
    if(this.app_state.projectionMode=="perspective"){
        this.scene.camera.perspectiveProjection(this)
    }
    
    

    


    this.worldMatrix=worldMatrix;
    
    this.xRotationMatrix=new Float32Array(16);
    this.yRotationMatrix=new Float32Array(16);


    //creating textures
    this.textureComputation="Bi-Linear"
    //sphere texture
    this.sphereTexture=this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D,this.sphereTexture);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
	this.gl.texImage2D(
		this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
		this.gl.UNSIGNED_BYTE,
		document.getElementById('moonTexture')
	);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);
    //floor texture
    this.floorTexture=this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D,this.floorTexture);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
	this.gl.texImage2D(
		this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
		this.gl.UNSIGNED_BYTE,
		document.getElementById('floorTexture')
	);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    this.boxTextureTwo=this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D,this.boxTextureTwo);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
	this.gl.texImage2D(
		this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
		this.gl.UNSIGNED_BYTE,
		document.getElementById('boxTexture')
	);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    this.dogTexture=this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D,this.dogTexture);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
	this.gl.texImage2D(
		this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
		this.gl.UNSIGNED_BYTE,
		document.getElementById('dogTexture')
	);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    this.cylinderTexture=this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D,this.cylinderTexture);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
	this.gl.texImage2D(
		this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
		this.gl.UNSIGNED_BYTE,
		document.getElementById('cylinderTexture')
	);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    this.cubeTexture=this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D,this.cubeTexture);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
	this.gl.texImage2D(
		this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
		this.gl.UNSIGNED_BYTE,
		document.getElementById('dogTexture')
	);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    this.floorTextureNormal=this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D,this.floorTextureNormal);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
	this.gl.texImage2D(
		this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
		this.gl.UNSIGNED_BYTE,
		document.getElementById('floorTextureNormal')
	);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    this.sphereTextureNormal=this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D,this.sphereTextureNormal);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
	this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
	this.gl.texImage2D(
		this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
		this.gl.UNSIGNED_BYTE,
		document.getElementById('moonTextureNormal')
	);
	this.gl.bindTexture(this.gl.TEXTURE_2D,null);

    



	this.resizeToDisplay( )
    
        window.onresize = this.resizeToDisplay.bind( this )
        window.colorPicked = colorPicked
        window.sliderChanged = sliderChanged
    //this.scene.light.pointLights[1].position[2]+=1
    }

    /** 
     * Resizes camera and canvas to pixel-size-corrected display size
     */
   
    resizeToDisplay( )
    {

        // TODO handle window resizes
        const dpr = window.devicePixelRatio;
        //ctx.scale(dpr,dpr)
        const
        {
            width,
            height
        } = canvas.getBoundingClientRect( );

        
        let scaledWidth = Math.round( width * dpr  )
        let scaledHeigth = Math.round( height * dpr )
       // ctx.scale();
        this.canvas.width = scaledWidth
        this.canvas.height = scaledHeigth
    }

    /**
     * Initializes webgl2 with settings
     * @returns { WebGL2RenderingContext | null }
     */
    initGl( )
    {

        // TODO implement

        let gl

        gl=this.canvas.getContext('webgl2')
        

        if(!gl)
            throw Error('could not get webgl context')

        return gl

    }

    /**
     * Starts render loop
     */
    start( )
    {

        requestAnimationFrame( ( ) =>
        {

            this.update( )

        } )

    }

    /**
     * Called every frame, triggers input and app state update and renders a frame
     */
    update( )
    {

        this.app_state.update( )

        // TODO If you choose to use movement.js to implement your movement interaction, update your movement instance here

        Input.update( )
        this.render( )
        requestAnimationFrame( ( ) =>
        {


            this.update( )

        } )

    }

    /**
     * Main render loop
     */
    render( )
    {
       // console.log(sliderChanged())
        if(this.app_state.shading=="flat"){
        
        this.shader= new Shader( this.gl, "../shaders/texture.vert.glsl", "../shaders/texture.frag.glsl" );
        
        }else if(this.app_state.shading=="gouraud"){
            this.shader= new Shader( this.gl, "../shaders/gouraud.vert.glsl", "../shaders/gouraud.frag.glsl" );
        }else if(this.app_state.shading=="phong"){
            this.shader= new Shader(this.gl,"../shaders/phong.vert.glsl","../shaders/phong.frag.glsl");
        }

        if(this.app_state.projectionMode=="perspective"){
            this.scene.camera.perspectiveProjection(this)

        }else{
            this.scene.camera.orthogonalProjection(this)
        }
        this.shader.use()
        

       this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height )
            //this.shader.setUniform3f('pointLights[0].direction',this.scene.scene.children[1].translation);


        //for loop for setting up point lights
        //console.log(this.scene.light)   

        //now I need a loop for each and every point light
        
        for(var i=0;i < this.scene.light.pointLights.length;i++){
            var rgbVector=hex2rgb(this.scene.light.pointLights[i].color)
            //rgbVector[0]+=this.pointLightColorModifier[i];
            
            //console.log(this.pointLightColorModifier)
            

          //  rgbVector[1]+=4
          //  rgbVector[1]+=this.pointLightColorModifier[i];
            //rgbVector[2]+=this.pointLightColorModifier[i];

            this.shader.setUniform3f('pointLights['+i+'].color',rgbVector);
            this.shader.setUniform1f('pointLights['+i+'].attenuationConstant',this.scene.light.pointLights[i].attenuationConstant);
            this.shader.setUniform1f('pointLights['+i+'].attenuationLinear',this.scene.light.pointLights[i].attenuationLinear);
            this.shader.setUniform1f('pointLights['+i+'].attenuationQuadratic',this.scene.light.pointLights[i].attenuationQuadratic);

            //code to make light rotate
            if(i<2){
                var distanceFromCenterX=Math.sqrt(Math.pow(this.scene.light.pointLights[i].position[2]-1,2)+Math.pow(this.scene.light.pointLights[i].position[0],2))
                if(i==0){
                this.scene.light.pointLights[i].position[0]=0+Math.cos(this.Xangle/2)*(distanceFromCenterX);
                this.scene.light.pointLights[i].position[2]=1+Math.sin(this.Xangle/2)*(distanceFromCenterX);
                }else{
                this.scene.light.pointLights[i].position[0]=0+Math.cos(this.Yangle/2)*(distanceFromCenterX);
                this.scene.light.pointLights[i].position[2]=1+Math.sin(this.Yangle/2)*(distanceFromCenterX);
                //this.scene.light.pointLights[1].position[0]+=1

                }
                this.scene.scene.children[i+1].translation=this.scene.light.pointLights[i].position
             }else{ //this code is for drawing stars
                this.scene.scene.children[i+1].translation[0]=this.scene.light.pointLights[i].position[0]+5
                this.scene.scene.children[i+1].translation[1]=this.scene.light.pointLights[i].position[1]
                this.scene.scene.children[i+1].translation[2]=this.scene.light.pointLights[i].position[2]



             }
             this.shader.setUniform3f('pointLights['+i+'].direction',this.scene.light.pointLights[i].position);

            
            
            this.scene.scene.children[i+1].update(1,1);

           
        }
        
        //console.log(this.scene.scene.children[3].translation)
        for(var i=0;i<this.scene.light.directionalLights.length;i++){
            this.shader.setUniform3f('directionalLights['+i+'].color',hex2rgb(this.scene.light.directionalLights[i].color));
            this.shader.setUniform3f('directionalLights['+i+'].direction',this.scene.light.directionalLights[i].position);


        }
     
      
        this.Xangle+=0.1;
        this.Yangle+=0.05;
        this.shader.setUniform1i('pointLightsCount',this.scene.light.pointLights.length);
        this.shader.setUniform1i('directionalLightsCount',this.scene.light.directionalLights.length);



    


        //setting up the only directional light 
        //console.log(hex2rgb(this.scene.light.color))
       // this.shader.setUniform3f('ia',[1,1,1]); //setting ia
        this.shader.setUniform3f('ia',hex2rgb(this.scene.light.color)); 

        //this.shader.setUniform3f('sun.direction',[5.0,4.0,0.0]);//setting Lm
        //this.shader.setUniform3f('sun.color',[153, 153, 153]); //setting Kd
        this.shader.setUniform3f('viewPosition',this.scene.camera.position); //camera position for specular lighting

        //work on setting up multiple directional lights
          
        
      
        


        mat4.rotate(this.scene.scene.children[0].modelMatrix,this.scene.scene.children[0].modelMatrix,glMatrix.glMatrix.toRadian(1),[0,1,0]);
        
        // this.scene.scene.children[1].update(1,1);
        // this.scene.scene.children[2].update(1,1);
        //trying to rotate the blender cube around the teapot

       //creating a generic code for traversing every single child in a scenenode
       //calling render
       this.shader.setUniform1i('diffuseMapping',0)
       this.shader.setUniform1i('normalMapping',1)
       
      // this.gl.activeTexture(this.gl.TEXTURE0);
      

       
		
       for(var objectIndex=0; objectIndex<this.scene.scene.children.length;objectIndex++){
           //using diffenet textures based on object 
           if(objectIndex==0){
                            //sets a texture unit to use a particular texture 
        //  this.gl.activeTexture(this.gl.TEXTURE1);
        //     this.gl.bindTexture(this.gl.TEXTURE_2D,this.floorTextureNormal);
             this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.sphereTexture);
           

            

           
           }else if(objectIndex==1 ||objectIndex==2){
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.boxTextureTwo);
           }else if(objectIndex==3){
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.floorTexture);

           // this.gl.activeTexture(this.gl.TEXTURE1)
            //this.gl.bindTexture(this.gl.TEXTURE_2D,this.floorTextureNormal);
           }else if(objectIndex==4||objectIndex==8){
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.sphereTexture);
            this.gl.activeTexture(this.gl.TEXTURE1)
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.floorTextureNormal);
           }
           else if(objectIndex==5){
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.dogTexture);
            // this.gl.activeTexture(this.gl.TEXTURE1)
            //this.gl.bindTexture(this.gl.TEXTURE_2D,this.floorTextureNormal);
           }
           if(this.textureComputation=="Bi-Linear"){
            this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR);
           
           }else{
            this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST);
           }
         //  this.gl.activeTexture(this.gl.TEXTURE1)
           //this.gl.bindTexture(this.gl.TEXTURE_2D,this.floorTextureNormal);
        // if(this.textureComputation=="Nearest"){
        //     this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST);
        //      this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST);
        // }
          if(this.app_state.shading!="flat"){
              let data=loadMtlFile("../objects/"+this.scene.scene.children[objectIndex].name+".mtl")
             //console.log(this.kaModifier)
              this.shader.setUniform1f('objectKa',data[1]+this.kaModifier)
              this.shader.setUniform1f('objectKd',data[2]+this.kdModifier)
              this.shader.setUniform1f('objectKs',data[3]+this.ksModifier)
              this.shader.setUniform1f('Ns',data[0])

          }
          this.shader.setUniform4x4f('mWorld',this.scene.scene.children[objectIndex].modelMatrix);
           this.shader.setUniform4x4f('mView',this.scene.camera.viewMatrix);
          this.shader.setUniform4x4f('mProj',this.scene.camera.orthoAndProjMatrix);
          
          

      

           this.scene.scene.children[objectIndex].render(this.gl,this.shader,this.app_state.shading)
       }
        
    

    }

}

export default App
