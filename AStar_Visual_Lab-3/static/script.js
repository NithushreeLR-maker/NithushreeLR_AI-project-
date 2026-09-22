// ======================================================
// A* VISUAL LAB
// Frontend JavaScript
// ======================================================

let solutionPath = [];

let currentStep = 0;

let autoPlayTimer = null;


// ======================================================
// GET CURRENT PUZZLE
// ======================================================

function getPuzzle() {

    const puzzle = [];

    for (let i = 0; i < 9; i++) {

        const value =
            parseInt(
                document.getElementById(
                    "cell" + i
                ).value
            );

        puzzle.push(value);

    }

    return puzzle;
}


// ======================================================
// SELECTED HEURISTIC
// ======================================================

function getSelectedHeuristic() {

    const selected =
        document.querySelector(
            'input[name="heuristic"]:checked'
        );

    return selected.value;
}


// ======================================================
// SOLVE PUZZLE
// ======================================================

async function solvePuzzle() {

    const message =
        document.getElementById(
            "message"
        );

    message.innerHTML =
        "⏳ A* is searching for the optimal path...";


    const puzzle = getPuzzle();

    const heuristic =
        getSelectedHeuristic();


    try {

        const response =
            await fetch(
                "/solve",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        puzzle: puzzle,

                        heuristic: heuristic

                    })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            message.innerHTML =
                "⚠ " + data.message;

            return;

        }


        message.innerHTML =
            "✓ Solution found successfully";


        showResults(
            data.results
        );


        // Use first result for visualization
        if (data.results.length > 0) {

            solutionPath =
                data.results[0].path;

            currentStep = 0;

            showSolution();

        }

    }

    catch (error) {

        console.error(error);

        message.innerHTML =
            "⚠ Unable to connect to Flask server.";

    }

}


// ======================================================
// DISPLAY RESULTS
// ======================================================

function showResults(results) {

    const section =
        document.getElementById(
            "resultsSection"
        );

    const cards =
        document.getElementById(
            "resultCards"
        );

    cards.innerHTML = "";


    results.forEach(
        (result, index) => {

            cards.innerHTML += `

                <div class="result-card">

                    <div class="result-title">

                        <h3>
                            ${result.name}
                        </h3>

                        <span>
                            Heuristic ${index + 1}
                        </span>

                    </div>


                    <div class="stats">

                        <div class="stat">

                            <div class="stat-value">
                                ${result.initial_h}
                            </div>

                            <div class="stat-label">
                                Initial h
                            </div>

                        </div>


                        <div class="stat">

                            <div class="stat-value">
                                ${result.moves}
                            </div>

                            <div class="stat-label">
                                Moves
                            </div>

                        </div>


                        <div class="stat">

                            <div class="stat-value">
                                ${result.expanded}
                            </div>

                            <div class="stat-label">
                                Nodes
                            </div>

                        </div>


                        <div class="stat">

                            <div class="stat-value">
                                ${result.time}
                            </div>

                            <div class="stat-label">
                                ms
                            </div>

                        </div>

                    </div>

                </div>

            `;

        }
    );


    showComparison(results);


    section.classList.remove(
        "hidden"
    );

}


// ======================================================
// COMPARISON
// ======================================================

function showComparison(results) {

    const box =
        document.getElementById(
            "comparisonBox"
        );


    if (results.length < 2) {

        box.innerHTML =
            "Run both heuristics to compare their search performance.";

        return;

    }


    const first = results[0];

    const second = results[1];


    const nodeDifference =
        Math.abs(
            first.expanded -
            second.expanded
        );


    box.innerHTML = `

        <strong>
            Heuristic Comparison
        </strong>

        <br><br>

        Both heuristics found a solution
        with <strong>${first.moves}</strong>
        moves.

        The search expanded
        <strong>${first.expanded}</strong>
        nodes using ${first.name}
        and
        <strong>${second.expanded}</strong>
        nodes using ${second.name}.

        The difference in expanded nodes is
        <strong>${nodeDifference}</strong>.

        Manhattan Distance generally provides
        a more informative estimate because it
        considers how far each tile is from its
        goal position.

    `;

}


// ======================================================
// SHOW SOLUTION
// ======================================================

