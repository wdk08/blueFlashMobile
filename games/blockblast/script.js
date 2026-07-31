const gridElement = document.getElementById('grid');
const shapeSelectionElement = document.getElementById('shape-selection');
const resetButton = document.getElementById('reset');
const endScreen = document.getElementById('end-screen');
const endMessage = document.getElementById('end-message');
const restartButton = document.getElementById('restart');
const scoreDisplay = document.getElementById('score');


const allShapes = [
    // 2x2 Square (basic)
    { shape: [[1, 1], [1, 1]], name: 'Square 2x2', id: 'Square-0', color: 'cyan' },

    // 3x3 Square (full square)
    { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], name: 'Square 3x3', id: 'Square-1', color: 'yellow' },

    // 4-block Line (horizontal)
    { shape: [[1, 1, 1, 1]], name: 'Line 4', id: 'Line-0', color: 'chartreuse' },

// 5-block Line (horizontal)
{ shape: [[1, 1, 1, 1, 1]], name: 'Line 5', id: 'Line-1', color: 'rgb(170, 50, 255)' },

    // 4-block Line (vertical)
    { shape: [[1], [1], [1], [1]], name: 'Line 4 (Vertical)', id: 'Line-2', color: 'magenta' },

    // 5-block Line (vertical)
    { shape: [[1], [1], [1], [1], [1]], name: 'Line 5 (Vertical)', id: 'Line-3', color: 'fuchsia' },

    // L-shape (rotated variations)
    { shape: [[1, 1, 0], [1, 1, 1]], name: 'L-shape', id: 'L-0', color: 'tomato' },
    { shape: [[1, 0], [1, 0], [1, 1]], name: 'L-shape rotated 90', id: 'L-1', color: 'limegreen' },
    { shape: [[1, 1], [0, 1], [0, 1]], name: 'L-shape rotated 180', id: 'L-2', color: 'orange' },
    { shape: [[0, 1], [0, 1], [1, 1]], name: 'L-shape rotated 270', id: 'L-3', color: 'dodgerblue' },

    // J-shape (rotated variations)
    { shape: [[1, 1, 1], [1, 0, 0]], name: 'J-shape', id: 'J-0', color: 'blue' },
    { shape: [[0, 1], [0, 1], [1, 1]], name: 'J-shape rotated 90', id: 'J-1', color: 'green' },
    { shape: [[0, 0, 1], [1, 1, 1]], name: 'J-shape rotated 180', id: 'J-2', color: 'purple' },
    { shape: [[1, 1], [1, 0], [1, 0]], name: 'J-shape rotated 270', id: 'J-3', color: 'red' },

    // T-shape (rotated variations)
    { shape: [[1, 1, 1], [0, 1, 0]], name: 'T-shape', id: 'T-0', color: 'violet' },
    { shape: [[0, 1], [1, 1], [0, 1]], name: 'T-shape rotated 90', id: 'T-1', color: 'turquoise' },
    { shape: [[0, 1, 0], [1, 1, 1]], name: 'T-shape rotated 180', id: 'T-2', color: 'plum' },
    { shape: [[1, 0], [1, 1], [1, 0]], name: 'T-shape rotated 270', id: 'T-3', color: 'pink' },

    // Z-shape (rotated variations)
    { shape: [[1, 1, 0], [0, 1, 1]], name: 'Z-shape', id: 'Z-0', color: 'springgreen' },
    { shape: [[0, 1], [1, 1], [1, 0]], name: 'Z-shape rotated 90', id: 'Z-1', color: 'crimson' },
    { shape: [[1, 1], [0, 1], [0, 1]], name: 'Z-shape rotated 180', id: 'Z-2', color: 'orchid' },
    { shape: [[0, 1], [1, 1], [1, 0]], name: 'Z-shape rotated 270', id: 'Z-3', color: 'yellowgreen' },

    // S-shape (rotated variations)
    { shape: [[0, 1, 1], [1, 1, 0]], name: 'S-shape', id: 'S-0', color: 'seagreen' },
    { shape: [[1, 1], [0, 1], [0, 1]], name: 'S-shape rotated 90', id: 'S-1', color: 'skyblue' },
    { shape: [[1, 1], [1, 0], [1, 0]], name: 'S-shape rotated 180', id: 'S-2', color: 'mediumvioletred' },
    { shape: [[0, 1], [1, 1], [1, 0]], name: 'S-shape rotated 270', id: 'S-3', color: 'deepskyblue' },

    // I-shape (4 blocks)
    { shape: [[1, 1, 1, 1]], name: 'I-shape', id: 'I-0', color: 'red' },
    { shape: [[1], [1], [1], [1]], name: 'I-shape rotated', id: 'I-1', color: 'lime' },

    // Custom small 2x3 variations
    { shape: [[1, 1, 0], [1, 1, 1]], name: 'Tetris 2x3 (Variation 1)', id: '2x3-0', color: 'gold' },
    { shape: [[1, 0, 1], [1, 1, 1]], name: 'Tetris 2x3 (Variation 2)', id: '2x3-1', color: 'mediumorchid' },
    { shape: [[0, 1, 1], [1, 1, 1]], name: 'Tetris 2x3 (Variation 3)', id: '2x3-2', color: 'orangered' },

    // New custom shapes

    // W-shape (custom)
    { shape: [[1, 0, 1], [0, 1, 1]], name: 'W-shape', id: 'W-0', color: 'aqua' },
    { shape: [[0, 1], [1, 1], [1, 0]], name: 'W-shape rotated', id: 'W-1', color: 'orchid' },

    // H-shape (custom)
    { shape: [[1, 1, 0], [1, 1, 0], [1, 1, 0]], name: 'H-shape', id: 'H-0', color: 'hotpink' },
    { shape: [[1, 0], [1, 1], [1, 0]], name: 'H-shape rotated', id: 'H-1', color: 'yellow' },

    // Pyramid shape
    { shape: [[1, 0, 0], [1, 1, 0], [1, 1, 1]], name: 'Pyramid-shape', id: 'Pyramid-0', color: 'darkorange' },

    // Cross shape (X-shape)
    { shape: [[1, 1, 1], [1, 1, 1]], name: 'Cross-shape', id: 'Cross-0', color: 'darkviolet' },
    { shape: [[1, 0], [1, 1], [0, 1]], name: 'Cross-shape rotated', id: 'Cross-1', color: 'indianred' },

 

    // Diamond shape
    { shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], name: 'Diamond-shape', id: 'Diamond-0', color: 'fuchsia' }
];






