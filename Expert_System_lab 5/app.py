from flask import Flask, render_template, request
from rules import infer, RULES

app = Flask(__name__)


# ============================================================
# SYMPTOM DATABASE
# ============================================================

SYMPTOMS = [

    {
        "value": "high_fever",
        "name": "High Fever",
        "icon": "🌡️",
        "category": "General"
    },

    {
        "value": "body_pain",
        "name": "Body Pain",
        "icon": "💢",
        "category": "General"
    },

    {
        "value": "sudden_start",
        "name": "Sudden Start",
        "icon": "⚡",
        "category": "General"
    },

    {
        "value": "runny_nose",
        "name": "Runny Nose",
        "icon": "💧",
        "category": "Cold"
    },

    {
        "value": "sneezing",
        "name": "Sneezing",
        "icon": "🤧",
        "category": "Cold"
    },

    {
        "value": "breathless",
        "name": "Breathlessness",
        "icon": "🫁",
        "category": "Urgent"
    },

    {
        "value": "chest_pain",
        "name": "Chest Pain",
        "icon": "❤️",
        "category": "Urgent"
    },

    {
        "value": "headache",
        "name": "Headache",
        "icon": "🧠",
        "category": "Screen"
    },

    {
        "value": "long_screen",
        "name": "Long Screen Time",
        "icon": "💻",
        "category": "Screen"
    },

    {
        "value": "sore_throat",
        "name": "Sore Throat",
        "icon": "🗣️",
        "category": "Throat"
    },

    {
        "value": "cough",
        "name": "Cough",
        "icon": "😷",
        "category": "Throat"
    }
]


# ============================================================
# HOME ROUTE
# ============================================================

@app.route("/", methods=["GET", "POST"])
def home():

    result = None
    selected = []

    if request.method == "POST":

        selected = request.form.getlist("symptoms")

        if selected:
            result = infer(selected)

    return render_template(
        "index.html",
        symptoms=SYMPTOMS,
        rules=RULES,
        selected=selected,
        result=result
    )


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":
    app.run(debug=True)