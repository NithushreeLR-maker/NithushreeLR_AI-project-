const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const message =
    document.getElementById("message");

const title =
    document.getElementById("gameTitle");

let currentGame = null;

let timer = null;

let gameOver = false;

let keys = {};

let score = 0;

let wins = 0;

let losses = 0;

let state = {};


document.addEventListener(
    "keydown",
    function (event) {

        keys[event.key.toLowerCase()] = true;

        if (
            event.key.toLowerCase() === "r"
        ) {
            newGame();
        }

    }
);


document.addEventListener(
    "keyup",
    function (event) {

        keys[event.key.toLowerCase()] = false;

    }
);


function difficulty() {

    return document
        .getElementById("difficulty")
        .value;

}


function setMessage(text) {

    message.innerText = text;

}


function addScore(points) {

    score += points;

    document.getElementById(
        "score"
    ).innerText = score;

}


function gameResult(win) {

    if (win) {

        wins++;

        addScore(100);

    }

    else {

        losses++;

    }

    document.getElementById(
        "wins"
    ).innerText = wins;

    document.getElementById(
        "losses"
    ).innerText = losses;

}


function stopGame() {

    if (timer) {

        clearInterval(timer);

        timer = null;

    }

}


function finishGame(win, text) {

    if (gameOver) {

        return;

    }

    gameOver = true;

    stopGame();

    gameResult(win);

    setMessage(
        text +
        " Press R to restart."
    );

}


function openGame(name) {

    currentGame = name;

    newGame();

}


function newGame() {

    stopGame();

    gameOver = false;

    state = {};

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    if (!currentGame) {

        setMessage(
            "Choose a game above."
        );

        return;

    }


    const names = {

        snake:
            "🐍 AI Snake",

        racing:
            "🚗 AI Car Racing",

        shooter:
            "🚀 Space Shooter AI",

        runner:
            "🏃 AI Runner",

        zombie:
            "🧟 Zombie Survival",

        maze:
            "🧩 AI Maze Escape"

    };


    title.innerText =
        names[currentGame];


    if (currentGame === "snake")
        startSnake();


    if (currentGame === "racing")
        startRacing();


    if (currentGame === "shooter")
        startShooter();


    if (currentGame === "runner")
        startRunner();


    if (currentGame === "zombie")
        startZombie();


    if (currentGame === "maze")
        startMaze();

}


/* =========================================
   AI SNAKE
========================================= */


