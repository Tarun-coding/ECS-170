'use strict'
//import App from "./app"
// TODO implement these and other potentially missing matrix functions here
// The below functions are just two examples you'll definitely need to implement
// A complete example function is given above

/**
 * Gives the perspective camera projection matrix
 * @returns { Array.<Number> } The perspective camera projection matrix as a list
 */
function perspectiveProjectionMatrix(app,fov,near,far)
{
    //console.log(App.canvas.clentWidth);
    //console.log(app.canvas.clientWidth);
    //var projMatrix=new Float32Array(16);
    var out=mat4.create();

    // mat4.perspective(projMatrix,glMatrix.glMatrix.toRadian(fov),app.canvas.clientWidth/app.canvas.clientHeight,0.1,10000.0)

    var aspect=app.canvas.width/app.canvas.height;
    
    var f = 1.0 / Math.tan(glMatrix.glMatrix.toRadian(fov) / 2),
    nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
  

    return out;

}

/**
 * Gives the orthographic camera projection matrix
 * @returns { Array.<Number> } The orthographic camera projection matrix as a list
 */
function orthographicProjectionMatrix(app,near,far)
{
    var left=-20;
    var right=20
    var top=-10;
    var bottom=10

    var out=mat4.create();

    var lr = 1 / (left - right),
    bt = 1 / (bottom - top),
    nf = 1 / (near - far);
out[0] = -2 * lr;
out[1] = 0;
out[2] = 0;
out[3] = 0;
out[4] = 0;
out[5] = -2 * bt;
out[6] = 0;
out[7] = 0;
out[8] = 0;
out[9] = 0;
out[10] = 2 * nf;
out[11] = 0;
out[12] = (left + right) * lr;
out[13] = (top + bottom) * bt;
out[14] = (far + near) * nf;
out[15] = 1;
    return out

}

export
{
    perspectiveProjectionMatrix,
    orthographicProjectionMatrix
}
