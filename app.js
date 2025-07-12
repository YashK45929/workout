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

// Add to app.js
// After service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('SW registered');
                registration.update(); // Force update
            });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const dayEmojis = {
        monday: '😎',
        tuesday: '🫡',
        wednesday: '😛',
        thursday: '🤪',
        friday: '😉',
        saturday: '😇'
    };

    const muscleEmojis = {
        biceps: '💪🏻',
        shoulder: '🦸‍♂️',
        chest: '🏋️‍♀️',
        back: '🦸‍♀️',
        leg: '🦵',
        cardio: '🏃'
    };

    document.querySelectorAll('.day-card').forEach(card => {
        const day = card.querySelector('.day-title').textContent.toLowerCase();
        const muscle = card.querySelector('.muscle-group').textContent.toLowerCase();
        
        // Add day emoji
        for (const [key, emoji] of Object.entries(dayEmojis)) {
            if (day.includes(key)) {
                card.querySelector('.day-title').textContent += ` ${emoji}`;
                break;
            }
        }
        
        // Add muscle emoji
        for (const [key, emoji] of Object.entries(muscleEmojis)) {
            if (muscle.includes(key)) {
                card.querySelector('.muscle-group').textContent += ` ${emoji}`;
                break;
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            const exerciseCard = this.closest('.exercise-card');
            
            // Remove any existing video first
            const existingVideo = exerciseCard.querySelector('.exercise-video');
            if (existingVideo) {
                existingVideo.remove();
            }
            
            // Create new video element
            const videoHTML = `
                <div class="exercise-video">
                    <video controls autoplay>
                        <source src="${videoSrc}" type="video/mp4">
                    </video>
                    <button class="close-video" title="Close video">×</button>
                </div>
            `;
            
            // Insert after exercise specs
            const specsDiv = exerciseCard.querySelector('.exercise-specs');
            specsDiv.insertAdjacentHTML('afterend', videoHTML);
            
            // Handle close button
            exerciseCard.querySelector('.close-video').addEventListener('click', (e) => {
                e.stopPropagation();
                const videoContainer = e.target.closest('.exercise-video');
                videoContainer.querySelector('video').pause();
                videoContainer.remove();
            });
        });
    });
});

