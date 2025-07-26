// js/ui-manager.js

/**
 * 切换倒计时器的可见性
 * @param {boolean} isVisible - 是否显示
 */
function toggleTimerVisibility(isVisible) {
    const timer = document.getElementById('timer');
    if (timer) {
        timer.style.display = isVisible ? 'block' : 'none';
    }
    localStorage.setItem('timerVisible', isVisible);
}

/**
 * 初始化UI元素的状态
 */
function initializeUIState() {
    // 初始化倒计时器可见性
    const timerVisible = localStorage.getItem('timerVisible') === 'true';
    const timerToggle = document.getElementById('timerVisibilityToggle');
    if (timerToggle) {
        timerToggle.checked = timerVisible;
    }
    // 应用存储的状态
    const timer = document.getElementById('timer');
    if (timer) {
        timer.style.display = timerVisible ? 'block' : 'none';
    }
}
