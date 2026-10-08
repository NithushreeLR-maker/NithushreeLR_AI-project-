from flask import Flask, render_template, request, jsonify
import heapq

app = Flask(__name__)


# ============================================================
# ENVIRONMENT
# ============================================================

GRAPH = {
    "WAREHOUSE": {
        "A": 2,
        "B": 3,
        "C": 4,
        "D": 5
    },

    "A": {
        "WAREHOUSE": 2,
        "S1": 2,
        "S2": 3
    },

    "B": {
        "WAREHOUSE": 3,
        "S2": 2,
        "S3": 2
    },

    "C": {
        "WAREHOUSE": 4,
        "S3": 2,
        "S4": 2
    },

    "D": {
        "WAREHOUSE": 5,
        "S4": 2,
        "S5": 2
    },

    "S1": {
        "A": 2,
        "S2": 1,
        "H1": 2,
        "H2": 3
    },

    "S2": {
        "A": 3,
        "B": 2,
        "S1": 1,
        "S3": 1,
        "H2": 2,
        "H3": 3
    },

    "S3": {
        "B": 2,
        "C": 2,
        "S2": 1,
        "S4": 1,
        "H3": 2,
        "H4": 3
    },

    "S4": {
        "C": 2,
        "D": 2,
        "S3": 1,
        "S5": 1,
        "H4": 2,
        "H5": 3
    },

    "S5": {
        "D": 2,
        "S4": 1,
        "H5": 2
    },

    "H1": {
        "S1": 2
    },

    "H2": {
        "S1": 3,
        "S2": 2
    },

    "H3": {
        "S2": 3,
        "S3": 2
    },

    "H4": {
        "S3": 3,
        "S4": 2
    },

    "H5": {
        "S4": 3,
        "S5": 2
    }
}


NAMES = {
    "WAREHOUSE": "Main Warehouse",

    "A": "Sub Warehouse A",
    "B": "Sub Warehouse B",
    "C": "Sub Warehouse C",
    "D": "Sub Warehouse D",

    "S1": "Society 1",
    "S2": "Society 2",
    "S3": "Society 3",
    "S4": "Society 4",
    "S5": "Society 5",

    "H1": "House 1",
    "H2": "House 2",
    "H3": "House 3",
    "H4": "House 4",
    "H5": "House 5"
}


POSITIONS = {
    "WAREHOUSE": (50, 9),

    "A": (15, 29),
    "B": (38, 29),
    "C": (62, 29),
    "D": (85, 29),

    "S1": (10, 52),
    "S2": (30, 52),
    "S3": (50, 52),
    "S4": (70, 52),
    "S5": (90, 52),

    "H1": (10, 82),
    "H2": (30, 82),
    "H3": (50, 82),
    "H4": (70, 82),
    "H5": (90, 82)
}


# ============================================================
# STRIPS ACTIONS
# ============================================================

def move_action(robot, destination, cost):
    return {
        "action": "MOVE",
        "from": robot,
        "to": destination,
        "cost": cost,
        "text": f"Move Robot → {NAMES[destination]}"
    }


def pick_action(location):
    return {
        "action": "PICK",
        "from": location,
        "to": location,
        "cost": 0,
        "text": f"Pick Product at {NAMES[location]}"
    }


def deliver_action(house):
    return {
        "action": "DELIVER",
        "from": house,
        "to": house,
        "cost": 0,
        "text": f"Deliver Product → {NAMES[house]}"
    }


# ============================================================
# UCS
# ============================================================