function showSolution() {

    const section =
        document.getElementById(
            "solutionSection"
        );

    section.classList.remove(
        "hidden"
    );

    renderSolution();

}


// ======================================================
// RENDER CURRENT STEP
// ======================================================

function renderSolution() {

    const board =
        document.getElementById(
            "solutionBoard"
        );

    const stepCounter =
        document.getElementById(
            "stepCounter"
        );

    const description =
        document.getElementById(
            "moveDescription"
        );

    const progress =
        document.getElementById(
            "progressBar"
        );


    board.innerHTML = "";


    const state =
        solutionPath[currentStep];


    state.forEach(
        (value) => {

            const tile =
                document.createElement(
                    "div"
                );


            tile.className =
                "solution-tile";


            if (value === 0) {

                tile.classList.add(
                    "empty"
                );

            }
            else {

                tile.textContent =
                    value;

            }


            board.appendChild(tile);

        }
    );


    stepCounter.innerHTML =
        `STEP ${currentStep} / ${
            solutionPath.length - 1
        }`;


    if (currentStep === 0) {

        description.innerHTML =
            "Starting State";

    }
    else if (
        currentStep ===
        solutionPath.length - 1
    ) {

        description.innerHTML =
            "🎯 Goal Reached";

    }
    else {

        description.innerHTML =
            "A* selected the next state with the smallest f(n) value.";

    }


    const percentage =
        (
            currentStep /
            (solutionPath.length - 1)
        ) * 100;


    progress.style.width =
        percentage + "%";

}


// ======================================================
// NEXT
// ======================================================

function nextStep() {

    if (
        currentStep <
        solutionPath.length - 1
    ) {

        currentStep++;

        renderSolution();

    }

}


// ======================================================
// PREVIOUS
// ======================================================

function previousStep() {

    if (currentStep > 0) {

        currentStep--;

        renderSolution();

    }

}


// ======================================================
// AUTO PLAY
// ======================================================

function toggleAutoPlay() {

    if (autoPlayTimer) {

        clearInterval(
            autoPlayTimer
        );

        autoPlayTimer = null;

        return;

    }


    autoPlayTimer =
        setInterval(
            () => {

                if (
                    currentStep >=
                    solutionPath.length - 1
                ) {

                    clearInterval(
                        autoPlayTimer
                    );

                    autoPlayTimer = null;

                    return;

                }

                nextStep();

            },
            650
        );

}


// ======================================================
// RANDOM SOLVABLE PUZZLE
// ======================================================

function generatePuzzle() {

    let puzzle;

    do {

        puzzle =
            Array.from(
                {
                    length: 9
                },
                (_, i) => i
            );

        // Fisher-Yates shuffle
        for (
            let i = puzzle.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                puzzle[i],
                puzzle[j]
            ] = [
                puzzle[j],
                puzzle[i]
            ];

        }

    }
    while (
        !isSolvable(puzzle)
        ||
        puzzle.join(",") ===
        "1,2,3,4,5,6,7,8,0"
    );


    puzzle.forEach(
        (value, index) => {

            document.getElementById(
                "cell" + index
            ).value = value;

        }
    );

}


// ======================================================
// SOLVABILITY
// ======================================================

function isSolvable(puzzle) {

    const values =
        puzzle.filter(
            value => value !== 0
        );

    let inversions = 0;


    for (
        let i = 0;
        i < values.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < values.length;
            j++
        ) {

            if (
                values[i] >
                values[j]
            ) {

                inversions++;

            }

        }

    }


    return inversions % 2 === 0;

}


// ======================================================
// RESET
// ======================================================

function resetPuzzle() {

    const defaultPuzzle =
        [
            1, 2, 3,
            7, 6, 8,
            5, 4, 0
        ];


    defaultPuzzle.forEach(
        (value, index) => {

            document.getElementById(
                "cell" + index
            ).value = value;

        }
    );


    document.getElementById(
        "resultsSection"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "solutionSection"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "message"
    ).innerHTML = "";


    solutionPath = [];

    currentStep = 0;

}


// ======================================================
// HEURISTIC CARD SELECTION
// ======================================================

document
    .querySelectorAll(
        ".heuristic-option"
    )
    .forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".heuristic-option"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    option.classList.add(
                        "active"
                    );

                }
            );

        }
    );