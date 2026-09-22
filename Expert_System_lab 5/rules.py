# ============================================================
# PRACTICAL 5
# RULE BASED EXPERT SYSTEM
# ============================================================


# ============================================================
# KNOWLEDGE BASE
# ============================================================

RULES = [

    # --------------------------------------------------------
    # R1 - EMERGENCY
    # --------------------------------------------------------

    {
        "id": "R1",
        "name": "Emergency Pattern",
        "if_all": [
            "breathless",
            "chest_pain"
        ],
        "if_none": [],
        "condition": "Breathlessness + Chest Pain",
        "result": "Urgent Medical Attention",
        "level": "emergency",
        "advice": "Breathlessness together with chest pain requires urgent medical attention.",
        "treatment": [
            "Stop strenuous activity and rest.",
            "Seek urgent medical attention immediately.",
            "Do not ignore severe or worsening symptoms."
        ]
    },


    # --------------------------------------------------------
    # R2 - FLU LIKE PATTERN
    # --------------------------------------------------------

    {
        "id": "R2",
        "name": "Flu Like Pattern",
        "if_all": [
            "high_fever",
            "body_pain",
            "sudden_start"
        ],
        "if_none": [],
        "condition": "High Fever + Body Pain + Sudden Start",
        "result": "Flu Like Pattern",
        "level": "clinic",
        "advice": "The selected symptoms match a flu like pattern.",
        "treatment": [
            "Take adequate rest.",
            "Drink enough fluids.",
            "Monitor your temperature.",
            "Consider visiting a healthcare professional."
        ]
    },


    # --------------------------------------------------------
    # R3 - COMMON COLD
    # --------------------------------------------------------

    {
        "id": "R3",
        "name": "Common Cold Pattern",
        "if_all": [
            "runny_nose",
            "sneezing"
        ],
        "if_none": [
            "high_fever"
        ],
        "condition": "Runny Nose + Sneezing",
        "result": "Common Cold Pattern",
        "level": "self-care",
        "advice": "The selected symptoms match a common cold pattern.",
        "treatment": [
            "Take adequate rest.",
            "Drink warm fluids.",
            "Stay hydrated.",
            "Monitor whether additional symptoms develop."
        ]
    },


    # --------------------------------------------------------
    # R4 - SCREEN STRAIN
    # --------------------------------------------------------

    {
        "id": "R4",
        "name": "Screen Strain Pattern",
        "if_all": [
            "headache",
            "long_screen"
        ],
        "if_none": [
            "high_fever"
        ],
        "condition": "Headache + Long Screen Time",
        "result": "Possible Screen Strain",
        "level": "self-care",
        "advice": "The selected symptoms may be associated with screen strain.",
        "treatment": [
            "Take regular screen breaks.",
            "Rest your eyes.",
            "Stay hydrated.",
            "Adjust screen brightness and viewing distance."
        ]
    },


    # --------------------------------------------------------
    # R5 - THROAT IRRITATION
    # --------------------------------------------------------

    {
        "id": "R5",
        "name": "Throat Irritation Pattern",
        "if_all": [
            "sore_throat",
            "cough"
        ],
        "if_none": [
            "high_fever"
        ],
        "condition": "Sore Throat + Cough",
        "result": "Throat Irritation Pattern",
        "level": "self-care",
        "advice": "The selected symptoms match a throat irritation pattern.",
        "treatment": [
            "Drink enough fluids.",
            "Take adequate rest.",
            "Avoid smoke and other irritants.",
            "Monitor for worsening symptoms."
        ]
    }
]


# ============================================================
# INDIVIDUAL SYMPTOM KNOWLEDGE
# Ensures every symptom produces a result.
# ============================================================

