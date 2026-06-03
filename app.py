import os
from flask import Flask, render_template, request, jsonify

# Initialize the Flask application
app = Flask(__name__)

# Make sure template and static folder configurations are handled properly if needed
# By default, Flask looks for templates in templates/ and static files in static/

@app.route('/')
def home():
    """
    Renders the main diagnostic dashboard for the Stroke Symptom Checker.
    """
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    API endpoint that receives symptom inputs, calculates a risk score based on
    a rule-based expert system, and returns the risk level and clinical advice.
    """
    try:
        data = request.get_json() or {}
        
        # Extract individual symptoms from JSON request (expected values: 'yes' or 'no')
        face = data.get('face', 'no').lower()
        arm = data.get('arm', 'no').lower()
        speech = data.get('speech', 'no').lower()
        confusion = data.get('confusion', 'no').lower()
        walking = data.get('walking', 'no').lower()
        headache = data.get('headache', 'no').lower()
        
        # Rule-Based Expert System Logic
        score = 0
        
        if face == "yes":
            score += 1
            
        if arm == "yes":
            score += 1
            
        if speech == "yes":
            score += 1
            
        if confusion == "yes":
            score += 1
            
        if walking == "yes":
            score += 1
            
        if headache == "yes":
            score += 1
            
        # Determine the warning category, diagnostic description, and next steps
        if score >= 4:
            result = "Possible Stroke Detected"
            risk_level = "high"
            advice = "Seek immediate medical attention! Call emergency services (e.g., 112 or your local emergency number) immediately. Every second counts."
        elif score >= 2:
            result = "Some stroke-related symptoms detected"
            risk_level = "medium"
            advice = "Multiple potential stroke warning signs are present. Please contact a healthcare professional or visit an urgent care center promptly."
        else:
            result = "Low possibility of stroke"
            risk_level = "low"
            advice = "Although the checklist score is low, always monitor your health. If you feel unwell or experience sudden changes, consult a physician."
            
        # Return structured JSON response to the client
        return jsonify({
            "success": True,
            "score": score,
            "result": result,
            "risk_level": risk_level,
            "advice": advice,
            "symptoms_checked": {
                "face_drooping": face == "yes",
                "arm_weakness": arm == "yes",
                "speech_difficulty": speech == "yes",
                "sudden_confusion": confusion == "yes",
                "trouble_walking": walking == "yes",
                "severe_headache": headache == "yes"
            }
        })
        
    except Exception as e:
        # Gracefully handle unexpected formatting or parse errors
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to calculate symptom score. Please check the integrity of input parameters."
        }), 400

if __name__ == '__main__':
    # Start local Flask development server
    print("----------------------------------------------------------------")
    print("Starting AI Stroke Symptom Checker local web server...")
    print("Access the interface locally at: http://127.0.0.1:5000")
    print("----------------------------------------------------------------")
    app.run(debug=True, host='127.0.0.1', port=5000)
