document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Core Elements Retrieval
    // -------------------------------------------------------------
    const symptomCards = document.querySelectorAll('.symptom-card');
    const symptomForm = document.getElementById('symptom-form');
    const resetBtn = document.getElementById('reset-btn');
    const scanningLoader = document.getElementById('scanning-loader');
    const resultSection = document.getElementById('result-section');
    
    const resultHigh = document.getElementById('result-high');
    const resultMedium = document.getElementById('result-medium');
    const resultLow = document.getElementById('result-low');
    
    const resultTitleHigh = document.getElementById('result-title-high');
    const resultDescHigh = document.getElementById('result-desc-high');
    const resultTitleMedium = document.getElementById('result-title-medium');
    const resultDescMedium = document.getElementById('result-desc-medium');
    const resultTitleLow = document.getElementById('result-title-low');
    const resultDescLow = document.getElementById('result-desc-low');
    
    const breakdownContainer = document.getElementById('symptom-breakdown-container');
    const toastContainer = document.getElementById('toast-container');

    // -------------------------------------------------------------
    // Card Selection Toggle Handler
    // -------------------------------------------------------------
    symptomCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        const statusLabel = card.querySelector('.status-label');
        
        // Setup initial card state
        if (checkbox.checked) {
            card.classList.add('symptom-card-active');
            statusLabel.textContent = "Symptom Checked";
            statusLabel.classList.remove('text-slate-400');
            statusLabel.classList.add('text-medical-600', 'font-extrabold');
        }

        // Toggle state on click of the parent card container
        card.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            toggleCardVisualState(card, checkbox, statusLabel);
        });

        // Toggle state on checkbox check change directly
        checkbox.addEventListener('change', (e) => {
            toggleCardVisualState(card, checkbox, statusLabel);
        });
    });

    function toggleCardVisualState(card, checkbox, label) {
        if (checkbox.checked) {
            card.classList.add('symptom-card-active');
            label.textContent = "Symptom Checked";
            label.classList.remove('text-slate-400');
            label.classList.add('text-medical-600', 'font-extrabold');
            showToast('info', `Checked: ${card.querySelector('h3').textContent}`);
        } else {
            card.classList.remove('symptom-card-active');
            label.textContent = "No Symptom";
            label.classList.add('text-slate-400');
            label.classList.remove('text-medical-600', 'font-extrabold');
        }
    }

    // -------------------------------------------------------------
    // Submit Checklist & Rule-Based Prediction Trigger
    // -------------------------------------------------------------
    symptomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve checkbox elements
        const faceVal = document.getElementById('face').checked ? 'yes' : 'no';
        const armVal = document.getElementById('arm').checked ? 'yes' : 'no';
        const speechVal = document.getElementById('speech').checked ? 'yes' : 'no';
        const confusionVal = document.getElementById('confusion').checked ? 'yes' : 'no';
        const walkingVal = document.getElementById('walking').checked ? 'yes' : 'no';
        const headacheVal = document.getElementById('headache').checked ? 'yes' : 'no';

        // Prepare symptoms payload
        const payload = {
            face: faceVal,
            arm: armVal,
            speech: speechVal,
            confusion: confusionVal,
            walking: walkingVal,
            headache: headacheVal
        };

        // Hide previous predictions & display high-quality scanning loader
        hideResultCards();
        resultSection.classList.add('hidden');
        scanningLoader.classList.remove('hidden');
        
        // Smooth scroll to loader
        scanningLoader.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Simulate modern diagnosis delay to demonstrate rule analysis
        setTimeout(() => {
            fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Server returned an error status while scoring.');
                }
                return res.json();
            })
            .then(data => {
                scanningLoader.classList.add('hidden');
                
                if (data.success) {
                    renderPredictionResults(data);
                } else {
                    showToast('error', data.message || 'Verification logic encountered an error.');
                }
            })
            .catch(err => {
                scanningLoader.classList.add('hidden');
                showToast('error', 'Network or connection error. Make sure the server runs.');
                console.error(err);
            });
        }, 1500);
    });

    // -------------------------------------------------------------
    // Display Output Cards based on risk level
    // -------------------------------------------------------------
    function renderPredictionResults(data) {
        hideResultCards();
        resultSection.classList.remove('hidden');

        const { score, result, risk_level, advice, symptoms_checked } = data;

        // Display targeted Risk Card
        if (risk_level === 'high') {
            resultHigh.classList.remove('hidden');
            resultTitleHigh.textContent = `⚠ ${result}`;
            resultDescHigh.textContent = advice;
            showToast('error', 'High stroke risk score alert! Seek urgent medical attention.');
        } else if (risk_level === 'medium') {
            resultMedium.classList.remove('hidden');
            resultTitleMedium.textContent = result;
            resultDescMedium.textContent = advice;
            showToast('info', 'Moderate symptoms detected. Schedule medical checkup.');
        } else {
            resultLow.classList.remove('hidden');
            resultTitleLow.textContent = result;
            resultDescLow.textContent = advice;
            showToast('success', 'Low stroke checklist score registered.');
        }

        // Render assessment breakdown checklist
        renderAssessmentBreakdown(symptoms_checked);

        // Smooth scroll result card into view
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function renderAssessmentBreakdown(symptoms) {
        breakdownContainer.innerHTML = '';

        const symptomMap = [
            { key: 'face_drooping', name: 'Face Drooping', desc: 'Uneven or sagging smile lines.' },
            { key: 'arm_weakness', name: 'Arm Weakness', desc: 'Loss of strength or control in one arm.' },
            { key: 'speech_difficulty', name: 'Speech Difficulty', desc: 'Slurred voice or trouble selecting expressions.' },
            { key: 'sudden_confusion', name: 'Sudden Confusion', desc: 'Sudden memory lapses or general mental fog.' },
            { key: 'trouble_walking', name: 'Trouble Walking', desc: 'Loss of balance, coordination, or persistent vertigo.' },
            { key: 'severe_headache', name: 'Severe Headache', desc: 'Extremely sudden severe head pain.' }
        ];

        symptomMap.forEach(item => {
            const isPositive = symptoms[item.key];
            const itemEl = document.createElement('div');
            itemEl.className = `flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold ${
                isPositive 
                    ? 'bg-rose-50 border-rose-200 text-rose-800' 
                    : 'bg-slate-50 border-slate-100 text-slate-600'
            }`;

            itemEl.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center ${
                        isPositive ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-400'
                    }">
                        <i class="fa-solid ${isPositive ? 'fa-triangle-exclamation' : 'fa-check'}"></i>
                    </div>
                    <div>
                        <span class="block font-bold">${item.name}</span>
                        <span class="block text-[10px] text-slate-400 mt-0.5 font-normal">${item.desc}</span>
                    </div>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${
                    isPositive ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-500'
                }">
                    ${isPositive ? 'Detected (yes)' : 'Clear (no)'}
                </span>
            `;
            breakdownContainer.appendChild(itemEl);
        });
    }

    function hideResultCards() {
        resultHigh.classList.add('hidden');
        resultMedium.classList.add('hidden');
        resultLow.classList.add('hidden');
    }

    // -------------------------------------------------------------
    // Reset Checker Form
    // -------------------------------------------------------------
    resetBtn.addEventListener('click', () => {
        symptomForm.reset();
        
        symptomCards.forEach(card => {
            card.classList.remove('symptom-card-active');
            const label = card.querySelector('.status-label');
            label.textContent = "No Symptom";
            label.classList.add('text-slate-400');
            label.classList.remove('text-medical-600', 'font-extrabold');
        });

        hideResultCards();
        resultSection.classList.add('hidden');
        scanningLoader.classList.add('hidden');

        showToast('info', 'Checklist values and score reset successfully.');
        
        // Scroll back to the top of form smoothly
        symptomForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // -------------------------------------------------------------
    // Premium Toast Notifications Generator
    // -------------------------------------------------------------
    function showToast(type, message) {
        const toast = document.createElement('div');
        toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white/95 backdrop-blur text-xs font-semibold text-slate-800 transition-all duration-300 transform translate-x-12 opacity-0 pointer-events-auto`;
        
        let iconClass = 'fa-circle-info text-blue-500';
        if (type === 'success') {
            toast.classList.add('toast-success');
            iconClass = 'fa-circle-check text-emerald-500';
        } else if (type === 'error') {
            toast.classList.add('toast-error');
            iconClass = 'fa-circle-exclamation text-rose-500 animate-pulse';
        } else {
            toast.classList.add('toast-info');
        }

        toast.innerHTML = `
            <i class="fa-solid ${iconClass} text-sm"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Slide/fade in entry frame
        setTimeout(() => {
            toast.classList.remove('translate-x-12', 'opacity-0');
        }, 10);

        // Slide out and remove toast frame
        setTimeout(() => {
            toast.classList.add('translate-x-12', 'opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }
});
