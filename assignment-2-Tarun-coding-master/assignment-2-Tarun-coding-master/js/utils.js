'use strict'

import SceneNode from "./scenenode.js"
import ObjectNode from "./object.js"
import { PerspectiveCamera } from "./camera.js"
import { OrthographicCamera } from "./camera.js"
import {directionalLight, Light, pointLight} from "./light.js"

/**
 * Clamps a number between two numbers
 * @param { Number } number The number to clamp
 * @param { Number } min The minimum used for clamping
 * @param { Number } max The maximum used for clamping
 * @returns { Number } The clamped number
 */
function clamp( number, min, max )
{

    return Math.max( min, Math.min( number, max ) )

}

/**
 * Converts degrees to radians
 * @param { Number } deg The number in degrees
 * @returns { Number }The angle in radians
 */
function deg2rad( deg )
{

    return ( deg * Math.PI ) / 180

}

/**
 * Converts a hex color string to a normalized rgba array
 * @param { String } hex The hex color as a string
 * @returns { Array<number> } The color as normalized values
 */
function hex2rgb( hex )
{

    let rgb = hex.match( /\w\w/g )
        .map( x => parseInt( x, 16 ) / 255 )
    return vec3.fromValues( rgb[ 0 ], rgb[ 1 ], rgb[ 2 ] )

}

/**
 * Returns the mouse coordinates relative to a clicking target, in our case the canvas
 * @param event The mouse click event
 * @returns { { x: number, y: number } } The x and y coordinates relative to the canvas
 */
 function getRelativeMousePosition( event )
 {
 
     let target = event.target
 
     // if the mouse is not over the canvas, return invalid values
     if ( target.id != 'canvas' )
     {
 
         return {
 
             x: -Infinity,
             y: +Infinity,
 
         }
 
     }
 
     target = target || event.target;
     let rect = target.getBoundingClientRect( );
 
     return {
 
         x: event.clientX - rect.left,
         y: event.clientY - rect.top,
 
     }
 
 }

/**
 * Loads a given URL; this is used to load the shaders from file
 * @param { String } url The relative url to the file to be loaded
 * @returns { String | null } The external file as text
 */
function loadExternalFile( url )
{

    let req = new XMLHttpRequest( )
    req.open( "GET", url, false )
    req.send( null )
    return ( req.status == 200 ) ? req.responseText : null

}

/**
 * Loads a given .obj file and builds an object from it with vertices, colors and normals
 * @param { String } url The url to the file
 * @param { Array.<Number> } fallback_color A default color to use if the OBJ does not define vertex colors
 * @returns { Array.<Number> } The complete, interleaved vertex buffer object containing vertices, colors and normals
 */
