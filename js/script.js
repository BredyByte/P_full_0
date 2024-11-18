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
        [{ val: 0, justMerged: false }, { val: 0, justMerged: false }, { val: 0, justMerged: false }, { val: 0, justMerged: false }],
        [{ val: 0, justMerged: false }, { val: 0, justMerged: false }, { val: 0, justMerged: false }, { val: 0, justMerged: false }],
        [{ val: 0, justMerged: false }, { val: 0, justMerged: false }, { val: 0, justMerged: false }, { val: 0, justMerged: false }],
        [{ val: 0, justMerged: false }, { val: 0, justMerged: false }, { val: 0, justMerged: false }, { val: 0, justMerged: false }]
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
            row.forEach(cell => {
                const div = document.createElement("div");
                div.classList.add("grid-cell");

                if (cell.val !== 0) {
                    div.classList.add(`grid-cell-${cell.val}`);
                    div.textContent = cell.val;
                    if (cell.justMerged) {
                        div.classList.add("grid-cell-merged");
                        setTimeout(() => {
                            cell.justMerged = false;
                            renderBoard(gameState);
                        }, 200);
                    }
                }
                gridContainer.appendChild(div);
            });
        });

        document.getElementById("score").textContent = gameState.score;
    }
}



function spawnRandomTile(board) {
    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].val === 0) emptyCells.push({ row: i, col: j });
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
        board[row][col].val = Math.random() < 0.9 ? 2 : 4;
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
			// setTimeout(() => {
			// 	checkGameOver(gameState);
			// }, 100);
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

// function checkGameOver(gameState) {
//     const { board, score } = gameState;

//     for (let i = 0; i < board.length; i++) {
//         for (let j = 0; j < board[i].length; j++) {
//             if (board[i][j] === 2048) {
//                 gameState.isGameOver = true;

// 				if (window.confirm(`You Win! Your score is ${score}`)) {
// 					const newGameState = initializeGame();
// 					Object.assign(gameState, newGameState);
// 					renderBoard(gameState);
// 					return;
// 				}
//             }
//         }
//     }

//     const hasMoves = canMove(board);
//     if (!hasMoves) {
//         gameState.isGameOver = true;

// 		if (window.confirm("Game Over! Do you want to restart the game?")) {
// 			const newGameState = initializeGame();
// 			Object.assign(gameState, newGameState);
// 			renderBoard(gameState);
// 		}
//     }
// }

// function canMove(board) {
//     for (let i = 0; i < board.length; i++) {
//         for (let j = 0; j < board[i].length; j++) {
//             const value = board[i][j];
//             if (i > 0 && board[i - 1][j] === value) return true;
//             if (i < 3 && board[i + 1][j] === value) return true;
//             if (j > 0 && board[i][j - 1] === value) return true;
//             if (j < 3 && board[i][j + 1] === value) return true;
//         }
//     }
//     return false;
// }

function moveLeft(board, gameState) {
    let moved = false;

    const originalBoard = board.map(row => row.map(cell => ({ ...cell })));

    for (let i = 0; i < board.length; i++) {
        let newRow = board[i].filter(cell => cell.val !== 0);
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j].val === newRow[j + 1].val) {
                newRow[j].val *= 2;
                newRow[j + 1].val = 0;
                newRow[j].justMerged = true;
                gameState.score += newRow[j].val;
            }
        }
        newRow = newRow.filter(cell => cell.val !== 0);
        while (newRow.length < 4) {
            newRow.push({ val: 0, justMerged: false });
        }
        board[i] = newRow;
    }

    if (!areBoardsEqual(originalBoard, board)) {
        moved = true;
    }

    console.log("Left: ", board);
    return moved;
}


function moveRight(board, gameState) {
    let moved = false;

    const originalBoard = board.map(row => row.map(cell => ({ ...cell })));

    for (let i = 0; i < board.length; i++) {
        let newRow = board[i].filter(cell => cell.val !== 0);
        for (let j = newRow.length - 1; j > 0; j--) {
            if (newRow[j].val === newRow[j - 1].val) {
                newRow[j].val *= 2;
                newRow[j - 1].val = 0;
                newRow[j].justMerged = true;
                gameState.score += newRow[j].val;
            }
        }
        newRow = newRow.filter(cell => cell.val !== 0);
        while (newRow.length < 4) {
            newRow.unshift({ val: 0, justMerged: false });
        }
        board[i] = newRow;
    }

    if (!areBoardsEqual(originalBoard, board)) {
        moved = true;
    }

    console.log("Right: ", board);
    return moved;
}

function moveUp(board, gameState) {
    let moved = false;

    const originalBoard = board.map(row => row.map(cell => ({ ...cell })));

    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            if (board[row][col].val !== 0) {
                newCol.push(board[row][col]);
            }
        }
        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i].val === newCol[i + 1].val) {
                newCol[i].val *= 2;
                newCol[i + 1].val = 0;
                newCol[i].justMerged = true;
                gameState.score += newCol[i].val;
            }
        }
        newCol = newCol.filter(cell => cell.val !== 0);
        while (newCol.length < 4) {
            newCol.push({ val: 0, justMerged: false });
        }
        for (let row = 0; row < 4; row++) {
            board[row][col] = newCol[row];
        }
    }

    if (!areBoardsEqual(originalBoard, board)) {
        moved = true;
    }

    console.log("Up: ", board);
    return moved;
}


function moveDown(board, gameState) {
    let moved = false;

    const originalBoard = board.map(row => row.map(cell => ({ ...cell })));

    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            if (board[row][col].val !== 0) {
                newCol.push(board[row][col]);
            }
        }
        for (let i = newCol.length - 1; i > 0; i--) {
            if (newCol[i].val === newCol[i - 1].val) {
                newCol[i].val *= 2;
                newCol[i - 1].val = 0;
                newCol[i].justMerged = true;
                gameState.score += newCol[i].val;
            }
        }
        newCol = newCol.filter(cell => cell.val !== 0);
        while (newCol.length < 4) {
            newCol.unshift({ val: 0, justMerged: false });
        }
        for (let row = 0; row < 4; row++) {
            board[row][col] = newCol[row];
        }
    }

    if (!areBoardsEqual(originalBoard, board)) {
        moved = true;
    }

    console.log("Down: ", board);
    return moved;
}

function areBoardsEqual(board1, board2) {
    for (let i = 0; i < board1.length; i++) {
        for (let j = 0; j < board1[i].length; j++) {
            if (board1[i][j].val !== board2[i][j].val) {
                return false;
            }
        }
    }
    return true;
}
