window.onload = function () {
    const canvas = document.getElementById('webgl-canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported!');
        return;
    }

    // Set the canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Clear canvas with a color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Define vertex shader source
    const vertexShaderSource = `
        attribute vec3 a_Position;
        uniform mat4 u_ModelMatrix;
        void main() {
            gl_Position = u_ModelMatrix * vec4(a_Position, 1.0);
        }
    `;

    // Define fragment shader source
    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
        }
    `;

    // Create shaders
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create and link the program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

    // Load and render the OBJ file
    loadOBJ('Models/Enemys/cube.obj', (vertices, vertexIndices) => {
        // Create buffer for vertex positions
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Get the attribute location and enable it
        const aPosition = gl.getAttribLocation(program, 'a_Position');
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);

        // Create buffer for indices
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

        // Get the location of the uniform u_ModelMatrix
        const uModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');

        // Create the model matrix (4x4)
        const modelMatrix = mat4.create();  // Creates an identity matrix

        // Apply transformations (e.g., translation)
        mat4.translate(modelMatrix, modelMatrix, [0.5, 0.0, 0.0]);  // Move right by 0.5 units
        mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5]);      // Scale by half
        // You can also apply rotation like: mat4.rotate(modelMatrix, modelMatrix, angleInRadians, [axisX, axisY, axisZ]);

        // Pass the model matrix to the vertex shader
        gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

        // Clear and draw the model
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0);
    });
};