function startSnake() {

    const grid = 20;

    const size = 26;


    state.snake = [

        [10, 10],

        [9, 10],

        [8, 10]

    ];


    state.food = [

        15,

        10

    ];


    state.direction = [

        1,

        0

    ];


    function newFood() {

        let position;

        do {

            position = [

                Math.floor(
                    Math.random() * grid
                ),

                Math.floor(
                    Math.random() * grid
                )

            ];

        }

        while (
            state.snake.some(
                part =>
                    part[0] === position[0] &&
                    part[1] === position[1]
            )
        );


        return position;

    }


    function chooseDirection() {

        const head =
            state.snake[0];

        const food =
            state.food;


        let choices = [

            [1, 0],

            [-1, 0],

            [0, 1],

            [0, -1]

        ];


        choices =
            choices.filter(
                direction => !(
                    direction[0] ===
                    -state.direction[0] &&
                    direction[1] ===
                    -state.direction[1]
                )
            );


        if (
            difficulty() === "hard"
        ) {

            choices.sort(
                (a, b) => {

                    const da =
                        Math.abs(
                            head[0] +
                            a[0] -
                            food[0]
                        ) +
                        Math.abs(
                            head[1] +
                            a[1] -
                            food[1]
                        );


                    const db =
                        Math.abs(
                            head[0] +
                            b[0] -
                            food[0]
                        ) +
                        Math.abs(
                            head[1] +
                            b[1] -
                            food[1]
                        );


                    return da - db;

                }
            );

            return choices[0];

        }


        if (
            difficulty() === "medium" &&
            Math.random() < 0.8
        ) {

            choices.sort(
                (a, b) => {

                    const da =
                        Math.abs(
                            head[0] +
                            a[0] -
                            food[0]
                        ) +
                        Math.abs(
                            head[1] +
                            a[1] -
                            food[1]
                        );


                    const db =
                        Math.abs(
                            head[0] +
                            b[0] -
                            food[0]
                        ) +
                        Math.abs(
                            head[1] +
                            b[1] -
                            food[1]
                        );


                    return da - db;

                }
            );

            return choices[0];

        }


        return choices[
            Math.floor(
                Math.random() *
                choices.length
            )
        ];

    }


    function draw() {

        ctx.fillStyle =
            "#020617";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#ef4444";

        ctx.fillRect(
            state.food[0] * size,
            state.food[1] * size,
            size,
            size
        );


        state.snake.forEach(
            (part, index) => {

                ctx.fillStyle =
                    index === 0
                    ? "#86efac"
                    : "#22c55e";


                ctx.fillRect(
                    part[0] * size,
                    part[1] * size,
                    size - 2,
                    size - 2
                );

            }
        );

    }


    timer = setInterval(
        function () {

            state.direction =
                chooseDirection();


            const head =
                state.snake[0];


            const next = [

                head[0] +
                state.direction[0],

                head[1] +
                state.direction[1]

            ];


            if (
                next[0] < 0 ||
                next[1] < 0 ||
                next[0] >= grid ||
                next[1] >= grid
            ) {

                finishGame(
                    false,
                    "🐍 Snake crashed!"
                );

                return;

            }


            if (
                state.snake.some(
                    part =>
                        part[0] === next[0] &&
                        part[1] === next[1]
                )
            ) {

                finishGame(
                    false,
                    "🐍 Snake hit itself!"
                );

                return;

            }


            state.snake.unshift(next);


            if (
                next[0] ===
                state.food[0] &&
                next[1] ===
                state.food[1]
            ) {

                addScore(10);

                state.food =
                    newFood();

            }

            else {

                state.snake.pop();

            }


            draw();


            setMessage(
                "🤖 AI Snake is finding food."
            );

        },
        difficulty() === "easy"
            ? 220
            : difficulty() === "medium"
                ? 150
                : 90
    );


    draw();

}


/* =========================================
   AI CAR RACING
========================================= */


function startRacing() {

    state.player = {

        x: 250,

        y: 440

    };


    state.ai = {

        x: 600,

        y: 440

    };


    state.time = 0;


    timer = setInterval(
        function () {

            state.time++;


            const aiSpeed =
                difficulty() === "easy"
                ? 3
                : difficulty() === "medium"
                    ? 5
                    : 7;


            state.ai.y -=
                aiSpeed;


            state.player.y -= 3;


            if (
                keys.arrowleft ||
                keys.a
            ) {

                state.player.x -= 7;

            }


            if (
                keys.arrowright ||
                keys.d
            ) {

                state.player.x += 7;

            }


            state.player.x =
                Math.max(
                    180,
                    Math.min(
                        670,
                        state.player.x
                    )
                );


            state.ai.x =
                450 +
                Math.sin(
                    state.time / 15
                ) * 230;


            drawRacing();


            if (
                state.player.y <= 20
            ) {

                finishGame(
                    true,
                    "🏆 You won the race!"
                );

            }


            else if (
                state.ai.y <= 20
            ) {

                finishGame(
                    false,
                    "🚗 AI won the race!"
                );

            }

        },
        50
    );


    drawRacing();

}


