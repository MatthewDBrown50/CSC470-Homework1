const canvas = document.querySelector('#c');
const gl = canvas.getContext('webgl');

const vertexShaderSource = `
    attribute vec2 aPosition;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;

    void main() {
        gl_FragColor = uColor;
    }
`;

function getSquareVertices(center, diameter) {
    return [
        center[0] - diameter / 2, center[1] + diameter / 2,
        center[0] + diameter / 2, center[1] + diameter / 2,
        center[0] - diameter / 2, center[1] - diameter / 2,
        center[0] + diameter / 2, center[1] - diameter / 2,
        center[0] - diameter / 2, center[1] - diameter / 2,
        center[0] + diameter / 2, center[1] + diameter / 2,
    ];
}

function drawSierpinski(center, diameter, steps) {
    if (steps === 0) {
        return getSquareVertices(center, diameter);
    }

    const newDiameter = diameter / 3;
    const newCenters = [
        [center[0] - newDiameter, center[1] + newDiameter],
        [center[0], center[1] + newDiameter],
        [center[0] + newDiameter, center[1] + newDiameter],
        [center[0] - newDiameter, center[1]],
        [center[0] + newDiameter, center[1]],
        [center[0] - newDiameter, center[1] - newDiameter],
        [center[0], center[1] - newDiameter],
        [center[0] + newDiameter, center[1] - newDiameter]
    ];

    let vertices = [];
    for (const newCenter of newCenters) {
        vertices = vertices.concat(drawSierpinski(newCenter, newDiameter, steps - 1));
    }

    return vertices;
}

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

gl.useProgram(shaderProgram);

const initialSquareLength = 2.0;
const initialSquareCenter = [0, 0];
const numberOfSteps = 5; // Manipulate this to adjust the number of steps in the carpet
const vertices = drawSierpinski(initialSquareCenter, initialSquareLength, numberOfSteps);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Add vertices to draw
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const aPositionLocation = gl.getAttribLocation(shaderProgram, 'aPosition');
gl.enableVertexAttribArray(aPositionLocation);
gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

// Set color for all vertices to share
const uColorLocation = gl.getUniformLocation(shaderProgram, 'uColor');
gl.uniform4fv(uColorLocation, [0.2, 0.6, 0.9, 1.0]); 

gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