function loadObjFile( url, fallback_color )
{

    let raw = loadExternalFile( url )

    let vertices = [ ]
    let colors = [ ]
    let normals = [ ]
    let textureCoordinates=[ ] //UV coordinates
    //the ids are associated with f
    let vertex_ids = [ ]
    let normal_ids = [ ]
    let texture_ids =[ ] 
    

    for ( let line of raw.split( '\n' ) )
    {

        switch ( line.split( ' ' )[ 0 ] )
        {

            case 'v':
                parseObjVertex( line, vertices )
                parseObjColor( line, colors, fallback_color )
                break
            case 'vt':
                parseObjTextureCoordinate(line,textureCoordinates)
                break
            case 'vn':
                parseObjNormal( line, normals )
                break
            
            case 'f':
                parseObjIds( line, vertex_ids, normal_ids,texture_ids )

        }
    }

    
    let data = [ ]
    let tangents=[]
    let biTangents=[]
    let tangentsBitangentsArray=[]
    let newVertices=[]
    let newUvs=[]
    //first I need the vertices and Uvs in the perfect order
    for(let i=0;i<vertex_ids.length;i++){
        const vid = ( vertex_ids[ i ] * 3 )
        const tid=(texture_ids[ i ] * 2)
        newVertices.push(vertices[ vid ], vertices[ vid + 1 ], vertices[ vid + 2 ])
        newUvs.push(textureCoordinates[tid],textureCoordinates[tid+1])
    }
    tangentsBitangentsArray=calculateTangentSpace(newVertices,newUvs) //this should spit the tangents and biTangents
    //console.log(tangentsBitangentsArray.length)
    tangents=tangentsBitangentsArray[0]
    biTangents=tangentsBitangentsArray[1]
    //after computing the tangents and bitangents, my tangentIndex will be: 
    //tangentIndex=i*3 data.push(tangents[tangentIndex],tangents[tangentIndex+1],tangents[tangentIndex+2])
    for ( let i = 0; i < vertex_ids.length; i++ )
    {

        //Question: why do you multiply by 3? simple: since vertices contains x,y,z coordinates as seperate elements
        //by multiplying by 3 we are simply skipping the y and z coordinates and are going to the x coordinate of the vertex we desire!!


       const vid = ( vertex_ids[ i ] * 3 )
       //console.log(vid)
       const nid = ( normal_ids[ i ] * 3 )
        const tid=(texture_ids[ i ] * 2)
        const tangentBitangentid=i*3
        
        data.push( vertices[ vid ], vertices[ vid + 1 ], vertices[ vid + 2 ] )

        data.push( colors[ vid ], colors[ vid + 1 ], colors[ vid + 2 ] )
        data.push( normals[ nid ], normals[ nid + 1 ], normals[ nid + 2 ] )
        data.push(textureCoordinates[tid],textureCoordinates[tid+1])

        //this should place the tangents and biTangents at the end of vbo_data
        data.push(tangents[tangentBitangentid],tangents[tangentBitangentid+1],tangents[tangentBitangentid+2]) 
        data.push(biTangents[tangentBitangentid],biTangents[tangentBitangentid+1],biTangents[tangentBitangentid+2])
      // console.log(textureCoordinates[tid],textureCoordinates[tid+1])


    }

    return data

}


function calculateTangentSpace(vertices, uvs) {

    let tangents = []
    let bitangents = []
    
    for (let i = 0; i < vertices.length/3; i += 3) {
      let idxv = i*3
      let idxuv = i*2
      
      let v0 = vec3.fromValues(vertices[idxv], vertices[idxv+1], vertices[idxv+2])
      let v1 = vec3.fromValues(vertices[idxv+3], vertices[idxv+4], vertices[idxv+5])
      let v2 = vec3.fromValues(vertices[idxv+6], vertices[idxv+7], vertices[idxv+8])
      //console.log("V", v0, v1, v2)
  
      let uv0 = vec2.fromValues(uvs[idxuv], uvs[idxuv+1])
      let uv1 = vec2.fromValues(uvs[idxuv+2], uvs[idxuv+3])
      let uv2 = vec2.fromValues(uvs[idxuv+4], uvs[idxuv+5])
      //console.log("UV", uv0, uv1, uv2)
  
      let dv1 = vec3.sub(vec3.create(), v1, v0);
      let dv2 = vec3.sub(vec3.create(), v2, v0);
      //console.log("DV", dv1, dv2)
  
      let duv1 = vec2.sub(vec3.create(), uv1, uv0);
      let duv2 = vec2.sub(vec3.create(), uv2, uv0);
      //console.log("DUV", duv1, duv2)
  
      let r = 1.0 / (duv1[0] * duv2[1] - duv1[1] * duv2[0])
      //console.log("R", r)
      let tangent = vec3.scale(vec3.create(), 
                                    vec3.sub(vec3.create(), 
                                       vec3.scale(vec3.create(), dv1, duv2[1]),
                                       vec3.scale(vec3.create(), dv2, duv1[1]), 
                                    ), r)
      //console.log("TAN", tangent)
      
      let bitangent = vec3.scale(vec3.create(), 
                                    vec3.sub(vec3.create(), 
                                       vec3.scale(vec3.create(), dv2, duv1[0]),
                                       vec3.scale(vec3.create(), dv1, duv2[0]), 
                                    ), r)
  
      //console.log("BITAN", bitangent)
  
      for (let j = 0; j < 3; j++) {
        tangents.push(tangent[0])
        tangents.push(tangent[1])
        tangents.push(tangent[2])
        bitangents.push(bitangent[0])
        bitangents.push(bitangent[1])
        bitangents.push(bitangent[2])
      }
    }
  
    return [tangents, bitangents]
  }

  
