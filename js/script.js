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
                moved = moveUp(board, gameState);
                break;
            case "ArrowDown":
                moved = moveDown(board, gameState);
                break;
            case "ArrowLeft":
                moved = moveLeft(board, gameState);
                break;
            case "ArrowRight":
                moved = moveRight(board, gameState);
                break;
        }

        if (moved) {
            spawnRandomTile(board);
            renderBoard(gameState);
			setTimeout(() => {
				checkGameOver(gameState);
			}, 100);
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
    const { board, score } = gameState;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 2048) {
                gameState.isGameOver = true;

				if (window.confirm(`You Win! Your score is ${score}`)) {
					const newGameState = initializeGame();
					Object.assign(gameState, newGameState);
					renderBoard(gameState);
					return;
				}
            }
        }
    }

    const hasMoves = canMove(board);
    if (!hasMoves) {
        gameState.isGameOver = true;

		if (window.confirm("Game Over! Do you want to restart the game?")) {
			const newGameState = initializeGame();
			Object.assign(gameState, newGameState);
			renderBoard(gameState);
		}
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

function moveLeft(board, gameState) {
    let moved = false;
    for (let i = 0; i < board.length; i++) {
        let newRow = board[i].filter(val => val !== 0);
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j] === newRow[j + 1]) {
                newRow[j] *= 2;
                newRow[j + 1] = 0;
                gameState.score += newRow[j];
            }
        }
        newRow = newRow.filter(val => val !== 0);
        while (newRow.length < 4) {
            newRow.push(0);
        }
        if (!arraysEqual(board[i], newRow)) {
            moved = true;
        }
        board[i] = newRow;
    }
    return moved;
}

function moveRight(board, gameState) {
    let moved = false;
    for (let i = 0; i < board.length; i++) {
        let newRow = board[i].filter(val => val !== 0);
        for (let j = newRow.length - 1; j > 0; j--) {
            if (newRow[j] === newRow[j - 1]) {
                newRow[j] *= 2;
                newRow[j - 1] = 0;
                gameState.score += newRow[j];
            }
        }
        newRow = newRow.filter(val => val !== 0);
        while (newRow.length < 4) {
            newRow.unshift(0);
        }
        if (!arraysEqual(board[i], newRow)) {
            moved = true;
        }
        board[i] = newRow;
    }
    return moved;
}

function moveUp(board, gameState) {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== 0) {
                newCol.push(board[row][col]);
            }
        }
        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                newCol[i + 1] = 0;
                gameState.score += newCol[i];
            }
        }
        newCol = newCol.filter(val => val !== 0);
        while (newCol.length < 4) {
            newCol.push(0);
        }
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== newCol[row]) {
                moved = true;
            }
            board[row][col] = newCol[row];
        }
    }
    return moved;
}

function moveDown(board, gameState) {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== 0) {
                newCol.push(board[row][col]);
            }
        }
        for (let i = newCol.length - 1; i > 0; i--) {
            if (newCol[i] === newCol[i - 1]) {
                newCol[i] *= 2;
                newCol[i - 1] = 0;
                gameState.score += newCol[i];
            }
        }
        newCol = newCol.filter(val => val !== 0);
        while (newCol.length < 4) {
            newCol.unshift(0);
        }
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== newCol[row]) {
                moved = true;
            }
            board[row][col] = newCol[row];
        }
    }
    return moved;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

