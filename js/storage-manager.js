// storage-manager.js - 储存管理器

// 状态保存
function saveState() {
    localStorage.setItem('seats', JSON.stringify(seats));
    localStorage.setItem('counter', counter);
    localStorage.setItem('voteMap', JSON.stringify(voteMap));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('isDayTime', isDayTime);
    localStorage.setItem('currentPhaseStep', currentPhaseStep);
    localStorage.setItem('dayCount', dayCount);
}

function loadState() {
    const seatsStr = localStorage.getItem('seats');
    const counterStr = localStorage.getItem('counter');
    const voteMapStr = localStorage.getItem('voteMap');
    const historyStr = localStorage.getItem('history');
    const isDayTimeStr = localStorage.getItem('isDayTime');
    const currentPhaseStepStr = localStorage.getItem('currentPhaseStep');
    const dayCountStr = localStorage.getItem('dayCount');
    
    if (seatsStr) {
        try {
            seats = JSON.parse(seatsStr);
            // 为旧存档添加新状态属性的兼容性处理
            for (let i = 0; i < seats.length; i++) {
                if (seats[i].out === undefined) {
                    seats[i].out = false;
                }
                if (seats[i].suicide === undefined) {
                    seats[i].suicide = false;
                }
                if (seats[i].flipped === undefined) {
                    seats[i].flipped = false;
                }
                if (seats[i].surrendered === undefined) {
                    seats[i].surrendered = false;
                }
            }
        } catch {
            seats = [];
        }
    }
    if (counterStr !== null) {
        counter = parseInt(counterStr, 10) || 20;
    }
    if (voteMapStr) {
        try {
            voteMap = JSON.parse(voteMapStr);
        } catch {
            voteMap = [];
        }
    }
    if (historyStr) {
        try {
            history = JSON.parse(historyStr);
        } catch {
            history = [];
        }
    }
    if (isDayTimeStr !== null) {
        isDayTime = isDayTimeStr === 'true';
    }
    if (currentPhaseStepStr !== null) {
        currentPhaseStep = parseInt(currentPhaseStepStr, 10) || 0;
    }
    if (dayCountStr !== null) {
        dayCount = parseInt(dayCountStr, 10) || 0;
    }
}

function resetAll() {
    if (confirm('确定要重写《心史》吗？')) {
        // 询问是否保留座位名牌
        const keepNames = false;
        //const keepNames = confirm('保留座位的身份？');
        
        // 如果保留名牌，先保存当前名牌
        let savedNames = [];
        if (keepNames) {
            savedNames = seats.map(seat => seat.name);
        }
        
        localStorage.removeItem('seats');
        localStorage.removeItem('counter');
        localStorage.removeItem('voteMap');
        localStorage.removeItem('history');
        localStorage.removeItem('isDayTime');
        localStorage.removeItem('currentPhaseStep');
        localStorage.removeItem('dayCount');
        initSeats(12);
        
        // 如果保留名牌，恢复名牌
        if (keepNames && savedNames.length > 0) {
            for (let i = 0; i < Math.min(seats.length, savedNames.length); i++) {
                seats[i].name = savedNames[i];
            }
        }
        
        counter = 20;
        history = [];
        isDayTime = true;
        currentPhaseStep = 0;
        dayCount = 0;
        renderSeats();
        renderVoteArea();
        renderHistory();
        updateCounterDisplay();
        updatePhaseDisplay();
        
        // 重置历史记录框位置
        resetHistoryPanelPosition();
        
        // 重置座位抽取器位置
        resetSeatPickerPosition();
        
        // 重置流程标志窗位置
        resetPhasePanelPosition();
        
        // 重置身份信息框位置
        resetRoleInfoPanelPosition();
    }
}
