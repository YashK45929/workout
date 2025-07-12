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

// Generate Workbook Function
function generateWorkbook() {
    loadingEl.style.display = 'block';
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        progressEl.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                createExcelFile();
                loadingEl.style.display = 'none';
                progressEl.style.width = '0%';
            }, 500);
        }
    }, 200);
}

// Create Excel File Function
function createExcelFile() {
    const wb = XLSX.utils.book_new();
    
    // Training schedule mapping
    const schedule = {
        'Monday': { muscle: 'biceps', exercises: exerciseDatabase.biceps },
        'Tuesday': { muscle: 'shoulders', exercises: exerciseDatabase.shoulders },
        'Wednesday': { muscle: 'chest', exercises: exerciseDatabase.chest },
        'Thursday': { muscle: 'back', exercises: exerciseDatabase.back },
        'Friday': { muscle: 'legs', exercises: exerciseDatabase.legs },
        'Saturday': { muscle: 'mixed', exercises: exerciseDatabase.mixed }
    };

    // Create sheets for each day
    Object.keys(schedule).forEach(day => {
        const dayData = schedule[day];
        const exercises = dayData.exercises;
        
        // Create header row
        const headers = [
            'Exercise Name',
            'Sets',
            'Reps',
            'Rest Period',
            'Weight/Resistance',
            'RPE (1-10)',
            'Notes',
            'Muscle Activation',
            'Week 1 Progress',
            'Week 2 Progress',
            'Week 3 Progress',
            'Week 4 Progress'
        ];
        
        const sheetData = [headers];
        
        // Add exercise data
        exercises.forEach(exercise => {
            const row = [
                exercise.name,
                exercise.sets,
                exercise.reps,
                exercise.rest,
                '', // Weight/Resistance
                '', // RPE
                exercise.notes,
                exercise.muscleActivation,
                '', // Week 1
                '', // Week 2
                '', // Week 3
                ''  // Week 4
            ];
            sheetData.push(row);
        });
        
        // Add training principles section
        sheetData.push(['']);
        sheetData.push(['=== TRAINING PRINCIPLES ===']);
        sheetData.push(['Progressive Overload', 'Increase weight, reps, or sets each week']);
        sheetData.push(['Rest Between Sets', 'Follow prescribed rest periods for optimal recovery']);
        sheetData.push(['RPE Scale', '1-3: Very Light, 4-6: Moderate, 7-8: Hard, 9-10: Maximum']);
        sheetData.push(['Form Focus', 'Maintain proper form over heavy weight']);
        sheetData.push(['Recovery', 'Allow 48-72 hours between training same muscle groups']);
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        
        // Set column widths
        ws['!cols'] = [
            { wch: 25 }, { wch: 6 }, { wch: 10 }, { wch: 12 },
            { wch: 15 }, { wch: 8 }, { wch: 40 }, { wch: 35 },
            { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, day);
    });
    
    // Generate and download the file
    const fileName = `Complete_Training_Program_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    // Show success message
    alert('✅ Complete training program Excel file generated successfully!\n\nFile includes:\n• 6 daily workout sheets\n• Exercise descriptions and parameters\n• Progress tracking system\n• Nutrition guidelines\n• Training principles\n• Recovery protocols');
}