def uniform_cost_search(product_location, goal_house):

    # State:
    #
    # robot_location
    # product_location
    # delivered
    #
    # Example:
    #
    # ("WAREHOUSE", "WAREHOUSE", False)

    start = (
        "WAREHOUSE",
        product_location,
        False
    )

    goal = (
        goal_house,
        goal_house,
        True
    )

    priority_queue = []

    counter = 0

    heapq.heappush(
        priority_queue,
        (0, counter, start)
    )

    cost_so_far = {
        start: 0
    }

    parent = {
        start: None
    }

    actions = {
        start: None
    }

    expanded = []

    while priority_queue:

        current_cost, _, current = heapq.heappop(
            priority_queue
        )

        if current_cost != cost_so_far[current]:
            continue

        robot, product, delivered = current

        expanded.append({
            "state": current,
            "cost": current_cost
        })

        # Goal check
        if current == goal:
            break

        # ----------------------------------------------------
        # MOVE
        # ----------------------------------------------------

        for next_location, move_cost in GRAPH[robot].items():

            new_state = (
                next_location,
                product,
                delivered
            )

            new_cost = current_cost + move_cost

            if new_cost < cost_so_far.get(
                new_state,
                float("inf")
            ):

                cost_so_far[new_state] = new_cost

                parent[new_state] = current

                actions[new_state] = move_action(
                    robot,
                    next_location,
                    move_cost
                )

                counter += 1

                heapq.heappush(
                    priority_queue,
                    (
                        new_cost,
                        counter,
                        new_state
                    )
                )

        # ----------------------------------------------------
        # PICK
        # ----------------------------------------------------

        if (
            product != "ROBOT"
            and not delivered
            and robot == product
        ):

            new_state = (
                robot,
                "ROBOT",
                False
            )

            new_cost = current_cost

            if new_cost < cost_so_far.get(
                new_state,
                float("inf")
            ):

                cost_so_far[new_state] = new_cost

                parent[new_state] = current

                actions[new_state] = pick_action(
                    robot
                )

                counter += 1

                heapq.heappush(
                    priority_queue,
                    (
                        new_cost,
                        counter,
                        new_state
                    )
                )

        # ----------------------------------------------------
        # DELIVER
        # ----------------------------------------------------

        if (
            product == "ROBOT"
            and robot == goal_house
            and not delivered
        ):

            new_state = (
                goal_house,
                goal_house,
                True
            )

            new_cost = current_cost

            if new_cost < cost_so_far.get(
                new_state,
                float("inf")
            ):

                cost_so_far[new_state] = new_cost

                parent[new_state] = current

                actions[new_state] = deliver_action(
                    goal_house
                )

                counter += 1

                heapq.heappush(
                    priority_queue,
                    (
                        new_cost,
                        counter,
                        new_state
                    )
                )

    # ========================================================
    # RECONSTRUCT PATH
    # ========================================================

    if goal not in parent:
        return None

    path_states = []
    path_actions = []

    current = goal

    while current is not None:

        path_states.append(current)

        if actions[current] is not None:
            path_actions.append(actions[current])

        current = parent[current]

    path_states.reverse()
    path_actions.reverse()

    return {
        "total_cost": cost_so_far[goal],
        "states": path_states,
        "actions": path_actions,
        "expanded": expanded
    }


# ============================================================
# ROUTES
# ============================================================

@app.route("/")
def home():

    return render_template(
        "index.html",
        names=NAMES,
        positions=POSITIONS
    )


@app.route("/solve", methods=["POST"])
def solve():

    data = request.get_json()

    product_location = data.get(
        "product_location",
        "WAREHOUSE"
    )

    goal_house = data.get(
        "goal_house",
        "H2"
    )

    if product_location not in GRAPH:
        return jsonify({
            "error": "Invalid product location"
        }), 400

    if goal_house not in [
        "H1",
        "H2",
        "H3",
        "H4",
        "H5"
    ]:
        return jsonify({
            "error": "Invalid destination"
        }), 400

    result = uniform_cost_search(
        product_location,
        goal_house
    )

    if result is None:
        return jsonify({
            "error": "No path found"
        }), 404

    return jsonify({
        "algorithm": "Uniform Cost Search",
        "planning": "STRIPS",
        "start": "WAREHOUSE",
        "product_location": product_location,
        "goal": goal_house,
        "total_cost": result["total_cost"],
        "states": result["states"],
        "actions": result["actions"],
        "expanded": result["expanded"]
    })


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )