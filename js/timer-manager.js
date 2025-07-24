// 计时器管理器
class TimerManager {
    constructor() {
        this.totalSeconds = 120; // 默认2分钟
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = false;
        this.intervalId = null;
        this.timerDisplay = null;
        this.startBtn = null;
        this.pauseBtn = null;
        this.resetBtn = null;
        
        this.init();
    }
    
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }
    
    setupElements() {
        this.timerDisplay = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('timerStartBtn');
        this.pauseBtn = document.getElementById('timerPauseBtn');
        this.resetBtn = document.getElementById('timerResetBtn');
        
        if (this.timerDisplay) {
            this.updateDisplay();
        }
    }
    
    start() {
        if (!this.isRunning && this.remainingSeconds > 0) {
            this.isRunning = true;
            this.updateButtons();
            this.updateDisplayStyle();
            
            this.intervalId = setInterval(() => {
                this.remainingSeconds--;
                this.updateDisplay();
                this.updateDisplayStyle();
                
                if (this.remainingSeconds <= 0) {
                    this.stop();
                    this.onTimeUp();
                }
            }, 1000);
            
            // 记录到历史
            historyManager.addEntry('计时器', '开始计时', `${this.formatTime(this.remainingSeconds)}`);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.updateButtons();
            this.updateDisplayStyle();
            
            // 记录到历史
            historyManager.addEntry('计时器', '暂停计时', `剩余${this.formatTime(this.remainingSeconds)}`);
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.updateButtons();
        this.updateDisplayStyle();
    }
    
    reset() {
        this.stop();
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
        this.updateDisplayStyle();
        
        // 记录到历史
        historyManager.addEntry('计时器', '重置计时', `重置为${this.formatTime(this.totalSeconds)}`);
    }
    
    setTime(minutes, seconds) {
        if (!this.isRunning) {
            this.totalSeconds = minutes * 60 + seconds;
            this.remainingSeconds = this.totalSeconds;
            this.updateDisplay();
            this.updateDisplayStyle();
        }
    }
    
    onTimeUp() {
        // 播放提示音（如果浏览器支持）
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQdBTmV2+/FfT4AI7bq58mfhgO1+v/1u2sHJLvs7qx8EwcZdce1rl1ZEQdLvNuy1HYkCBum3+6SRxEHW7fF7aFrJQUpn9/zrGgcBjiQ2PG+eikNKI3H7eWUQw0TXb3k7p5kGwQqmdT0vHEmDBue4/TKeCkOKoHB6+SHQQ0PZb7Y7qpuJAQqmNT0rH0iCiiOzfDVaiILKZPK7OZXA');
            audio.play().catch(() => {});
        } catch (e) {}
        
        // 添加到历史记录
        historyManager.addEntry('计时器', '时间到', '计时结束');
        
        // 显示提醒
        if (this.timerDisplay) {
            const originalText = this.timerDisplay.textContent;
            this.timerDisplay.textContent = '时间到!';
            setTimeout(() => {
                this.timerDisplay.textContent = originalText;
            }, 2000);
        }
    }
    
    updateDisplay() {
        if (this.timerDisplay) {
            this.timerDisplay.textContent = this.formatTime(this.remainingSeconds);
        }
    }
    
    updateDisplayStyle() {
        if (!this.timerDisplay) return;
        
        // 清除所有状态类
        this.timerDisplay.classList.remove('running', 'warning', 'danger');
        
        if (this.isRunning) {
            this.timerDisplay.classList.add('running');
            
            // 根据剩余时间添加警告样式
            if (this.remainingSeconds <= 10) {
                this.timerDisplay.classList.add('danger');
            } else if (this.remainingSeconds <= 30) {
                this.timerDisplay.classList.add('warning');
            }
        }
    }
    
    updateButtons() {
        if (this.startBtn) {
            this.startBtn.disabled = this.isRunning || this.remainingSeconds <= 0;
        }
        if (this.pauseBtn) {
            this.pauseBtn.disabled = !this.isRunning;
        }
        if (this.resetBtn) {
            this.resetBtn.disabled = this.isRunning;
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 处理拖拽功能
    enableDrag() {
        const timerPanel = document.getElementById('timerPanel');
        const header = document.querySelector('.timer-panel-header');
        
        if (!timerPanel || !header) return;
        
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            timerPanel.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = timerPanel.offsetLeft;
            startTop = timerPanel.offsetTop;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            timerPanel.style.left = `${startLeft + deltaX}px`;
            timerPanel.style.top = `${startTop + deltaY}px`;
            timerPanel.style.transform = 'none';
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                timerPanel.classList.remove('dragging');
            }
        });
    }
}

// 创建全局计时器管理器实例
let timerManager;

// 计时器相关函数（供HTML调用）
function startTimer() {
    if (timerManager) {
        timerManager.start();
    }
}

function pauseTimer() {
    if (timerManager) {
        timerManager.pause();
    }
}

function resetTimer() {
    if (timerManager) {
        timerManager.reset();
    }
}

// 初始化计时器
document.addEventListener('DOMContentLoaded', () => {
    timerManager = new TimerManager();
    // 延迟启用拖拽，确保元素已渲染
    setTimeout(() => {
        if (timerManager) {
            timerManager.enableDrag();
        }
    }, 100);
});