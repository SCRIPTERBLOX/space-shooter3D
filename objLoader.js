// objLoader.js

function loadOBJ(url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const vertices = [];
            const vertexIndices = [];
            const lines = data.split('\n');

            lines.forEach(line => {
                const parts = line.trim().split(' ');
                if (parts[0] === 'v') {
                    // Vertex position
                    vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                } else if (parts[0] === 'f') {
                    // Face indices (assuming triangulated faces)
                    vertexIndices.push(parseInt(parts[1]) - 1, parseInt(parts[2]) - 1, parseInt(parts[3]) - 1);
                }
            });

            callback(vertices, vertexIndices);
        });
}