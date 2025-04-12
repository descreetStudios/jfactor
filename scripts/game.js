// Function to create an image at a specified position
export function createImageAtPosition(src, x, y) {
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '40px';
    img.style.height = '40px';
    img.style.position = 'absolute';
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    document.body.appendChild(img);
}

// Random number generator (for dice roll)
export function numGen(min, max) {
    return Math.floor(Math.random() * max) + min;
}

export function movePlayer(spiral, numGen, createImageAtPosition, pieceImg, refs) {
    const die1 = numGen(1, 6);
    const die2 = numGen(1, 6);
    const movement = die1 + die2;

    alert("Movement: " + movement);

    for (let i = 0; i < movement; i++) {
        const element = refs['cell' + i][0]; // Prendo il primo elemento soltanto dato che 
        if (element) {
            console.log(element);
            const rect = element.getBoundingClientRect();
            console.log(`Posizione dell'elemento ${i}:`, {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });

            createImageAtPosition(pieceImg, rect.left, rect.top); // Using the imported function
        } else {
            console.log(`Elemento non trovato per index: ${i}`);
        }
    }
}