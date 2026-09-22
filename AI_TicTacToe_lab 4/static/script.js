// ============================================================
// GAME VARIABLES
// ============================================================

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let currentPlayer = "O";

let gameOver = false;

let aiThinking = false;

let selectedAlgorithm = "alphabeta";


// ============================================================
// DOM ELEMENTS
// ============================================================

const cells =
    document.querySelectorAll(".cell");

const statusElement =
    document.getElementById("status");

const messageElement =
    document.getElementById("message");


// ============================================================
// CELL CLICK
// ============================================================

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index =
            Number(cell.dataset.index);

        humanMove(index);

    });

});


// ============================================================
// HUMAN MOVE
// ============================================================

function humanMove(index) {

    if (
        gameOver ||
        aiThinking ||
        currentPlayer !== "O" ||
        board[index] !== ""
    ) {
        return;
    }


    board[index] = "O";

    renderBoard();


    const result =
        checkWinner(board);


    if (result) {

        finishGame(result);

        return;
    }


    currentPlayer = "X";

    aiThinking = true;

    setStatus(
        "AI Thinking...",
        "thinking"
    );


    messageElement.innerHTML =
        "🧠 The AI is analyzing possible future moves...";


    setTimeout(() => {

        makeAIMove();

    }, 350);

}


// ============================================================
// AI MOVE
// ============================================================

async function makeAIMove() {

    try {

        const response =
            await fetch("/ai-move", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    board: board,

                    algorithm:
                        selectedAlgorithm

                })

            });


        const data =
            await response.json();


        if (data.move !== null) {

            board[data.move] = "X";

        }


        updateStatistics(data);

        renderBoard();


        const result =
            checkWinner(board);


        if (result) {

            finishGame(result);

            return;
        }


        currentPlayer = "O";

        aiThinking = false;


        setStatus(
            "Your Turn",
            "waiting"
        );


        messageElement.innerHTML =
            "💡 Choose an empty square. The AI has already calculated its response.";

    }

    catch (error) {

        console.error(error);

        messageElement.innerHTML =
            "❌ Unable to communicate with the Flask server.";

        aiThinking = false;

    }

}


// ============================================================
// SELECT ALGORITHM
// ============================================================

function selectAlgorithm(algorithm) {

    selectedAlgorithm = algorithm;


    document
        .getElementById("minimaxBtn")
        .classList.remove("active");


    document
        .getElementById("alphaBtn")
        .classList.remove("active");


    if (algorithm === "minimax") {

        document
            .getElementById("minimaxBtn")
            .classList.add("active");

        messageElement.innerHTML =
            "🧠 Minimax selected. The AI will explore the complete search tree.";

    }

    else {

        document
            .getElementById("alphaBtn")
            .classList.add("active");

        messageElement.innerHTML =
            "⚡ Alpha Beta selected. The AI will prune unnecessary branches.";

    }

}


// ============================================================
// UPDATE BOARD
// ============================================================

function renderBoard() {

    cells.forEach((cell, index) => {

        const value = board[index];

        cell.textContent = value;

        cell.classList.remove(
            "x",
            "o",
            "disabled"
        );


        if (value === "X") {

            cell.classList.add("x");

        }

        if (value === "O") {

            cell.classList.add("o");

        }

        if (value !== "") {

            cell.classList.add("disabled");

        }

    });

}


// ============================================================
// CHECK WINNER
// ============================================================

function checkWinner(currentBoard) {

    const combinations = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]

    ];


    for (const combination of combinations) {

        const [a, b, c] =
            combination;


        if (
            currentBoard[a] !== "" &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[b] === currentBoard[c]
        ) {

            return {
                winner: currentBoard[a],
                line: combination
            };

        }

    }


    if (!currentBoard.includes("")) {

        return {
            winner: "draw",
            line: []
        };

    }


    return null;

}


// ============================================================
// FINISH GAME
// ============================================================

function finishGame(result) {

    gameOver = true;

    aiThinking = false;


    if (result.winner === "X") {

        setStatus(
            "Computer Wins",
            "loss"
        );


        messageElement.innerHTML =
            "🤖 <strong>Computer wins!</strong> Minimax successfully found an optimal move.";

    }


    else if (result.winner === "O") {

        setStatus(
            "You Win!",
            "win"
        );


        messageElement.innerHTML =
            "🎉 <strong>You won!</strong> Excellent play.";

    }


    else {

        setStatus(
            "Draw",
            "waiting"
        );


        messageElement.innerHTML =
            "🤝 <strong>Draw!</strong> Both players reached a balanced position.";

    }


    result.line.forEach(index => {

        cells[index]
            .classList.add("win-cell");

    });

}