function loadMtlFile(url){
    let raw=loadExternalFile(url)
    let data=[] //returned in the format of Ns,ka,kd,ks
    for ( let line of raw.split( '\n' ) )
    {
        switch ( line.split( ' ' )[ 0 ] )
        {

            case 'Ka':
                //console.log(line)
                let kaElements=line.split(' ')
                data.push((parseFloat(kaElements[1])+parseFloat(kaElements[2])+parseFloat(kaElements[3]))/3)
                //console.log(data)
                break
            case 'Kd':
               // console.log(line)
                let kdElements=line.split(' ')
                data.push((parseFloat(kdElements[1])+parseFloat(kdElements[2])+parseFloat(kdElements[3]))/3)
                //console.log(data)
                break
            case 'Ks':
                let ksElements=line.split(' ')
                data.push((parseFloat(ksElements[1])+parseFloat(ksElements[2])+parseFloat(ksElements[3]))/3)
               // console.log((parseFloat(ksElements[1])+parseFloat(ksElements[2])+parseFloat(ksElements[3]))/3)
            case 'Ns':
                let NsElements=line.split(' ');
                data.push(parseFloat(NsElements[1]))
                        
        }   
     }
     return data;

    
}


/**
 * Parses a given object vertex entry line
 * @param { String } entry A line of an object vertex entry
 * @param { Array.<Number> } list The list to write the parsed vertex coordinates to
 */
function parseObjVertex( entry, list )
{

    const elements = entry.split( ' ' )
    if ( elements.length < 4 )
        alert( "Unknown vertex entry " + entry )

    list.push( parseFloat( elements[ 1 ] ), parseFloat( elements[ 2 ] ), parseFloat( elements[ 3 ] ) )

}
function parseObjTextureCoordinate(entry,list)
{
    const elements=entry.split(' ')
    list.push( parseFloat( elements[1]), parseFloat( elements[2] ) ) 
}

/**
 * Parses a given object color entry line
 * @param { String } entry A line of an object color entry
 * @param { Array.<Number> } list The list to write the parsed vertex colors to
 * @param { Array.<Number> } fallback_color A fallback color in case the OBJ does not define vertex colors
 */
function parseObjColor( entry, list, fallback_color )
{

    const elements = entry.split( ' ' )
    if ( elements.length < 7 )
    {

        list.push( fallback_color[ 0 ], fallback_color[ 1 ], fallback_color[ 2 ] )
        return

    }

    list.push( parseFloat( elements[ 4 ] ), parseFloat( elements[ 5 ] ), parseFloat( elements[ 6 ] ) )

}

/**
 * Parses a given object normal entry line
 * @param { String } entry A line of an object normal entry
 * @param { Array.<Number> } list The list to write the parsed vertex normals to
 */
function parseObjNormal( entry, list )
{

    const elements = entry.split( ' ' )
    if ( elements.length != 4 )
        alert( "Unknown normals entry " + entry )

    list.push( parseFloat( elements[ 1 ] ), parseFloat( elements[ 2 ] ), parseFloat( elements[ 3 ] ) )

}

/**
 * Parses a given object ids entry line
 * @param { String } entry A line of an object ids entry
 * @param { Array.<Number> } vertex_ids The list of vertex ids to write to
 * @param { Array.<Number> } normal_ids The list normal ids to write to
 */
