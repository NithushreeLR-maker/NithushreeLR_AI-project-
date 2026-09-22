from flask import Flask, render_template, request, jsonify
import heapq
import time

app = Flask(__name__)

# ==========================================================
# A* VISUAL LAB
# Practical 3: A* and Two Heuristics
# ==========================================================

GOAL = (1, 2, 3,
        4, 5, 6,
        7, 8, 0)


# ==========================================================
# HEURISTIC 1
# MISPLACED TILES
# ==========================================================

def misplaced_tiles(state):
    """
    Counts tiles that are not in their correct position.
    Blank tile is ignored.
    """

    count = 0

    for i, value in enumerate(state):

        if value != 0 and value != GOAL[i]:
            count += 1

    return count


# ==========================================================
# HEURISTIC 2
# MANHATTAN DISTANCE
# ==========================================================

def manhattan_distance(state):
    """
    Calculates the total Manhattan distance
    of all tiles from their goal positions.
    """

    total = 0

    for index, value in enumerate(state):

        if value == 0:
            continue

        current_row, current_col = divmod(index, 3)

        goal_index = GOAL.index(value)

        goal_row, goal_col = divmod(goal_index, 3)

        total += abs(current_row - goal_row)
        total += abs(current_col - goal_col)

    return total


# ==========================================================
# GENERATE NEIGHBOURS
# ==========================================================

def get_neighbors(state):

    board = list(state)

    blank_index = board.index(0)

    row, col = divmod(blank_index, 3)

    directions = [
        (-1, 0),  # Up
        (1, 0),   # Down
        (0, -1),  # Left
        (0, 1)    # Right
    ]

    neighbors = []

    for dr, dc in directions:

        new_row = row + dr
        new_col = col + dc

        if 0 <= new_row < 3 and 0 <= new_col < 3:

            new_index = new_row * 3 + new_col

            new_board = board.copy()

            new_board[blank_index], new_board[new_index] = (
                new_board[new_index],
                new_board[blank_index]
            )

            neighbors.append(tuple(new_board))

    return neighbors


# ==========================================================
# SOLVABILITY CHECK
# ==========================================================

def is_solvable(state):

    values = [
        value for value in state
        if value != 0
    ]

    inversions = 0

    for i in range(len(values)):

        for j in range(i + 1, len(values)):

            if values[i] > values[j]:
                inversions += 1

    return inversions % 2 == 0


# ==========================================================
# A* SEARCH
# ==========================================================

def a_star(start, heuristic):

    start_time = time.perf_counter()

    # Priority queue
    # (f, g, state)
    open_heap = [
        (heuristic(start), 0, start)
    ]

    best_g = {
        start: 0
    }

    parent = {}

    visited = set()

    expanded = 0

    while open_heap:

        f, g, current = heapq.heappop(open_heap)

        if current in visited:
            continue

        visited.add(current)

        expanded += 1

        # Goal reached
        if current == GOAL:

            path = [current]

            while current in parent:

                current = parent[current]

                path.append(current)

            path.reverse()

            end_time = time.perf_counter()

            return {
                "path": path,
                "moves": len(path) - 1,
                "expanded": expanded,
                "time": round(
                    (end_time - start_time) * 1000,
                    3
                ),
                "initial_h": heuristic(start)
            }

        # Generate neighbours
        for neighbor in get_neighbors(current):

            new_g = g + 1

            if new_g < best_g.get(
                neighbor,
                float("inf")
            ):

                best_g[neighbor] = new_g

                parent[neighbor] = current

                new_f = (
                    new_g +
                    heuristic(neighbor)
                )

                heapq.heappush(
                    open_heap,
                    (
                        new_f,
                        new_g,
                        neighbor
                    )
                )

    return None


# ==========================================================
# CONVERT PATH FOR FRONTEND
# ==========================================================

def prepare_path(path):

    result = []

    for state in path:

        result.append(list(state))

    return result


# ==========================================================
# HOME PAGE
# ==========================================================

@app.route("/")
def index():

    return render_template(
        "index.html"
    )


# ==========================================================
# SOLVE API
# ==========================================================

@app.route("/solve", methods=["POST"])
def solve():

    data = request.get_json()

    puzzle = data.get("puzzle")

    selected = data.get(
        "heuristic",
        "both"
    )

    try:

        puzzle = tuple(
            int(x)
            for x in puzzle
        )

    except:

        return jsonify({
            "success": False,
            "message":
                "Invalid puzzle values."
        })

    # Validate puzzle
    if len(puzzle) != 9:

        return jsonify({
            "success": False,
            "message":
                "Puzzle must contain 9 values."
        })

    if set(puzzle) != set(range(9)):

        return jsonify({
            "success": False,
            "message":
                "Use every number from 0 to 8 exactly once."
        })

    # Check solvability
    if not is_solvable(puzzle):

        return jsonify({
            "success": False,
            "message":
                "This puzzle is not solvable. Try another arrangement."
        })

    heuristic_list = []

    if selected in ("misplaced", "both"):

        heuristic_list.append(
            (
                "Misplaced Tiles",
                misplaced_tiles
            )
        )

    if selected in ("manhattan", "both"):

        heuristic_list.append(
            (
                "Manhattan Distance",
                manhattan_distance
            )
        )

    results = []

    for name, heuristic in heuristic_list:

        result = a_star(
            puzzle,
            heuristic
        )

        results.append({

            "name": name,

            "moves": result["moves"],

            "expanded": result["expanded"],

            "time": result["time"],

            "initial_h":
                result["initial_h"],

            "path":
                prepare_path(
                    result["path"]
                )

        })

    return jsonify({

        "success": True,

        "results": results

    })


# ==========================================================
# RUN APPLICATION
# ==========================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )