
const boardSize = 4;
const totalTiles = boardSize * boardSize;
let tiles = [];
let moves = 0;
let timer;
let timeLeft = 300; // 5 minutes in seconds
let imageUrl = ''; // To store the uploaded image URL
let selectedTiles = []; // To keep track of selected tiles
let timerStarted = false; // To track if the timer has started

// The provided initGame function initializes a game setup by creating an array of tiles and then rendering them
function initGame() {
    tiles = Array.from({ length: totalTiles }, (_, i) => i);
    renderTiles();
}
// The renderTiles function dynamically updates and displays a game board using the current state of tiles and associated data.
function renderTiles() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        if (imageUrl) {
            tileElement.style.backgroundImage = `url('${imageUrl}')`;
            tileElement.style.backgroundSize = '400px 400px'; // Adjust based on your image size
            tileElement.style.backgroundPosition = `-${(tile % boardSize) * 100}px -${Math.floor(tile / boardSize) * 100}px`;
        }
        tileElement.addEventListener('click', () => selectTile(index, tileElement));
gameBoard.appendChild(tileElement);
    });
    document.getElementById('moves').innerText = moves;
    document.getElementById('victory-message').style.display = 'none';
}

function selectTile(index, tileElement) {
    if (selectedTiles.length < 2) {
        selectedTiles.push(index);
        tileElement.classList.add('highlight'); // Add highlight class to the selected tile
        if (selectedTiles.length === 2) {
            const firstTileElement = document.getElementById('game-board').children[selectedTiles[0]];
            const secondTileElement = document.getElementById('game-board').children[selectedTiles[1]];
            swapTiles(selectedTiles[0], selectedTiles[1], firstTileElement, secondTileElement);
            selectedTiles = []; // Reset selection
        }
    }
}

function swapTiles(index1, index2, tile1, tile2) {
    // Store the original background positions
    const pos1 = tile1.style.backgroundPosition;
    const pos2 = tile2.style.backgroundPosition;

    // Animate the swap
    tile1.style.backgroundPosition = pos2;
    tile2.style.backgroundPosition = pos1;

    // Swap the tiles in the array after a short delay to allow the animation to complete
    setTimeout(() => {
        [tiles[index1], tiles[index2]] = [tiles[index2], tiles[index1]];
        moves++;
        document.getElementById('moves').innerText = moves;

        // Render the tiles to reflect the swap
        renderTiles();

        // Check for victory
        checkVictory();
    }, 300); // Match this duration with the CSS transition duration
}

function checkVictory() {
    if (tiles.every((tile, index) => tile === index)) {
        document.getElementById('victory-message').innerText = 'Congratulations! Gelichesam ra bulloda...!';
        document.getElementById('victory-message').style.display = 'block';
        clearInterval(timer); // Stop the timer
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Time is up! Game over.');
            document.getElementById('victory-message').innerText = 'You ran out of time!';
            document.getElementById('victory-message').style.display = 'block';
        }
    }, 1000);
}

document.getElementById('scramble-btn').addEventListener('click', () => {
    if (!timerStarted) {
        startTimer(); // Start the timer when the scramble button is clicked for the first time
        timerStarted = true; // Set the flag to true
    }
    moves = 0;
    timeLeft = 300; // Reset to 5 minutes
    document.getElementById('time').innerText = timeLeft;
    document.getElementById('moves').innerText = moves;
    document.getElementById('victory-message').style.display = 'none';
    // Shuffle the tiles
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    renderTiles();
});

document.getElementById('upload-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('image-upload');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageUrl = event.target.result; // Store the uploaded image URL
            setImageForPuzzle();
            document.getElementById('reference-image').src = imageUrl; // Set reference image
            document.getElementById('reference-image').style.display = 'block'; // Show reference image
            document.getElementById('scramble-btn').disabled = false; // Enable the scramble button
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file first.');
    }
});

function setImageForPuzzle() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        if (imageUrl) {
            tile.style.backgroundImage = `url('${imageUrl}')`;
            tile.style.backgroundSize = '400px 400px'; // Adjust based on your image size
            tile.style.backgroundPosition = `-${(index % boardSize) * 100}px -${Math.floor(index / boardSize) * 100}px`;
        }
    });
    renderTiles(); // Re-render tiles to apply the new image
}
initGame();
