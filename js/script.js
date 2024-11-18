document.addEventListener("DOMContentLoaded", () => {
    main();
});

function main() {
    console.log("Game start!");

    const gameState = initializeGame();

	console.log("Init game stats: ", gameState);

    renderBoard(gameState);

    setupEventListeners(gameState);
}

function initializeGame() {
    const initialBoard = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    spawnRandomTile(initialBoard);
    spawnRandomTile(initialBoard);

    return {
        board: initialBoard,
        score: 0,
        isGameOver: false,
    };
}

function renderBoard(gameState) {
    const gridContainer = document.querySelector(".grid-container");

	if (gridContainer) {
		gridContainer.innerHTML = "";

		gameState.board.forEach(row => {
			row.forEach(value => {
				const cell = document.createElement("div");
				cell.classList.add("grid-cell");
				if (value !== 0) {
					cell.classList.add(`grid-cell-${value}`);
					cell.textContent = value;
				}
				gridContainer.appendChild(cell);
			});
		});

		document.getElementById("score").textContent = gameState.score;
	}
}


function spawnRandomTile(board) {
    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0) emptyCells.push({ row: i, col: j });
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function setupEventListeners(gameState) {
    document.addEventListener("keydown", (event) => {
        if (gameState.isGameOver) return;

        const { board, score } = gameState;
        let moved = false;

        switch (event.key) {
            case "ArrowUp":
                moved = moveUp(board);
                break;
            case "ArrowDown":
                moved = moveDown(board);
                break;
            case "ArrowLeft":
                moved = moveLeft(board);
                break;
            case "ArrowRight":
                moved = moveRight(board);
                break;
        }

        if (moved) {
            spawnRandomTile(board);
            renderBoard(gameState);
            checkGameOver(gameState);
        }
    });

	const restartBtn = document.getElementById("restart-btn");

	if (restartBtn) {
		restartBtn.addEventListener("click", () => {
			const newGameState = initializeGame();
			Object.assign(gameState, newGameState);
			renderBoard(gameState);
		});
	}
}

function checkGameOver(gameState) {
    const { board } = gameState;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0) return;
        }
    }


    const hasMoves = canMove(board);
    if (!hasMoves) {
        gameState.isGameOver = true;
        alert("Game Over!");
    }
}

function canMove(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const value = board[i][j];
            if (i > 0 && board[i - 1][j] === value) return true;
            if (i < 3 && board[i + 1][j] === value) return true;
            if (j > 0 && board[i][j - 1] === value) return true;
            if (j < 3 && board[i][j + 1] === value) return true;
        }
    }
    return false;
}

function moveLeft(board) {
	console.log('Moved Left!!');
    return false;
}

function moveRight(board) {
	console.log('Moved Down!!');
    return false;
}

function moveUp(board) {
	console.log('Moved Up!!');
    return false;
}

function moveDown(board) {
	console.log('Moved Down!!');
    return false;
}
