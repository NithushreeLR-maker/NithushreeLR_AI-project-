from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

EMPTY = ""
HUMAN = "O"
AI = "X"


# ============================================================
# WINNER CHECK
# ============================================================

def check_winner(board):
    winning_combinations = [
        (0, 1, 2),
        (3, 4, 5),
        (6, 7, 8),
        (0, 3, 6),
        (1, 4, 7),
        (2, 5, 8),
        (0, 4, 8),
        (2, 4, 6)
    ]

    for a, b, c in winning_combinations:
        if (
            board[a] != EMPTY
            and board[a] == board[b]
            and board[b] == board[c]
        ):
            return board[a]

    if EMPTY not in board:
        return "draw"

    return None


# ============================================================
# MINIMAX
# ============================================================

def minimax(board, is_maximizing, stats, depth=0):

    stats["nodes"] += 1

    result = check_winner(board)

    if result == AI:
        return 10 - depth

    if result == HUMAN:
        return depth - 10

    if result == "draw":
        return 0

    if is_maximizing:

        best_score = float("-inf")

        for i in range(9):

            if board[i] == EMPTY:

                board[i] = AI

                score = minimax(
                    board,
                    False,
                    stats,
                    depth + 1
                )

                board[i] = EMPTY

                best_score = max(best_score, score)

        return best_score

    else:

        best_score = float("inf")

        for i in range(9):

            if board[i] == EMPTY:

                board[i] = HUMAN

                score = minimax(
                    board,
                    True,
                    stats,
                    depth + 1
                )

                board[i] = EMPTY

                best_score = min(best_score, score)

        return best_score


# ============================================================
# ALPHA BETA PRUNING
# ============================================================

def alphabeta(
    board,
    is_maximizing,
    alpha,
    beta,
    stats,
    depth=0
):

    stats["nodes"] += 1

    result = check_winner(board)

    if result == AI:
        return 10 - depth

    if result == HUMAN:
        return depth - 10

    if result == "draw":
        return 0

    if is_maximizing:

        best_score = float("-inf")

        for i in range(9):

            if board[i] == EMPTY:

                board[i] = AI

                score = alphabeta(
                    board,
                    False,
                    alpha,
                    beta,
                    stats,
                    depth + 1
                )

                board[i] = EMPTY

                best_score = max(
                    best_score,
                    score
                )

                alpha = max(alpha, best_score)

                # Alpha Beta cutoff
                if alpha >= beta:
                    stats["pruned"] += 1
                    break

        return best_score

    else:

        best_score = float("inf")

        for i in range(9):

            if board[i] == EMPTY:

                board[i] = HUMAN

                score = alphabeta(
                    board,
                    True,
                    alpha,
                    beta,
                    stats,
                    depth + 1
                )

                board[i] = EMPTY

                best_score = min(
                    best_score,
                    score
                )

                beta = min(beta, best_score)

                # Alpha Beta cutoff
                if alpha >= beta:
                    stats["pruned"] += 1
                    break

        return best_score


# ============================================================
# FIND BEST MOVE
# ============================================================

def find_best_move(board, algorithm):

    best_move = None
    best_score = float("-inf")

    stats = {
        "nodes": 0,
        "pruned": 0
    }

    for i in range(9):

        if board[i] == EMPTY:

            board[i] = AI

            if algorithm == "minimax":

                score = minimax(
                    board,
                    False,
                    stats
                )

            else:

                score = alphabeta(
                    board,
                    False,
                    float("-inf"),
                    float("inf"),
                    stats
                )

            board[i] = EMPTY

            if score > best_score:

                best_score = score
                best_move = i

    return {
        "move": best_move,
        "score": best_score,
        "nodes": stats["nodes"],
        "pruned": stats["pruned"]
    }


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def home():
    return render_template("index.html")


# ============================================================
# AI MOVE API
# ============================================================

@app.route("/ai-move", methods=["POST"])
def ai_move():

    data = request.get_json()

    board = data.get("board", [])
    algorithm = data.get("algorithm", "alphabeta")

    if len(board) != 9:
        return jsonify({
            "error": "Invalid board"
        }), 400

    result = find_best_move(
        board,
        algorithm
    )

    return jsonify(result)


# ============================================================
# COMPARE MINIMAX AND ALPHA BETA
# ============================================================

@app.route("/compare", methods=["POST"])
def compare():

    data = request.get_json()

    board = data.get("board", [])

    if len(board) != 9:

        return jsonify({
            "error": "Invalid board"
        }), 400

    minimax_result = find_best_move(
        board.copy(),
        "minimax"
    )

    alphabeta_result = find_best_move(
        board.copy(),
        "alphabeta"
    )

    minimax_nodes = minimax_result["nodes"]
    alphabeta_nodes = alphabeta_result["nodes"]

    if minimax_nodes > 0:

        reduction = (
            (minimax_nodes - alphabeta_nodes)
            / minimax_nodes
        ) * 100

    else:
        reduction = 0

    return jsonify({

        "minimax": minimax_result,

        "alphabeta": alphabeta_result,

        "same_move":
            minimax_result["move"]
            == alphabeta_result["move"],

        "same_score":
            minimax_result["score"]
            == alphabeta_result["score"],

        "reduction":
            round(reduction, 2)
    })


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )