# dls.py

TANK_CAPACITY = 800

# Allowed water-level changes
ACTIONS = [
    200,
    400,
    600,
    800
]


def get_next_states(state):
    """
    Generate possible water levels from the current state.
    """

    states = []

    # Fill tank to different levels
    for level in ACTIONS:

        if level != state and level <= TANK_CAPACITY:
            states.append(
                (level, f"Fill tank to {level} L")
            )

    # Empty tank
    if state != 0:
        states.append(
            (0, "Empty tank")
        )

    # Add 200 L
    if state + 200 <= TANK_CAPACITY:
        states.append(
            (
                state + 200,
                f"Add 200 L → {state + 200} L"
            )
        )

    # Remove 200 L
    if state - 200 >= 0:
        states.append(
            (
                state - 200,
                f"Remove 200 L → {state - 200} L"
            )
        )

    return states


def depth_limited_search(initial, goal, depth_limit):

    visited = set()

    def dls(state, depth, path):

        # Goal reached
        if state == goal:
            return path

        # Depth limit reached
        if depth >= depth_limit:
            return None

        visited.add(state)

        # Generate next states
        for next_state, action in get_next_states(state):

            if next_state not in visited:

                result = dls(
                    next_state,
                    depth + 1,
                    path + [
                        (action, next_state)
                    ]
                )

                if result is not None:
                    return result

        return None

    return dls(
        initial,
        0,
        [
            ("Initial State", initial)
        ]
    )