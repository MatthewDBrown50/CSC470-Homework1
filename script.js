
function getSquareVertices(center, diameter){
    return [
        center[0] - diameter/2, center[1] + diameter/2,
        center[0] + diameter/2, center[1] - diameter/2,
        center[0] + diameter/2, center[1] + diameter/2,
        center[0] - diameter/2, center[1] + diameter/2,
        center[0] - diameter/2, center[1] - diameter/2,
        center[0] + diameter/2, center[1] - diameter/2
    ]    
}

function getNewCenters(originalCenter, originalDiameter){
    let newCenters = [
        originalCenter[0] - originalDiameter, originalCenter[1] + originalDiameter,
        originalCenter[0], originalCenter[1] + originalDiameter,
        originalCenter[0] + originalDiameter, originalCenter[1] + originalDiameter,
        originalCenter[0] - originalDiameter, originalCenter[1],
        originalCenter[0] + originalDiameter, originalCenter[1],
        originalCenter[0] - originalDiameter, originalCenter[1] - originalDiameter,
        originalCenter[0], originalCenter[1] - originalDiameter,
        originalCenter[0] + originalDiameter, originalCenter[1] - originalDiameter,
    ]

    return newCenters;
}

const canvas = document.querySelector('#c');
const gl = canvas.getContext('webgl');

const vertexShaderSource = `
    attribute vec2 aPosition;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
    `
;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;

    void main() {
      gl_FragColor = uColor;
    }
    `
;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram)

gl.useProgram(shaderProgram);

const squaresDiameter1 = 0.667;
const squareCenters1 = [0, 0];
let vertices = getSquareVertices(squareCenters1, squaresDiameter1);

const squaresDiameter2 = squaresDiameter1 / 3;
const squareCenters2 = getNewCenters(squareCenters1, squaresDiameter1);
for(let i = 0; i < squareCenters2.length; i += 2){
    const tempCenter = [squareCenters2[i], squareCenters2[i + 1]];
    vertices = vertices.concat(getSquareVertices(tempCenter, squaresDiameter2))
}

const squaresDiameter3 = squaresDiameter2 / 3;
let squareCenters3 = [];
for(let i = 0; i < squareCenters2.length; i += 2){
    const tempCenter = [squareCenters2[i], squareCenters2[i + 1]];
    squareCenters3 = squareCenters3.concat(getNewCenters(tempCenter, squaresDiameter2));
}
for(let i = 0; i < squareCenters3.length; i += 2){
    const tempCenter = [squareCenters3[i], squareCenters3[i + 1]];
    vertices = vertices.concat(getSquareVertices(tempCenter, squaresDiameter3))
}

const squaresDiameter4 = squaresDiameter3 / 3;
let squareCenters4 = [];
for(let i = 0; i < squareCenters3.length; i += 2){
    const tempCenter = [squareCenters3[i], squareCenters3[i + 1]];
    squareCenters4 = squareCenters4.concat(getNewCenters(tempCenter, squaresDiameter3));
}
for(let i = 0; i < squareCenters4.length; i += 2){
    const tempCenter = [squareCenters4[i], squareCenters4[i + 1]];
    vertices = vertices.concat(getSquareVertices(tempCenter, squaresDiameter4))
}


gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// add vertices to draw
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const aPositionLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
gl.enableVertexAttribArray(aPositionLocation);
gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

// set color for all vertices to share
const uColorLocation = gl.getUniformLocation(shaderProgram, 'uColor');
gl.uniform4fv(uColorLocation, [0.2, 0.6, 0.9, 1.0]); // red color

gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