SYMPTOM_RESULTS = {

    "high_fever": {
        "name": "High Fever",
        "result": "Fever Detected",
        "level": "monitor",
        "advice": "A high fever has been selected.",
        "treatment": [
            "Take adequate rest.",
            "Drink enough fluids.",
            "Monitor your temperature.",
            "Seek medical advice if the fever is persistent or severe."
        ]
    },

    "body_pain": {
        "name": "Body Pain",
        "result": "Body Pain Detected",
        "level": "monitor",
        "advice": "Body pain has been selected.",
        "treatment": [
            "Take adequate rest.",
            "Stay hydrated.",
            "Avoid excessive physical activity.",
            "Seek medical advice if the pain is severe or persistent."
        ]
    },

    "sudden_start": {
        "name": "Sudden Start",
        "result": "Sudden Symptom Onset",
        "level": "monitor",
        "advice": "The symptoms have been reported as starting suddenly.",
        "treatment": [
            "Monitor how quickly the symptoms develop.",
            "Take adequate rest.",
            "Stay hydrated.",
            "Seek medical advice if symptoms become severe."
        ]
    },

    "runny_nose": {
        "name": "Runny Nose",
        "result": "Runny Nose Detected",
        "level": "self-care",
        "advice": "A runny nose has been selected.",
        "treatment": [
            "Rest adequately.",
            "Drink enough fluids.",
            "Stay comfortable.",
            "Monitor whether additional symptoms develop."
        ]
    },

    "sneezing": {
        "name": "Sneezing",
        "result": "Sneezing Detected",
        "level": "self-care",
        "advice": "Sneezing has been selected.",
        "treatment": [
            "Get adequate rest.",
            "Stay hydrated.",
            "Avoid known irritants if applicable.",
            "Monitor for additional symptoms."
        ]
    },

    "breathless": {
        "name": "Breathlessness",
        "result": "Breathing Difficulty Detected",
        "level": "urgent",
        "advice": "Breathing difficulty should be taken seriously.",
        "treatment": [
            "Stop strenuous activity and rest.",
            "Do not ignore significant breathing difficulty.",
            "Seek urgent medical attention if it is severe, sudden or worsening."
        ]
    },

    "chest_pain": {
        "name": "Chest Pain",
        "result": "Chest Pain Detected",
        "level": "urgent",
        "advice": "Chest pain should not be ignored.",
        "treatment": [
            "Rest and avoid strenuous activity.",
            "Do not ignore severe or persistent chest pain.",
            "Seek urgent medical attention, especially if accompanied by breathlessness."
        ]
    },

    "headache": {
        "name": "Headache",
        "result": "Headache Detected",
        "level": "self-care",
        "advice": "A headache has been selected.",
        "treatment": [
            "Rest in a comfortable environment.",
            "Drink enough water.",
            "Take regular breaks from screens.",
            "Seek medical advice if the headache is severe or persistent."
        ]
    },

    "long_screen": {
        "name": "Long Screen Time",
        "result": "Possible Screen Strain",
        "level": "self-care",
        "advice": "Extended screen time has been selected.",
        "treatment": [
            "Take regular screen breaks.",
            "Rest your eyes.",
            "Adjust screen brightness and viewing distance.",
            "Stay hydrated."
        ]
    },

    "sore_throat": {
        "name": "Sore Throat",
        "result": "Sore Throat Detected",
        "level": "self-care",
        "advice": "A sore throat has been selected.",
        "treatment": [
            "Drink enough fluids.",
            "Take adequate rest.",
            "Prefer comfortable warm or cool fluids.",
            "Monitor for fever or worsening symptoms."
        ]
    },

    "cough": {
        "name": "Cough",
        "result": "Cough Detected",
        "level": "self-care",
        "advice": "A cough has been selected.",
        "treatment": [
            "Stay hydrated.",
            "Take adequate rest.",
            "Avoid smoke and other irritants.",
            "Seek medical advice if the cough is severe or persistent."
        ]
    }
}


# ============================================================
# INFERENCE ENGINE
# ============================================================

def infer(selected_symptoms):

    selected = set(selected_symptoms)

    # Priority:
    # Lower number = higher priority

    priority = {
        "emergency": 1,
        "urgent": 2,
        "clinic": 3,
        "monitor": 4,
        "self-care": 5
    }


    # ========================================================
    # STEP 1
    # CHECK MULTI-SYMPTOM RULES
    # ========================================================

    matched_rules = []

    for rule in RULES:

        required = set(rule["if_all"])
        forbidden = set(rule["if_none"])

        # Check IF conditions
        if not required.issubset(selected):
            continue

        # Check NOT conditions
        if forbidden.intersection(selected):
            continue

        matched_rules.append(rule)


    # ========================================================
    # STEP 2
    # IF RULE MATCHES
    # ========================================================

    if matched_rules:

        matched_rules.sort(
            key=lambda rule:
            priority.get(rule["level"], 99)
        )

        best = matched_rules[0]

        return {
            "type": "rule",
            "level": best["level"],
            "result": best["result"],
            "advice": best["advice"],
            "treatment": best["treatment"],
            "condition": best["condition"],
            "rules": [
                rule["id"]
                for rule in matched_rules
            ],
            "reasoning":
                f"{best['id']} fired because all required "
                f"conditions were satisfied and no forbidden "
                f"condition was present."
        }


    # ========================================================
    # STEP 3
    # INDIVIDUAL SYMPTOM ANALYSIS
    # ========================================================

    individual_results = []

    for symptom in selected:

        if symptom in SYMPTOM_RESULTS:

            individual_results.append({
                "id": symptom,
                **SYMPTOM_RESULTS[symptom]
            })


    # ========================================================
    # STEP 4
    # SELECT HIGHEST PRIORITY SYMPTOM
    # ========================================================

    if individual_results:

        individual_results.sort(
            key=lambda item:
            priority.get(item["level"], 99)
        )

        best = individual_results[0]

        return {
            "type": "individual",
            "level": best["level"],
            "result": best["result"],
            "advice": best["advice"],
            "treatment": best["treatment"],
            "condition": best["name"],
            "rules": [],
            "reasoning":
                "No complete combination rule matched. "
                "The inference engine analyzed the selected "
                "symptom individually."
        }


    # ========================================================
    # STEP 5
    # NO INPUT
    # ========================================================

    return {
        "type": "unknown",
        "level": "unknown",
        "result": "No Result",
        "advice": "Please select at least one symptom.",
        "treatment": [],
        "condition": "None",
        "rules": [],
        "reasoning":
            "No valid symptom was provided."
    }