function drawRacing() {

    ctx.fillStyle =
        "#14532d";

    ctx.fillRect(
        0,
        0,
        900,
        520
    );


    ctx.fillStyle =
        "#475569";

    ctx.fillRect(
        170,
        0,
        560,
        520
    );


    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 4;

    ctx.setLineDash(
        [30, 25]
    );


    ctx.beginPath();

    ctx.moveTo(
        450,
        0
    );

    ctx.lineTo(
        450,
        520
    );

    ctx.stroke();


    ctx.setLineDash([]);


    ctx.fillStyle =
        "#ef4444";

    ctx.fillRect(
        state.player.x,
        state.player.y,
        45,
        70
    );


    ctx.fillStyle =
        "#38bdf8";

    ctx.fillRect(
        state.ai.x,
        state.ai.y,
        45,
        70
    );


    ctx.fillStyle =
        "white";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        "YOU",
        state.player.x,
        state.player.y - 5
    );


    ctx.fillText(
        "AI",
        state.ai.x,
        state.ai.y - 5
    );


    setMessage(
        "Use ← → or A/D to move."
    );

}


/* =========================================
   SPACE SHOOTER
========================================= */


function startShooter() {

    state.player = {

        x: 430,

        y: 450

    };


    state.bullets = [];

    state.enemies = [];

    state.cooldown = 0;


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        state.enemies.push({

            x: 80 + i * 140,

            y: 80,

            direction: 1

        });

    }


    timer = setInterval(
        function () {

            if (
                keys.arrowleft ||
                keys.a
            ) {

                state.player.x -= 6;

            }


            if (
                keys.arrowright ||
                keys.d
            ) {

                state.player.x += 6;

            }


            if (
                keys[" "] &&
                state.cooldown <= 0
            ) {

                state.bullets.push({

                    x:
                        state.player.x + 20,

                    y:
                        state.player.y

                });


                state.cooldown =
                    difficulty() === "hard"
                    ? 5
                    : 10;

            }


            state.cooldown--;


            state.bullets.forEach(
                bullet => {

                    bullet.y -= 9;

                }
            );


            state.enemies.forEach(
                enemy => {

                    enemy.x +=
                        enemy.direction *
                        (
                            difficulty() ===
                            "easy"
                            ? 1
                            : difficulty() ===
                              "medium"
                            ? 2
                            : 3
                        );


                    if (
                        enemy.x < 20 ||
                        enemy.x > 870
                    ) {

                        enemy.direction *= -1;

                    }

                }
            );


            for (
                let bullet of state.bullets
            ) {

                for (
                    let enemy
                    of state.enemies
                ) {

                    if (
                        Math.abs(
                            bullet.x -
                            enemy.x
                        ) < 30 &&
                        Math.abs(
                            bullet.y -
                            enemy.y
                        ) < 30
                    ) {

                        enemy.dead = true;

                        bullet.dead = true;

                        addScore(20);

                    }

                }

            }


            state.bullets =
                state.bullets.filter(
                    bullet =>
                        !bullet.dead &&
                        bullet.y > 0
                );


            state.enemies =
                state.enemies.filter(
                    enemy =>
                        !enemy.dead
                );


            drawShooter();


            if (
                state.enemies.length === 0
            ) {

                finishGame(
                    true,
                    "🚀 All enemies destroyed!"
                );

            }

        },
        30
    );


    drawShooter();

}


