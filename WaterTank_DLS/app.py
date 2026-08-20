from flask import Flask, render_template, request
from dls import depth_limited_search

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def home():

    result = None
    error = None

    initial = 0
    goal = 800
    depth = 5

    if request.method == "POST":

        try:
            initial = int(request.form["initial"])
            goal = int(request.form["goal"])
            depth = int(request.form["depth"])

            if not 0 <= initial <= 800:
                raise ValueError("Initial level must be between 0 and 800 L.")

            if not 0 <= goal <= 800:
                raise ValueError("Goal level must be between 0 and 800 L.")

            if depth < 1:
                raise ValueError("Depth must be greater than 0.")

            path = depth_limited_search(
                initial,
                goal,
                depth
            )

            if path:

                # Convert DLS path into only water levels
                water_levels = [
                    state for action, state in path
                ]

                result = {
                    "success": True,
                    "path": path,
                    "water_levels": water_levels,
                    "steps": len(path) - 1
                }

            else:

                result = {
                    "success": False,
                    "path": [],
                    "water_levels": [],
                    "steps": 0
                }

        except ValueError as e:

            error = str(e)

    return render_template(
        "index.html",
        result=result,
        error=error,
        initial=initial,
        goal=goal,
        depth=depth
    )


if __name__ == "__main__":
    app.run(debug=True)