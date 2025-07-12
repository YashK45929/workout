// Comprehensive exercise database
const exerciseDatabase = {
    biceps: [
        {
            name: "Barbell Bicep Curl",
            sets: 3,
            reps: "8-12",
            rest: "60-90s",
            notes: "Primary compound movement for biceps brachii activation",
            muscleActivation: "Biceps Brachii (Primary), Brachialis (Secondary)"
        },
        // ... (other biceps exercises)
    ],
    shoulders: [
        {
            name: "Overhead Press (Military Press)",
            sets: 4,
            reps: "6-8",
            rest: "2-3min",
            notes: "Primary compound movement for shoulder development",
            muscleActivation: "Anterior Deltoid (Primary), Medial Deltoid, Triceps"
        },
        // ... (other shoulder exercises)
    ],
    // ... (other muscle groups)
};

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const loadingEl = document.getElementById('loading');
const progressEl = document.getElementById('progressFill');
let deferredPrompt;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    generateBtn.addEventListener('click', generateWorkbook);
    
    // PWA Installation
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.createElement('button');
        installBtn.className = 'install-btn';
        installBtn.textContent = 'Install App';
        document.body.appendChild(installBtn);
        installBtn.style.display = 'block';
        
        installBtn.addEventListener('click', () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted install');
                } else {
                    console.log('User dismissed install');
                }
                deferredPrompt = null;
            });
        });
    });

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
});


