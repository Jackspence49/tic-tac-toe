// Create a function for the Game Board
const GameBoard = function () {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = function() {
        return board;
    };

    const setCell = function(index, marker) {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = function() {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setCell, resetBoard };
};

// Control the game Flow
const gameLogic = function() {
    let currentPlayer = "X";

    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const switchPlayer = function() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    };

    const checkWinner = function() {
        const board = gameBoard.getBoard(); // Use the instance here

        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return currentPlayer;
            }
        }
        return null; // Ensure null is returned if no winner
    };

    const getCurrentPlayer = function() {
        return currentPlayer;
    };

    const resetGame = function() {
        currentPlayer = "X";
        gameBoard.resetBoard(); // Use the instance
    };

    return { getCurrentPlayer, switchPlayer, checkWinner, resetGame };
};


// Display Control
const displayControl = function(gameBoard, gameLogic) {
    const cells = [];
    const gameBoardElement = document.querySelector('.board');
    const statusElement = document.querySelector('.status');
    const resetButton = document.querySelector('.resetGame');

    // Create the visual board and click listeners
    const createBoard = function() {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("click", function() {
                handleClick(i);
            });
            gameBoardElement.appendChild(cell);
            cells.push(cell);
        }
    };

    // Handles a player's move when they click a cell
    const handleClick = function(index) {
        const currentPlayer = gameLogic.getCurrentPlayer(); // Use the instance

        if (gameBoard.setCell(index, currentPlayer)) {
            updateBoard();
            const winner = gameLogic.checkWinner(); // Use the instance
            if (winner) {
                statusElement.textContent = `${winner} wins!`;
                disableBoard();
            } else if (isBoardFull()) {
                statusElement.textContent = "It's a Draw";
            } else {
                gameLogic.switchPlayer(); // Use the instance
                statusElement.textContent = `Player ${gameLogic.getCurrentPlayer()}'s turn`; // Use the instance
            }
        }
    };

    // Reset the display
    const resetDisplay = function() {
        gameLogic.resetGame(); // Use the instance

        cells.forEach(cell => {
            cell.textContent = "";
            cell.style.pointerEvents = "auto";
        });

        statusElement.textContent = `Player ${gameLogic.getCurrentPlayer()}'s turn`; // Use the instance
    };

    // Other helper functions (updateBoard, isBoardFull, disableBoard) go here...

    const updateBoard = function () {
        const board = gameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const isBoardFull = function() {
        return gameBoard.getBoard().every(cell => cell !== "");
    };

    const disableBoard = function() {
        cells.forEach(cell => {
            cell.style.pointerEvents = "none";
        });
    };

    // Event listener for reset button
    resetButton.addEventListener("click", resetDisplay); // Correct event name
    createBoard();
}

// Initialize game components
const gameBoard = GameBoard();
const gameLogicInstance = gameLogic(); // Correct instance creation
displayControl(gameBoard, gameLogicInstance);