function drawShooter() {

    ctx.fillStyle =
        "#020617";

    ctx.fillRect(
        0,
        0,
        900,
        520
    );


    ctx.fillStyle =
        "#38bdf8";

    ctx.beginPath();

    ctx.moveTo(
        state.player.x + 20,
        state.player.y
    );

    ctx.lineTo(
        state.player.x,
        state.player.y + 40
    );

    ctx.lineTo(
        state.player.x + 40,
        state.player.y + 40
    );

    ctx.closePath();

    ctx.fill();


    ctx.fillStyle =
        "#facc15";


    state.bullets.forEach(
        bullet => {

            ctx.fillRect(
                bullet.x,
                bullet.y,
                5,
                15
            );

        }
    );


    ctx.fillStyle =
        "#ef4444";


    state.enemies.forEach(
        enemy => {

            ctx.beginPath();

            ctx.arc(
                enemy.x,
                enemy.y,
                22,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );


    setMessage(
        "Use ← → and SPACE to shoot."
    );

}


/* =========================================
   AI RUNNER
========================================= */


function startRunner() {

    state.player = {

        x: 120,

        y: 420,

        velocity: 0

    };


    state.obstacles = [];

    state.time = 0;


    state.speed =
        difficulty() === "easy"
        ? 5
        : difficulty() === "medium"
            ? 7
            : 9;


    timer = setInterval(
        function () {

            state.time++;


            if (
                state.time % 35 === 0
            ) {

                state.obstacles.push({

                    x: 900,

                    height:
                        40 +
                        Math.random() * 80

                });

            }


            state.player.velocity +=
                1;


            state.player.y +=
                state.player.velocity;


            if (
                (
                    keys.arrowup ||
                    keys.w
                ) &&
                state.player.y >= 420
            ) {

                state.player.velocity =
                    -15;

            }


            state.obstacles.forEach(
                obstacle => {

                    obstacle.x -=
                        state.speed;

                }
            );


            for (
                let obstacle
                of state.obstacles
            ) {

                if (
                    obstacle.x < 160 &&
                    obstacle.x > 90 &&
                    state.player.y >
                    420 -
                    obstacle.height
                ) {

                    finishGame(
                        false,
                        "🏃 You hit an obstacle!"
                    );

                }

            }


            if (
                state.time > 700
            ) {

                finishGame(
                    true,
                    "🏆 You completed the run!"
                );

            }


            drawRunner();

        },
        30
    );


    drawRunner();

}


function drawRunner() {

    ctx.fillStyle =
        "#bae6fd";

    ctx.fillRect(
        0,
        0,
        900,
        520
    );


    ctx.fillStyle =
        "#166534";

    ctx.fillRect(
        0,
        460,
        900,
        60
    );


    ctx.fillStyle =
        "#7c3aed";

    ctx.fillRect(
        state.player.x,
        state.player.y,
        35,
        40
    );


    ctx.fillStyle =
        "#334155";


    state.obstacles.forEach(
        obstacle => {

            ctx.fillRect(
                obstacle.x,
                460 -
                obstacle.height,
                35,
                obstacle.height
            );

        }
    );


    setMessage(
        "Press ↑ / W to jump."
    );

}


/* =========================================
   ZOMBIE SURVIVAL
========================================= */


function startZombie() {

    state.player = {

        x: 100,

        y: 260

    };


    state.zombies = [

        {
            x: 700,
            y: 100
        },

        {
            x: 750,
            y: 400
        },

        {
            x: 500,
            y: 250
        }

    ];


    state.time = 0;


    timer = setInterval(
        function () {

            state.time++;


            const speed =
                difficulty() === "easy"
                ? 0.5
                : difficulty() === "medium"
                    ? 1
                    : 1.7;


            if (
                keys.arrowup ||
                keys.w
            )
                state.player.y -= 5;


            if (
                keys.arrowdown ||
                keys.s
            )
                state.player.y += 5;


            if (
                keys.arrowleft ||
                keys.a
            )
                state.player.x -= 5;


            if (
                keys.arrowright ||
                keys.d
            )
                state.player.x += 5;


            state.player.x =
                Math.max(
                    20,
                    Math.min(
                        880,
                        state.player.x
                    )
                );


            state.player.y =
                Math.max(
                    20,
                    Math.min(
                        500,
                        state.player.y
                    )
                );


            state.zombies.forEach(
                zombie => {

                    const dx =
                        state.player.x -
                        zombie.x;

                    const dy =
                        state.player.y -
                        zombie.y;

                    const distance =
                        Math.hypot(
                            dx,
                            dy
                        ) || 1;


                    zombie.x +=
                        dx /
                        distance *
                        speed;


                    zombie.y +=
                        dy /
                        distance *
                        speed;

                }
            );


            if (
                state.zombies.some(
                    zombie =>
                        Math.hypot(
                            zombie.x -
                            state.player.x,

                            zombie.y -
                            state.player.y
                        ) < 30
                )
            ) {

                finishGame(
                    false,
                    "🧟 A zombie caught you!"
                );

            }


            if (
                state.time > 600
            ) {

                finishGame(
                    true,
                    "🏆 You survived!"
                );

            }


            drawZombie();

        },
        30
    );


    drawZombie();

}


function drawZombie() {

    ctx.fillStyle =
        "#052e16";

    ctx.fillRect(
        0,
        0,
        900,
        520
    );


    ctx.fillStyle =
        "#38bdf8";


    ctx.beginPath();

    ctx.arc(
        state.player.x,
        state.player.y,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#ef4444";


    state.zombies.forEach(
        zombie => {

            ctx.beginPath();

            ctx.arc(
                zombie.x,
                zombie.y,
                20,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );


    setMessage(
        "Escape the zombies!"
    );

}


/* =========================================
   AI MAZE ESCAPE
========================================= */


function startMaze() {

    const rows = 10;

    const columns = 18;

    const cell = 50;


    state.maze =
        Array.from(
            {
                length: rows
            },
            () =>
                Array(columns).fill(0)
        );


    for (
        let r = 0;
        r < rows;
        r++
    ) {

        for (
            let c = 0;
            c < columns;
            c++
        ) {

            if (
                Math.random() < 0.22 &&
                !(r === 0 && c === 0) &&
                !(
                    r === rows - 1 &&
                    c === columns - 1
                )
            ) {

                state.maze[r][c] = 1;

            }

        }

    }


    state.player = {

        row: 0,

        col: 0

    };


    state.goal = {

        row: rows - 1,

        col: columns - 1

    };


    drawMaze();


    timer = setInterval(
        function () {

            if (
                keys.arrowup ||
                keys.w
            )
                moveMaze(-1, 0);


            if (
                keys.arrowdown ||
                keys.s
            )
                moveMaze(1, 0);


            if (
                keys.arrowleft ||
                keys.a
            )
                moveMaze(0, -1);


            if (
                keys.arrowright ||
                keys.d
            )
                moveMaze(0, 1);

        },
        100
    );


    setMessage(
        "Reach the green goal!"
    );

}


function moveMaze(
    rowChange,
    columnChange
) {

    const newRow =
        state.player.row +
        rowChange;


    const newColumn =
        state.player.col +
        columnChange;


    if (
        newRow < 0 ||
        newColumn < 0 ||
        newRow >= 10 ||
        newColumn >= 18
    ) {

        return;

    }


    if (
        state.maze[newRow][newColumn]
    ) {

        return;

    }


    state.player.row =
        newRow;


    state.player.col =
        newColumn;


    drawMaze();


    if (
        newRow === 9 &&
        newColumn === 17
    ) {

        finishGame(
            true,
            "🧩 Maze escaped!"
        );

    }

}


function drawMaze() {

    ctx.fillStyle =
        "#020617";

    ctx.fillRect(
        0,
        0,
        900,
        520
    );


    for (
        let r = 0;
        r < 10;
        r++
    ) {

        for (
            let c = 0;
            c < 18;
            c++
        ) {

            ctx.fillStyle =
                state.maze[r][c]
                ? "#475569"
                : "#0f172a";


            ctx.fillRect(
                c * 50,
                r * 50,
                48,
                48
            );

        }

    }


    ctx.fillStyle =
        "#22c55e";


    ctx.fillRect(
        17 * 50,
        9 * 50,
        48,
        48
    );


    ctx.fillStyle =
        "#38bdf8";


    ctx.beginPath();

    ctx.arc(
        state.player.col * 50 + 24,
        state.player.row * 50 + 24,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();

}