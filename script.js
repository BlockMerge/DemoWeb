// ===== PWA Support =====
let deferredPrompt;

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Handle PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button or notification
    showInstallPromotion();
});

// Handle successful installation
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed successfully');
    deferredPrompt = null;
});

function showInstallPromotion() {
    // You can add a custom install button here if desired
    console.log('App can be installed');
}

// ===== DOM Elements =====
const elements = {
    gameFrame: document.getElementById('game-frame'),
    gameContainer: document.getElementById('game-container'),
    loadingScreen: document.getElementById('loading-screen'),
    loadingProgress: document.getElementById('loading-progress'),
    loadingText: document.getElementById('loading-text'),
    fullscreenBtn: document.getElementById('fullscreen-btn')
};

// ===== Initialize =====
function init() {
    setupEventListeners();
    simulateLoading();
    preventMobileBehaviors();
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Fullscreen button
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Game frame load event
    elements.gameFrame.addEventListener('load', handleGameLoad);

    // Handle errors
    elements.gameFrame.addEventListener('error', handleGameError);
}

// ===== Loading Simulation =====
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }

        updateLoadingProgress(progress);

        // Update loading text based on progress
        if (progress < 30) {
            elements.loadingText.textContent = 'Loading game assets...';
        } else if (progress < 60) {
            elements.loadingText.textContent = 'Initializing Unity engine...';
        } else if (progress < 90) {
            elements.loadingText.textContent = 'Almost ready...';
        } else {
            elements.loadingText.textContent = 'Starting game...';
        }
    }, 200);
}

function updateLoadingProgress(percent) {
    elements.loadingProgress.style.width = `${percent}%`;
}

function handleGameLoad() {
    // Wait a bit before hiding loading screen for smooth transition
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
    }, 1000);
}

function handleGameError() {
    elements.loadingText.textContent = 'Error loading game. Please refresh the page.';
    elements.loadingText.style.color = '#ef4444';
    elements.loadingProgress.style.background = '#ef4444';
}

// ===== iOS Detection =====
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// ===== Fullscreen Handling =====
function toggleFullscreen() {
    // iOS Safari has limited fullscreen support
    if (isIOS()) {
        handleIOSFullscreen();
        return;
    }

    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function handleIOSFullscreen() {
    // On iOS, try to make the iframe fullscreen
    const iframe = elements.gameFrame;

    // Check if iframe supports webkitEnterFullscreen (for video elements in iframe)
    if (iframe.webkitEnterFullscreen) {
        try {
            iframe.webkitEnterFullscreen();
        } catch (e) {
            console.log('iOS fullscreen not available for iframe');
            // Fallback: scroll to game and hide other elements
            fallbackFullscreen();
        }
    } else if (iframe.webkitRequestFullscreen) {
        try {
            iframe.webkitRequestFullscreen();
        } catch (e) {
            console.log('iOS webkit fullscreen failed');
            fallbackFullscreen();
        }
    } else {
        // Fallback for iOS
        fallbackFullscreen();
    }
}

function fallbackFullscreen() {
    // Fallback: maximize viewport and scroll to game
    const gameContainer = elements.gameContainer;

    if (!gameContainer.classList.contains('ios-fullscreen')) {
        gameContainer.classList.add('ios-fullscreen');
        document.body.classList.add('ios-fullscreen-mode');

        // Scroll to game
        gameContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update button
        elements.fullscreenBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V8H3M21 8H16V3M16 21V16H21M3 16H8V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Exit Fullscreen
        `;
    } else {
        gameContainer.classList.remove('ios-fullscreen');
        document.body.classList.remove('ios-fullscreen-mode');

        // Update button
        elements.fullscreenBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Fullscreen
        `;
    }
}

function enterFullscreen() {
    const elem = elements.gameContainer;

    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.log('Fullscreen request failed:', err);
        });
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.webkitEnterFullscreen) {
        elem.webkitEnterFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement);

    if (isFullscreen) {
        elements.gameContainer.classList.add('fullscreen');
        elements.fullscreenBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V8H3M21 8H16V3M16 21V16H21M3 16H8V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Exit Fullscreen
        `;
    } else {
        elements.gameContainer.classList.remove('fullscreen');
        elements.fullscreenBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Fullscreen
        `;
    }
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // F key for fullscreen
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    }

    // Escape key to exit fullscreen
    if (e.key === 'Escape' && document.fullscreenElement) {
        exitFullscreen();
    }
});

// ===== Mobile Optimizations =====
function preventMobileBehaviors() {
    // Prevent pull-to-refresh on mobile
    document.body.addEventListener('touchmove', (e) => {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent double-tap zoom on game container
    let lastTouchEnd = 0;
    elements.gameContainer.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Prevent context menu on long press
    elements.gameContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        // Small delay to allow the browser to update dimensions
        setTimeout(() => {
            // Adjust game container if needed
            if (elements.gameContainer.classList.contains('fullscreen') ||
                elements.gameContainer.classList.contains('ios-fullscreen')) {
                // Ensure fullscreen stays fullscreen after rotation
                elements.gameContainer.style.height = '100vh';
            }
        }, 100);
    });

    // Detect if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
        document.body.classList.add('pwa-mode');
        console.log('Running as installed PWA');
    }

    // Handle safe area insets for iOS notch
    if (isIOS()) {
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
    }
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', init);
