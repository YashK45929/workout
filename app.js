// Enhanced PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('ServiceWorker registration successful');
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateAvailable();
          }
        });
      });
    } catch (err) {
      console.log('ServiceWorker registration failed: ', err);
    }
  });
}

// PWA Install Prompt
let deferredPrompt;
let installButton;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});

function showInstallPromotion() {
  // Create install button if it doesn't exist
  if (!installButton) {
    installButton = document.createElement('button');
    installButton.id = 'install-button';
    installButton.innerHTML = '📱 Install App';
    installButton.className = 'install-btn';
    installButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 1000;
      transition: all 0.3s ease;
    `;
    
    installButton.addEventListener('click', installApp);
    document.body.appendChild(installButton);
  }
  
  installButton.style.display = 'block';
}

async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      hideInstallPromotion();
    }
    
    deferredPrompt = null;
  }
}

function hideInstallPromotion() {
  if (installButton) {
    installButton.style.display = 'none';
  }
}

// Show update available notification
function showUpdateAvailable() {
  const updateBanner = document.createElement('div');
  updateBanner.id = 'update-banner';
  updateBanner.innerHTML = `
    <div style="background: #4CAF50; color: white; padding: 10px; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 1001;">
      <span>New version available!</span>
      <button id="update-btn" style="background: white; color: #4CAF50; border: none; padding: 5px 10px; margin-left: 10px; border-radius: 3px; cursor: pointer;">Update</button>
      <button id="dismiss-update" style="background: transparent; color: white; border: 1px solid white; padding: 5px 10px; margin-left: 5px; border-radius: 3px; cursor: pointer;">Later</button>
    </div>
  `;
  
  document.body.appendChild(updateBanner);
  
  document.getElementById('update-btn').addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  });
  
  document.getElementById('dismiss-update').addEventListener('click', () => {
    updateBanner.remove();
  });
}

// Network status monitoring
window.addEventListener('online', () => {
  showNetworkStatus('You are back online!', 'success');
});

window.addEventListener('offline', () => {
  showNetworkStatus('You are offline. App will work with cached data.', 'warning');
});

function showNetworkStatus(message, type) {
  const statusDiv = document.createElement('div');
  statusDiv.className = `network-status ${type}`;
  statusDiv.textContent = message;
  statusDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 1002;
    animation: slideDown 0.3s ease;
    ${type === 'success' ? 'background: #4CAF50;' : 'background: #FF9800;'}
  `;
  
  document.body.appendChild(statusDiv);
  
  setTimeout(() => {
    statusDiv.remove();
  }, 3000);
}

// Enhanced Data Persistence with IndexedDB
class WorkoutStorage {
  constructor() {
    this.dbName = 'GymWorkoutDB';
    this.version = 1;
    this.db = null;
  }
  
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('workouts')) {
          const workoutStore = db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
          workoutStore.createIndex('date', 'date', { unique: false });
          workoutStore.createIndex('day', 'day', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('sets')) {
          const setStore = db.createObjectStore('sets', { keyPath: 'id' });
          setStore.createIndex('workout', 'workoutId', { unique: false });
        }
      };
    });
  }
  
  async saveWorkoutData(data) {
    const transaction = this.db.transaction(['workouts'], 'readwrite');
    const store = transaction.objectStore('workouts');
    return store.add(data);
  }
  
  async getWorkoutData(date) {
    const transaction = this.db.transaction(['workouts'], 'readonly');
    const store = transaction.objectStore('workouts');
    const index = store.index('date');
    return index.get(date);
  }
}

// Initialize storage
const storage = new WorkoutStorage();
storage.init().catch(console.error);

// Background sync registration
if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
  navigator.serviceWorker.ready.then(registration => {
    return registration.sync.register('background-sync');
  });
}

// Push notifications setup
async function setupPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Push notifications enabled');
        // Register for push notifications with your server
        // This is where you'd send the subscription to your backend
      }
    } catch (error) {
      console.error('Push notification setup failed:', error);
    }
  }
}