let grid = Array(8).fill(null).map(() => Array(8).fill(0));
let selectedShape = null;
let selectedColor = '';
let score = 0;
let gameActive = true;
let availableShapes = [];

// Create the grid
function createGrid() {
    gridElement.innerHTML = '';
    grid.forEach(row => {
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            if (cell && cell.color) {
                cellElement.style.backgroundColor = cell.color;
            }
            gridElement.appendChild(cellElement);
        });
    });
}

// Render available shapes
function renderShapes() {
    shapeSelectionElement.innerHTML = '';
    availableShapes.forEach(({ shape, color }) => {
        const shapeElement = document.createElement('div');
        shapeElement.className = 'shape';
        shapeElement.addEventListener('click', () => {
            if (gameActive) {
                selectedShape = shape;
                selectedColor = color;
                highlightPreview(0, 0);
            }
        });

        const preview = document.createElement('div');
        preview.className = 'shape-preview';

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const block = document.createElement('div');
                block.className = 'cell';
                if (shape[row] && shape[row][col]) {
                    block.style.backgroundColor = color;
                }
                preview.appendChild(block);
            }
        }

        shapeElement.appendChild(preview);
        shapeSelectionElement.appendChild(shapeElement);
    });
}

// Get random shapes
function getRandomShapes() {
    const shuffledShapes = allShapes.sort(() => 0.5 - Math.random());
    return shuffledShapes.slice(0, 4); // Get 4 random shapes
}
// Check if a row can be completed with current highlighted cells
function canCompleteRow(row, highlightedCells) {
    const rowCells = grid[row].map((cell, colIndex) => {
        return cell && cell.filled || highlightedCells.includes(row * 8 + colIndex);
    });
    return rowCells.every(cell => cell); // Return true if all cells in the row are filled
}

