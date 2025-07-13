// PWA Install Prompt
let deferredPrompt;
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

    // Video Playback (YouTube or MP4)
    // Video playback functionality
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the dropdown toggle
            
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
                        <video controls autoplay>
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

// Keep your existing dropdown and checkbox functionality
document.querySelectorAll('.exercise-header').forEach(header => {
    header.addEventListener('click', function() {
        const exerciseCard = this.closest('.exercise-card');
        const dropdown = exerciseCard.querySelector('.sets-dropdown');
        const icon = this.querySelector('.dropdown-icon');
        
        exerciseCard.classList.toggle('active');
        
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
            dropdown.classList.add('show');
        }
    });
});

// Rest of your existing code...

});

// Helper to extract YouTube ID from full URL
function extractYouTubeID(url) {
    const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
}
document.querySelectorAll('.completion-toggle').forEach(checkbox => {
  // Load saved state if available
  const setCard = checkbox.closest('.set-card');
  const setId = setCard.dataset.set;
  const savedState = localStorage.getItem(`set-${setId}-completed`);
  
  if (savedState === 'true') {
    checkbox.checked = true;
    setCard.classList.add('completed');
  }

  // Toggle functionality
  checkbox.addEventListener('click', function(e) {
    // Allow normal checkbox behavior (toggle)
    e.stopPropagation();
    
    setTimeout(() => {
      setCard.classList.toggle('completed', this.checked);
      localStorage.setItem(`set-${setId}-completed`, this.checked);
    }, 10);
  });

  // Card click also toggles (optional)
  setCard.addEventListener('click', function(e) {
    if (!e.target.closest('.set-checkbox')) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
});

// Add this to your app.js
document.querySelectorAll('.exercise-header').forEach(header => {
  header.addEventListener('click', function() {
    const exerciseCard = this.closest('.exercise-card');
    const dropdown = exerciseCard.querySelector('.sets-dropdown');
    const icon = this.querySelector('.dropdown-icon');
    
    // Toggle active class on parent card
    exerciseCard.classList.toggle('active');
    
    // Toggle dropdown visibility
    if (dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
    } else {
      dropdown.style.display = 'block';
      dropdown.classList.add('show');
    }
  });
  
  // Keep the existing checkbox functionality
  const checkboxes = header.closest('.exercise-card').querySelectorAll('.completion-toggle');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const setCard = this.closest('.set-card');
      setCard.classList.toggle('completed', this.checked);
      localStorage.setItem(`set-${setCard.dataset.set}-completed`, this.checked);
    });
  });
});

// Load saved states when page loads
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.set-card').forEach(card => {
    const setId = card.dataset.set;
    const savedState = localStorage.getItem(`set-${setId}-completed`);
    if (savedState === 'true') {
      card.querySelector('.completion-toggle').checked = true;
      card.classList.add('completed');
    }
  });
});