function parseObjIds( entry, vertex_ids, normal_ids,texture_ids )
{

    const elements = entry.split( ' ' )
    if ( elements.length != 4 )
        alert( "Unknown face entry " + entry )

    for ( let element of elements )
    {

        if ( element == 'f' )
            continue

        const subelements = element.split( '/' )

        vertex_ids.push( parseInt( subelements[ 0 ] ) - 1 )
        normal_ids.push( parseInt( subelements[ 2 ] ) - 1 )
        texture_ids.push(parseInt( subelements[ 1 ] ) - 1)

    }

}

/**
 * Loads a scene file and triggers the appropriate parsing functions
 * @param { String } url The url to the scene file
 * @returns An object containing information about the camera, the light and the scene
 */
function loadSceneFile( url )
{

    let raw = loadExternalFile( url )

    let scene_description = JSON.parse( raw )

    return {

        "camera": parseCamera( scene_description[ "camera" ] ),
        "scene": parseSceneNode( scene_description[ "root" ], null ),
        "light": parseLight(scene_description["light"])
        

    }
}


/**
 * Parses a given camera entry
 * @param { TODO } entry An entry containing information on a single camera
 * @returns A camera instance with the camera read from the scene file
 */
function parseCamera( entry )
{

    let camera = null

    let position = vec3.fromValues( entry.position[ 0 ], entry.position[ 1 ], entry.position[ 2 ] )
    let lookat = vec3.fromValues( entry.lookat[ 0 ], entry.lookat[ 1 ], entry.lookat[ 2 ] )
    let up = vec3.fromValues( entry.up[ 0 ], entry.up[ 1 ], entry.up[ 2 ] )
    let fov = entry.fov

    if ( entry.type == "perspective" )
    {

        // TODO create a perspective camera here
        camera = new PerspectiveCamera(position,lookat,up,fov)
        

    }
    else if ( entry.type == "orthographic" )
    {
        camera = new OrthographicCamera()
        // TODO create an orthographic camera here

    }

    return camera

}
function parseLight(entry){
    let light=null;
    if(entry.type=="light"){
        light=new Light(entry.name,"",entry.ambient);
        
        for (let directionalLight of entry.directionalLights ){
            light.directionalLights.push( parseLight(directionalLight) )
        }
        for (let pointLight of entry.pointLights ){
             light.pointLights.push( parseLight(pointLight) ) 
        }         
    }else if(entry.type=="directionalLight"){
        light=new directionalLight(entry.name,entry.position,entry.color);
    }else if(entry.type=="pointLight"){
        light= new pointLight(entry.name,entry.position,entry.color,entry.attenuationConstant,entry.attenuationLinear,entry.attenuationQuadratic);
    }
    return light;
}


/**
 *  Recursively parses a SceneNode and its children
 * @param { Object } entry An entry from the JSON config representing a SceneNode
 * @param { Object | null } parent The parent node of the current SceneNode
 * @returns { SceneNode } The parsed SceneNode object
 */
function parseSceneNode( entry, parent )
{

    let node = null

    let name = entry.name
    let translation = vec3.fromValues( entry.translation[ 0 ], entry.translation[ 1 ], entry.translation[ 2 ] )
    let rotation = vec3.fromValues( entry.rotation[ 0 ], entry.rotation[ 1 ], entry.rotation[ 2 ] )
    let scale = vec3.fromValues( entry.scale[ 0 ], entry.scale[ 1 ], entry.scale[ 2 ] )

    if ( entry.type == 'node' )
    {
        node = new SceneNode( name, parent, translation, rotation, scale )

    }
    else if ( entry.type == 'object' )
    {

        const fallback_color = hex2rgb( entry.color )
        const obj_content = loadObjFile( entry.obj, fallback_color )

        node = new ObjectNode( obj_content, name, parent, translation, rotation, scale )

    }

    for ( let child of entry.children )
        node.children.push( parseSceneNode( child, node ) )

    return node

}


export
{

    clamp,
    deg2rad,
    hex2rgb,
    getRelativeMousePosition,
    loadExternalFile,
    loadObjFile,
    loadSceneFile,
    loadMtlFile

}
