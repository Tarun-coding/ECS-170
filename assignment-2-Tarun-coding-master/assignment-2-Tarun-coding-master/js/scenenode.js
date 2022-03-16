'use strict'

class SceneNode
{

    constructor( name, parent, translation = vec3.create( ), rotation = vec3.create( ), scale = vec3.fromValues( 1, 1, 1 ) )
    {
        rotation[0]=glMatrix.glMatrix.toRadian(rotation[0])
        rotation[1]=glMatrix.glMatrix.toRadian(rotation[1])
        rotation[2]=glMatrix.glMatrix.toRadian(rotation[2])

        this.type = "node"
        this.name = name
        this.translation = translation
        this.rotation = rotation
        this.scale = scale

        
        // TODO Create the transformation matrix for this node based on the translation, rotation, and scale you got
        this.modelMatrix=mat4.create();
        //console.log(this.modelMatrix)
        //this.origin=vec3.fromValues(0,1,0)

        mat4.fromRotationTranslationScale(this.modelMatrix,vec4.create(this.rotation,1.0),this.translation,this.scale)

        this.parent = parent
        this.children = [ ]
       // console.log(name)

    }

    /**
     * Performs any updates if necessary
     */
    update( )
    {

        // TODO Make any updates to your node here (e.g., change transformation)

    }

    /**
     * Gives the transform of this node
     * @returns The transformation of this node
     */
    getTransform( )
    {

        // TODO Return the transformation describing the object -> world transformation for this node

        return

    }

    /**
     * Renders this node; Note that by default scene note does not render as it has no context
     * @param { WebGL2RenderingContext } gl The WebGL2 rendering context for this app
     * @param { Shader } shader The shader to use for rendering
     */
    render( gl, shader,viewMatrix, projMatrix)
    {

       // return
       for(var objectIndex=0; objectIndex<this.children.length;objectIndex++){

           this.children[objectIndex].render(gl,shader,viewMatrix,projMatrix)
       }


    }

}

export default SceneNode