// Call this when user enables notifications
// setupPushNotifications();

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateWorkbook);
    }

    // Emoji Enhancer for Day and Muscle Cards
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
        const day = card.querySelector('.day-title')?.textContent.toLowerCase();
        const muscle = card.querySelector('.muscle-group')?.textContent.toLowerCase();

        for (const [key, emoji] of Object.entries(dayEmojis)) {
            if (day?.includes(key)) {
                card.querySelector('.day-title').textContent += ` ${emoji}`;
                break;
            }
        }

        for (const [key, emoji] of Object.entries(muscleEmojis)) {
            if (muscle?.includes(key)) {
                card.querySelector('.muscle-group').textContent += ` ${emoji}`;
                break;
            }
        }
    });

    // Enhanced Video Playback with better caching
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const videoPath = this.getAttribute('data-video');
            const exerciseCard = this.closest('.exercise-card');
            const videoContainer = exerciseCard.querySelector('.exercise-video-container');
            
            // Close other open videos first
            document.querySelectorAll('.exercise-video-container').forEach(container => {
                if (container !== videoContainer) {
                    container.innerHTML = '';
                    container.classList.remove('show');
                }
            });
            
            // Toggle current video
            if (videoContainer.classList.contains('show')) {
                videoContainer.innerHTML = '';
                videoContainer.classList.remove('show');
            } else {
                videoContainer.innerHTML = `
                    <div class="exercise-video">
                        <video controls autoplay preload="metadata">
                            <source src="${videoPath}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <button class="close-video">×</button>
                    </div>
                `;
                videoContainer.classList.add('show');
                
                // Close button functionality
                videoContainer.querySelector('.close-video').addEventListener('click', function() {
                    videoContainer.innerHTML = '';
                    videoContainer.classList.remove('show');
                });
            }
        });
    });

    // Enhanced dropdown functionality
    document.querySelectorAll('.exercise-header').forEach(header => {
        header.addEventListener('click', function() {
            const exerciseCard = this.closest('.exercise-card');
            const dropdown = exerciseCard.querySelector('.sets-dropdown');
            
            exerciseCard.classList.toggle('active');
            
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            } else {
                dropdown.style.display = 'block';
                dropdown.classList.add('show');
            }
        });
    });

    // Enhanced completion tracking with better persistence
    document.querySelectorAll('.completion-toggle').forEach(checkbox => {
        const setCard = checkbox.closest('.set-card');
        const setId = setCard.dataset.set;
        
        // Load saved state
        const savedState = localStorage.getItem(`set-${setId}-completed`);
        if (savedState === 'true') {
            checkbox.checked = true;
            setCard.classList.add('completed');
        }

        // Enhanced toggle functionality
        checkbox.addEventListener('change', function() {
            const isCompleted = this.checked;
            setCard.classList.toggle('completed', isCompleted);
            
            // Save to localStorage
            localStorage.setItem(`set-${setId}-completed`, isCompleted);
            
            // Save to IndexedDB for better persistence
            if (storage.db) {
                const workoutData = {
                    setId: setId,
                    completed: isCompleted,
                    timestamp: new Date().toISOString(),
                    day: getCurrentDay()
                };
                
                storage.saveWorkoutData(workoutData).catch(console.error);
            }
            
            // Update progress indicator
            updateProgressIndicator();
        });

        // Card click also toggles
        setCard.addEventListener('click', function(e) {
            if (!e.target.closest('.set-checkbox')) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });

    // Initialize progress tracking
    updateProgressIndicator();
});

function getCurrentDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
}

function updateProgressIndicator() {
    const totalSets = document.querySelectorAll('.completion-toggle').length;
    const completedSets = document.querySelectorAll('.completion-toggle:checked').length;
    const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    
    // Update progress in title or create progress bar
    let progressElement = document.getElementById('progress-indicator');
    if (!progressElement) {
        progressElement = document.createElement('div');
        progressElement.id = 'progress-indicator';
        progressElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${progress}%;
            height: 3px;
            background: linear-gradient(90deg, #4CAF50, #45a049);
            transition: width 0.3s ease;
            z-index: 1000;
        `;
        document.body.appendChild(progressElement);
    } else {
        progressElement.style.width = `${progress}%`;
    }
    
    // Update page title with progress
    const originalTitle = document.title;
    if (progress > 0) {
        document.title = `(${progress}%) ${originalTitle}`;
    }
}

// Helper to extract YouTube ID from full URL
function extractYouTubeID(url) {
    const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
}

// Add CSS animation for network status
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); }
        to { transform: translateX(-50%) translateY(0); }
    }
    
    .install-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    }
    
    .network-status {
        animation: slideDown 0.3s ease;
    }
`;
document.head.appendChild(style);