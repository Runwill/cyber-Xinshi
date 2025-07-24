// timer-manager.js - 倒计时器管理器

class TimerManager {
    constructor() {
        this.totalTime = 120; // 总时间 2分钟 = 120秒
        this.remainingTime = 120;
        this.isRunning = false;
        this.intervalId = null;
        this.timerElement = null;
        this.displayElement = null;
        this.startButton = null;
        this.resetButton = null;
        
        this.init();
    }
    
    init() {
        // 获取DOM元素
        this.timerElement = document.getElementById('timer');
        this.displayElement = document.getElementById('timerDisplay');
        this.startButton = document.getElementById('timerStartBtn');
        this.resetButton = document.getElementById('timerResetBtn');
        
        // 初始化显示
        this.updateDisplay();
        
        // 绑定事件
        this.bindEvents();
    }
    
    bindEvents() {
        // 拖拽功能
        this.makeTimerDraggable();
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        if (!this.displayElement) return;
        
        this.displayElement.textContent = this.formatTime(this.remainingTime);
        
        // 根据剩余时间设置样式
        this.displayElement.className = 'timer-display';
        if (this.remainingTime <= 30 && this.remainingTime > 10) {
            this.displayElement.classList.add('warning');
        } else if (this.remainingTime <= 10) {
            this.displayElement.classList.add('danger');
        }
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startButton.textContent = '暂停';
        this.startButton.className = 'timer-btn timer-btn-pause';
        
        // 添加开始时的闪烁效果
        this.displayElement.classList.add('blink');
        setTimeout(() => {
            this.displayElement.classList.remove('blink');
        }, 300);
        
        this.intervalId = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            
            if (this.remainingTime <= 0) {
                this.stop();
                this.onTimeUp();
            }
        }, 1000);
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startButton.textContent = '开始';
        this.startButton.className = 'timer-btn timer-btn-start';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // 添加暂停时的闪烁效果
        this.displayElement.classList.add('blink');
        setTimeout(() => {
            this.displayElement.classList.remove('blink');
        }, 300);
    }
    
    reset() {
        // 停止计时器
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // 重置状态
        this.isRunning = false;
        this.remainingTime = this.totalTime;
        
        // 重置按钮状态
        this.startButton.textContent = '开始';
        this.startButton.className = 'timer-btn timer-btn-start';
        
        // 更新显示
        this.updateDisplay();
        
        // 添加重置时的闪烁效果
        this.displayElement.classList.add('blink');
        setTimeout(() => {
            this.displayElement.classList.remove('blink');
        }, 300);
    }
    
    stop() {
        this.pause();
    }
    
    onTimeUp() {
        // 时间到了的处理
        this.remainingTime = 0;
        this.updateDisplay();
        
        // 添加时间到时的蓝色高亮效果
        this.displayElement.classList.add('highlight');
        setTimeout(() => {
            this.displayElement.classList.remove('highlight');
        }, 3000); // 时间到时持续更久一点
    }
    
    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }
    
    makeTimerDraggable() {
        if (!this.timerElement) return;
        
        const header = this.timerElement.querySelector('.timer-header');
        if (!header) return;
        
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        // 从localStorage恢复位置
        const savedPosition = localStorage.getItem('timerPosition');
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            this.timerElement.style.left = position.x + 'px';
            this.timerElement.style.top = position.y + 'px';
            this.timerElement.style.transform = 'none';
            xOffset = position.x;
            yOffset = position.y;
        }
        
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        function dragStart(e) {
            if (e.target.tagName === 'BUTTON') return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                timerManager.timerElement.classList.add('dragging');
            }
        }
        
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                timerManager.timerElement.style.transform = 'none';
                timerManager.timerElement.style.left = currentX + 'px';
                timerManager.timerElement.style.top = currentY + 'px';
            }
        }
        
        function dragEnd() {
            if (isDragging) {
                isDragging = false;
                timerManager.timerElement.classList.remove('dragging');
                
                // 保存位置到localStorage
                localStorage.setItem('timerPosition', JSON.stringify({
                    x: xOffset,
                    y: yOffset
                }));
            }
        }
    }
}

// 全局倒计时器实例
let timerManager;

// 倒计时器相关函数（供HTML调用）
function toggleTimer() {
    if (timerManager) {
        timerManager.toggle();
    }
}

function resetTimer() {
    if (timerManager) {
        timerManager.reset();
    }
}

// 初始化倒计时器
function initTimer() {
    timerManager = new TimerManager();
}
