'use strict'

import { orthographicProjectionMatrix, perspectiveProjectionMatrix } from "./matrix.js";
import SceneNode from "./scenenode.js"

class Camera extends SceneNode
{

    // TODO implement a camera base class

    constructor(position, lookat,up,fov)
    {
        
        
        super( )
        this.position=position;
        
        
        this.lookat=lookat;
        this.up=up;
        this.fov=fov;
        this.viewMatrix=new Float32Array(16);
	    this.orthoAndProjMatrix=new Float32Array(16);
        
       // console.log("hi")
       this.Xangle=0
       this.Yangle=0
       this.distanceFromCenterX=this.position[2]
       this.distanceFromCenterY=this.position[2]
       mat4.lookAt(this.viewMatrix,this.position,this.lookat,this.up);


    }

    update(dy,conditionNumber)
    {

        super.update()
        //for zooming
        
            if(conditionNumber==2){
                    if(dy>0){
                        if(this.position[0]>0){
                            this.position[0]=this.position[0]-dy
                        }else if(this.position[0]<0){
                            this.position[0]=this.position[0]+dy
                        }
                        
                        if(this.position[1]>0){
                            this.position[1]=this.position[1]-dy
                        }else if(this.position[1]<0){
                            this.position[1]=this.position[1]+dy
                        }
                        if(this.position[2]>1){
                            this.position[2]=this.position[1]-dy
                        }else if(this.position[2]<0){
                            this.position[2]=this.position[2]+dy
                        }
                    }else if(dy<0){
                        this.position[2]+=dy
                        this.position[0]+=dy
                        this.position[1]-=dy
                    } 
    }
        //for rotating
        else if(conditionNumber==0){
           
            this.distanceFromCenterX=Math.sqrt(Math.pow(this.position[2]-1,2)+Math.pow(this.position[0],2))
           // console.log(this.distanceFromCenterX)
            if(dy>0){
            this.Xangle+=0.1
            }else if(dy<0){
                this.Xangle-=0.1
            }
            
            this.position[0]=Math.cos(this.Xangle)*(this.distanceFromCenterX);
            this.position[2]=1+Math.sin(this.Xangle)*(this.distanceFromCenterX);
          //  mat4.lookAt(this.viewMatrix,this.position,this.lookat,this.up);
           // console.log(this.angle) 
        

        }else{
            this.distanceFromCenterY=Math.sqrt(Math.pow(this.position[2]-1,2)+Math.pow(this.position[1],2))
            //console.log(this.distanceFromCenterY)
            if(dy>0){
                this.Yangle+=0.2
                }else if(dy<0){
                    this.Yangle-=0.2
                }
            this.position[1]=0+Math.cos(this.Yangle)*(this.distanceFromCenterY);
            this.position[2]=1+Math.sin(this.Yangle)*(this.distanceFromCenterY);
           // console.log(this.Yangle)
          //  mat4.lookAt(this.viewMatrix,this.position,this.lookat,this.up);


        }
        mat4.lookAt(this.viewMatrix,this.position,this.lookat,this.up);


    }

}

class PerspectiveCamera extends Camera
{
    constructor(position,lookat,up,fov){
        super(position,lookat,up,fov)
        //console.log(App.canvas.clientWidth)
       // mat4.perspective(projMatrix,glMatrix.glMatrix.toRadian(this.fov),this.canvas.clientWidth/this.canvas.clientHeight,0.1,10000.0)
        //this.projMatrix=

    }
     perspectiveProjection(app){
        this.orthoAndProjMatrix=perspectiveProjectionMatrix(app,this.fov,0.1,10000)
    }
    orthogonalProjection(app){
        this.orthoAndProjMatrix=orthographicProjectionMatrix(app,0.1,10000)
    }
    //super(position,lookat,up,fov);
    // TODO implement a perspective camera

}

class OrthographicCamera extends Camera
{
    constructor(position,lookat,up,fov){
        super(position,lookat,up,fov)
    }
        orthogonalProjection(app){
            this.orthoAndProjMatrix=orthographicProjectionMatrix(app)
        }
        perspectiveProjection(app){
            this.orthoAndProjMatrix=perspectiveProjectionMatrix(app,this.fov,0.1,10000)
        }
}
    // TODO implement an orthographic camera



class FpsCamera extends Camera
{

    // TODO implement an fps camera
    // THIS MODE IS OPTIONAL

}

export
{

    PerspectiveCamera,
    OrthographicCamera,
    FpsCamera

}