function highlightPreview(startRow, startCol) {
    // Clear previous highlights
    const previewCells = document.querySelectorAll('.cell.highlight, .temp-highlight');
    previewCells.forEach(cell => cell.classList.remove('highlight', 'temp-highlight'));

    if (selectedShape) {
        let cellsToHighlight = [];
        let filledCellsToHighlight = [];

        // Determine which cells to highlight based on the selected shape
        for (let row = 0; row < selectedShape.length; row++) {
            for (let col = 0; col < selectedShape[row].length; col++) {
                if (selectedShape[row][col]) {
                    const newRow = startRow + row;
                    const newCol = startCol + col;

                    // Ensure we're within bounds
                    if (newRow < 8 && newCol < 8) {
                        const index = newRow * 8 + newCol;
                        cellsToHighlight.push(index); // Track index to highlight

                        // Check if the cell is already filled
                        if (grid[newRow][newCol] && grid[newRow][newCol].filled) {
                            filledCellsToHighlight.push(index); // Track filled cells
                        }
                    }
                }
            }
        }

        // Highlight the preview cells for the shape
        cellsToHighlight.forEach(index => {
            gridElement.children[index].classList.add('highlight');
        });

        // Temporarily highlight filled cells in red
        filledCellsToHighlight.forEach(index => {
            gridElement.children[index].classList.add('temp-highlight');
        });

        // Check if any row is about to be completed
        for (let row = 0; row < 8; row++) {
            if (canCompleteRow(row, cellsToHighlight)) {
                for (let col = 0; col < 8; col++) {
                    const index = row * 8 + col;
                    gridElement.children[index].classList.add('highlight'); // Highlight entire row
                }
            }
        }

        // Check if any column is about to be completed
        for (let col = 0; col < 8; col++) {
            if (canCompleteCol(col, cellsToHighlight)) {
                for (let row = 0; row < 8; row++) {
                    const index = row * 8 + col;
                    gridElement.children[index].classList.add('highlight'); // Highlight entire column
                }
            }
        }
    }
}

// Define the function to check if a column can be completed
function canCompleteCol(col, cellsToHighlight) {
    for (let row = 0; row < 8; row++) {
        const index = row * 8 + col;
        // If the cell is not part of cellsToHighlight and not filled, return false
        if (!cellsToHighlight.includes(index) && !(grid[row][col] && grid[row][col].filled)) {
            return false;
        }
    }
    return true;
}



// Check if shape can be placed
function canPlaceShape(shape, startRow, startCol) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newRow = startRow + row;
                const newCol = startCol + col;
                if (newRow >= 8 || newCol >= 8 || grid[newRow][newCol]) {
                    return false; // Cannot place shape if out of bounds or overlapping
                }
            }
        }
    }
    return true; // Placement is valid
}

