
function getSquareVertices(center, diameter){
    console.log([
        center[0] - diameter/2, center[1] + diameter/2,
        center[0] + diameter/2, center[1] - diameter/2,
        center[0] + diameter/2, center[1] + diameter/2,
        center[0] - diameter/2, center[1] + diameter/2,
        center[0] - diameter/2, center[1] - diameter/2,
        center[0] + diameter/2, center[1] - diameter/2
    ])
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
    return [
        originalCenter[0] - originalDiameter, originalCenter[1] + originalDiameter,
        originalCenter[0], originalCenter[1] + originalDiameter,
        originalCenter[0] + originalDiameter, originalCenter[1] + originalDiameter,
        originalCenter[0] - originalDiameter, originalCenter[1],
        originalCenter[0] + originalDiameter, originalCenter[1],
        originalCenter[0] - originalDiameter, originalCenter[1] - originalDiameter,
        originalCenter[0], originalCenter[1] - originalDiameter,
        originalCenter[0] + originalDiameter, originalCenter[1] - originalDiameter,
    ]
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

for(i = 0; i < squareCenters2.length; i+=2){
    let center = [squareCenters2[i], squareCenters2[i+1]];
    let vertices2 = getSquareVertices(center, squaresDiameter2);
    vertices = vertices.concat(vertices2);
    console.log(vertices)
}

console.log(vertices);

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