// ============================================================
// NEW GAME
// ============================================================

function newGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    currentPlayer = "O";

    gameOver = false;

    aiThinking = false;


    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "disabled",
            "win-cell"
        );

    });


    resetStatistics();


    setStatus(
        "Your Turn",
        "waiting"
    );


    messageElement.innerHTML =
        "💡 Make your move. The AI will calculate the optimal response.";

}


// ============================================================
// STATUS
// ============================================================

function setStatus(text, type) {

    statusElement.textContent = text;

    statusElement.className =
        "status " + type;

}


// ============================================================
// UPDATE STATISTICS
// ============================================================

function updateStatistics(data) {

    document.getElementById("nodes")
        .textContent =
        data.nodes.toLocaleString();


    document.getElementById("pruned")
        .textContent =
        data.pruned.toLocaleString();


    document.getElementById("score")
        .textContent =
        data.score;


    document.getElementById("move")
        .textContent =
        data.move !== null
            ? "Position " + (data.move + 1)
            : "—";


    if (selectedAlgorithm === "alphabeta") {

        document.getElementById(
            "alphaValue"
        ).textContent = "Updated";

        document.getElementById(
            "betaValue"
        ).textContent = "Updated";

    }

}


// ============================================================
// RESET STATISTICS
// ============================================================

function resetStatistics() {

    document.getElementById("nodes")
        .textContent = "0";


    document.getElementById("pruned")
        .textContent = "0";


    document.getElementById("score")
        .textContent = "0";


    document.getElementById("move")
        .textContent = "—";


    document.getElementById("alphaValue")
        .textContent = "−∞";


    document.getElementById("betaValue")
        .textContent = "+∞";


    document.getElementById("mmNodes")
        .textContent = "—";


    document.getElementById("abNodes")
        .textContent = "—";


    document.getElementById("mmScore")
        .textContent = "—";


    document.getElementById("abScore")
        .textContent = "—";


    document.getElementById("mmMove")
        .textContent = "—";


    document.getElementById("abMove")
        .textContent = "—";


    document.getElementById(
        "comparisonResult"
    ).textContent =
        "Run comparison to see performance difference.";

}


// ============================================================
// COMPARE ALGORITHMS
// ============================================================

async function compareAlgorithms() {

    messageElement.innerHTML =
        "📊 Comparing Minimax and Alpha Beta on the current board...";


    try {

        const response =
            await fetch("/compare", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    board: board

                })

            });


        const data =
            await response.json();


        document.getElementById(
            "mmNodes"
        ).textContent =
            data.minimax.nodes.toLocaleString();


        document.getElementById(
            "abNodes"
        ).textContent =
            data.alphabeta.nodes.toLocaleString();


        document.getElementById(
            "mmScore"
        ).textContent =
            data.minimax.score;


        document.getElementById(
            "abScore"
        ).textContent =
            data.alphabeta.score;


        document.getElementById(
            "mmMove"
        ).textContent =
            data.minimax.move !== null
                ? "Position " +
                  (data.minimax.move + 1)
                : "—";


        document.getElementById(
            "abMove"
        ).textContent =
            data.alphabeta.move !== null
                ? "Position " +
                  (data.alphabeta.move + 1)
                : "—";


        let resultText = "";


        if (
            data.same_move &&
            data.same_score
        ) {

            resultText =
                "✓ Same optimal decision and same score. " +
                "Alpha Beta explored " +
                data.reduction +
                "% fewer nodes.";

        }

        else {

            resultText =
                "The algorithms returned different search details for this position.";

        }


        document.getElementById(
            "comparisonResult"
        ).textContent =
            resultText;


        messageElement.innerHTML =
            "⚡ <strong>Comparison complete!</strong> Check the analytics panel to see the difference.";

    }

    catch (error) {

        console.error(error);

        messageElement.innerHTML =
            "❌ Comparison failed. Please try again.";

    }

}


// ============================================================
// INITIALIZE
// ============================================================

newGame();