// Place the shape in the grid
function placeShape(startRow, startCol) {
    if (selectedShape && canPlaceShape(selectedShape, startRow, startCol)) {
        for (let row = 0; row < selectedShape.length; row++) {
            for (let col = 0; col < selectedShape[row].length; col++) {
                if (selectedShape[row][col]) {
                    grid[startRow + row][startCol + col] = { filled: true, color: selectedColor };
                    const index = (startRow + row) * 8 + (startCol + col);
                    gridElement.children[index].style.backgroundColor = selectedColor;
                }
            }
        }

        score += selectedShape.flat().filter(Boolean).length * 10; // Update score
        scoreDisplay.textContent = `Score: ${score}`;

        // Remove the used shape from available shapes
        availableShapes = availableShapes.filter(shape => shape.color !== selectedColor);
        
        // Refresh shapes to reflect removal
        renderShapes();

        createGrid();
        checkForClears();

        // Check if we need to randomize again
        if (availableShapes.length === 0) {
            availableShapes = getRandomShapes(); // Get new random shapes
            renderShapes(); // Render new shapes
        }

        // Reset selection
        selectedShape = null;
        selectedColor = '';
    } else {
        endGame(); // End game if placement is invalid
    }
}

// Check for cleared rows and columns
// Modify the check for cleared rows and columns
function checkForClears() {
    let clearedRows = new Set();
    let clearedCols = new Set();

    // Check for completed rows
    for (let row = 0; row < 8; row++) {
        if (grid[row].every(cell => cell && cell.filled)) {
            clearedRows.add(row);
        }
    }

    // Check for completed columns
    for (let col = 0; col < 8; col++) {
        if (grid.every(row => row[col] && row[col].filled)) {
            clearedCols.add(col);
        }
    }

    // Only clear rows and columns if there are any completed
    if (clearedRows.size > 0 || clearedCols.size > 0) {
        clearedRows.forEach(row => {
            grid[row] = Array(8).fill(0); // Clear filled row
        });

        clearedCols.forEach(col => {
            for (let row = 0; row < 8; row++) {
                if (grid[row][col]) {
                    grid[row][col] = 0; // Clear filled column
                }
            }
        });

        // Update the score for cleared lines
        let clearedLines = clearedRows.size + clearedCols.size;
        if (clearedLines > 0) {
            score += clearedLines * 100; // Increase score for cleared lines
        }

        // Update the score display
        scoreDisplay.textContent = `Score: ${score}`;

        // Refresh the grid display only once
        createGrid();
    }
}


// End the game
function endGame() {
    gameActive = false; // Set game to inactive
    endMessage.textContent = `Game Over! Your Score: ${score}`;
    endScreen.style.display = 'flex'; // Show end screen
}

// Handle grid clicks
gridElement.addEventListener('click', (event) => {
    if (!gameActive) return;
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;
    const cellIndex = Array.from(gridElement.children).indexOf(cell);
    const startRow = Math.floor(cellIndex / 8);
    const startCol = cellIndex % 8;

    placeShape(startRow, startCol); // Attempt to place the shape
});

// Highlight the shape on hover
gridElement.addEventListener('mouseover', (event) => {
    if (!gameActive) return;
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;
    const cellIndex = Array.from(gridElement.children).indexOf(cell);
    const startRow = Math.floor(cellIndex / 8);
    const startCol = cellIndex % 8;

    highlightPreview(startRow, startCol); // Highlight preview for placement
});

// Remove highlight on mouse out
gridElement.addEventListener('mouseout', () => {
    const previewCells = document.querySelectorAll('.cell.highlight');
    previewCells.forEach(cell => cell.classList.remove('highlight')); // Remove highlight
});

// Reset game button
resetButton.addEventListener('click', () => {
    resetGame();
});

// Restart game button
restartButton.addEventListener('click', () => {
    resetGame();
    endScreen.style.display = 'none'; // Hide end screen
});

// Reset the game
function resetGame() {
    grid = Array(8).fill(null).map(() => Array(8).fill(0)); // Reset grid
    score = 0; // Reset score
    availableShapes = getRandomShapes(); // Get initial random shapes
    createGrid();
    renderShapes(); // Render initial shapes
    scoreDisplay.textContent = `Score: ${score}`; // Update score display
    gameActive = true; // Set game to active
}

// Initial setup
resetGame(); // Initialize the game











