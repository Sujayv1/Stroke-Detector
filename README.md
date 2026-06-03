# AI Stroke Symptom Checker 🧠🩺

A complete, professional, rule-based expert system web application designed to raise stroke symptom awareness and instantly calculate stroke risk levels using medical criteria (F.A.S.T. framework).

Built with a light-weight Python Flask backend and a modern, high-fidelity responsive Tailwind CSS interface.

---

## 🌟 Key Features

* **Interactive Symptom Checklist**: Elegant glassmorphic click-to-select symptom cards equipped with beautiful icons and diagnostic helper tooltips.
* **Double-Beat Pulse Heartbeat**: Animated CSS-based beating medical heartbeat representing live patient diagnostics.
* **AI Diagnostics Scanning**: Shimmer-overlay animation that simulates clinical calculations before displaying the results.
* **Three-tier Assessment Card Alert States**:
  * 🔴 **Critical Attention (High Risk - Score >= 4)**: Bold flashing emergency alert encouraging immediate 911 calls.
  * 🟡 **Moderate Warning (Medium Risk - Score >= 2)**: Recommending swift consultation with healthcare professionals.
  * 🟢 **Low Risk (Score < 2)**: Reassuring advice with reminder to monitor health.
* **Assessment Breakdown**: Comprehensive analytical table generated dynamically upon assessment to show what values were evaluated.
* **"About the AI" Section**: Educational walkthrough comparing classical rule-based Expert Systems (IF-ELSE tree search) vs modern Machine Learning frameworks, complete with a clean interactive flow diagram.
* **Toast Notification System**: Dynamic micro-alerts popping up for successful form actions, checkbox toggles, and results.
* **Reset Functionality**: Smooth form reset wiping clean selected indicators and returning state to neutral.

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript, Font Awesome Icons, Google Fonts (Plus Jakarta Sans).
* **Backend**: Python 3, Flask.
* **Database**: None (State managed in-memory on client request payloads).

---

## 📁 Project Structure

```text
stroke-detector/
│
├── app.py                 # Core Flask backend server and rule-based diagnostic API
├── requirements.txt       # Python environment dependencies
├── README.md              # System documentation
│
├── templates/
│   └── index.html         # High-fidelity dashboard interface
│
└── static/
    ├── style.css          # Advanced glassmorphism classes, keyframe animations, & overrides
    └── script.js          # Interactive UI control logic, fetch requests, & toasts
```

---

## ⚡ Installation & Setup

Follow these simple steps to set up and run the application locally on your system.

### 1. Prerequisites
Ensure you have Python installed (Version 3.8 or above recommended). You can verify this by running:
```bash
python --version
```

### 2. Install Dependencies
Navigate to your project directory and install the required modules from the `requirements.txt` file:
```bash
pip install -r requirements.txt
```

### 3. Run the Application
Start the local Flask development web server directly:
```bash
python app.py
```

### 4. Open in Browser
Once running, open your web browser and navigate to:
```text
http://127.0.0.1:5000
```

---

## 🧠 AI Rule-Based System Concept

This application is an implementation of a **classical rule-based expert system**. Unlike modern probabilistic machine learning networks, this system uses clear, deterministic clinical logic designed after medical standard procedures.

### Decision Algorithm
```python
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

if score >= 4:
    result = "Possible Stroke Detected"
    risk_level = "high"
elif score >= 2:
    result = "Some stroke-related symptoms detected"
    risk_level = "medium"
else:
    result = "Low possibility of stroke"
    risk_level = "low"
```

---

## 🚨 Medical Disclaimer
This software is an AI demonstration rule system for educational and training purposes. It is **not** a substitute for professional clinical diagnosis, advice, or treatment. If you or someone you are with exhibits symptoms of a stroke, please contact your local emergency services (e.g. **108** or **112**) immediately.
