// phase-manager.js - 流程标志窗管理器

// 流程标志窗功能
function updatePhaseDisplay() {
    const phaseTimeEl = document.getElementById('phaseTime');
    const phaseDayEl = document.getElementById('phaseDay');
    const phaseSettlementEl = document.getElementById('phaseSettlement');
    const prevBtn = document.getElementById('prevPhaseBtn');
    const nextBtn = document.getElementById('nextPhaseBtn');
    
    // 更新白天/黑夜显示
    phaseTimeEl.textContent = isDayTime ? '白天' : '黑夜';
    phaseTimeEl.className = 'phase-time ' + (isDayTime ? 'day' : 'night');
    
    // 更新日数显示
    phaseDayEl.textContent = `第${dayCount}天`;
    
    // 更新结算信息
    if (isDayTime) {
        // 白天显示发言顺序
        if (dayCount === 0) {
            phaseSettlementEl.innerHTML = '<span class="empty">无发言</span>';
            phaseSettlementEl.classList.add('empty');
        } else {
            phaseSettlementEl.innerHTML = dayCount % 2 === 1 ? '顺序发言' : '倒序发言';
        }
    } else {
        // 黑夜显示当前结算步骤
        const currentStepRoles = getCurrentStepRoles();
        if (currentStepRoles.length === 0) {
            phaseSettlementEl.innerHTML = '<span class="empty">无结算角色</span>';
            phaseSettlementEl.classList.add('empty');
        } else {
            // 显示结算文本而不是角色名
            const roleTexts = currentStepRoles.map(role => {
                const seatIndex = findSeatByRole(role.character);
                return `(${seatIndex + 1})${role.text}`;
            });
            phaseSettlementEl.innerHTML = roleTexts.join('<br>');
            phaseSettlementEl.classList.remove('empty');
        }
    }
    
    // 更新按钮状态
    prevBtn.disabled = (isDayTime || currentPhaseStep <= 0);
    nextBtn.disabled = (isDayTime || currentPhaseStep >= settlementPriority.length - 1);
}

function getCurrentStepRoles() {
    if (isDayTime || currentPhaseStep < 0 || currentPhaseStep >= settlementPriority.length) {
        return [];
    }
    
    const stepRoles = settlementPriority[currentPhaseStep];
    return stepRoles.filter(role => {
        // 如果是固定结算项（如蒙古刀人），直接通过
        if (role.isFixedSettlement) {
            return true;
        }
        
        const seatIndex = findSeatByRole(role.character);
        // 检查座位状态
        if (seatIndex === -1 || seats[seatIndex].dead || seats[seatIndex].out || seats[seatIndex].suicide) {
            return false;
        }
        
        // 检查夜晚限制
        const nightRestriction = role.nightRestriction || "any";
        if (nightRestriction === "firstNight") {
            // 只有第0天晚上才能结算
            return dayCount === 0;
        } else if (nightRestriction === "notFirstNight") {
            // 第0天晚上不能结算
            return dayCount > 0;
        } else {
            // "any" - 任何夜晚都可以结算
            return true;
        }
    });
}

function findSeatByRole(roleName) {
    for (let i = 0; i < seats.length; i++) {
        if (seats[i].name === roleName) {
            return i;
        }
    }
    return -1; // 未找到
}

function toggleDayNight() {
    isDayTime = !isDayTime;
    if (isDayTime) {
        // 切换到白天时天数+1，重置结算步骤
        dayCount++;
        currentPhaseStep = 0;
        // 添加新的一天的历史记录
        addDayHistoryRecord(dayCount);
    } else {
        // 切换到黑夜时找到第一个有效的结算步骤
        findNextValidStep();
    }
    updatePhaseDisplay();
    saveState();
}

// 手动调整天数
function changeDayCount(delta) {
    const newDayCount = dayCount + delta;
    if (newDayCount < 0) return; // 天数不能小于0
    
    dayCount = newDayCount;
    
    // 添加天数变化的历史记录
    if (delta > 0) {
        for (let i = 0; i < delta; i++) {
            addDayHistoryRecord(dayCount - delta + i + 1);
        }
    }
    // 如果是减少天数，不添加历史记录（避免混乱）
    
    updatePhaseDisplay();
    saveState();
}

function prevPhaseStep() {
    if (isDayTime || currentPhaseStep <= 0) return;
    
    currentPhaseStep--;
    // 如果当前步骤没有有效角色，继续向前查找
    if (getCurrentStepRoles().length === 0 && currentPhaseStep > 0) {
        prevPhaseStep();
        return;
    }
    updatePhaseDisplay();
    saveState();
}

function nextPhaseStep() {
    if (isDayTime || currentPhaseStep >= settlementPriority.length - 1) return;
    
    currentPhaseStep++;
    // 如果当前步骤没有有效角色，继续向后查找
    if (getCurrentStepRoles().length === 0 && currentPhaseStep < settlementPriority.length - 1) {
        nextPhaseStep();
        return;
    }
    updatePhaseDisplay();
    saveState();
}

function findNextValidStep() {
    // 从当前步骤开始，找到第一个有有效角色的步骤
    while (currentPhaseStep < settlementPriority.length) {
        if (getCurrentStepRoles().length > 0) {
            break;
        }
        currentPhaseStep++;
    }
    // 如果没有找到有效步骤，重置到0
    if (currentPhaseStep >= settlementPriority.length) {
        currentPhaseStep = 0;
    }
}

function resetPhasePanelPosition() {
    const phasePanel = document.getElementById('phasePanel');
    phasePanel.style.right = '20px';
    phasePanel.style.top = '20px';
    phasePanel.style.left = 'auto';
    phasePanel.style.bottom = 'auto';
    
    // 清除保存的位置（如果将来添加位置保存功能）
    localStorage.removeItem('phasePanelPosition');
}

// 流程标志窗拖拽功能
function initPhasePanelDrag() {
    let isPhaseDragging = false;
    let phaseStartX, phaseStartY, phaseInitialX, phaseInitialY;
    
    const phasePanel = document.getElementById('phasePanel');
    const phaseHeader = phasePanel.querySelector('.phase-header');
    
    // 加载保存的位置
    const savedPhasePosition = localStorage.getItem('phasePanelPosition');
    if (savedPhasePosition) {
        try {
            const position = JSON.parse(savedPhasePosition);
            if (position.left !== undefined) {
                phasePanel.style.left = position.left + 'px';
                phasePanel.style.top = position.top + 'px';
                phasePanel.style.right = 'auto';
                phasePanel.style.bottom = 'auto';
            } else {
                phasePanel.style.right = position.right + 'px';
                phasePanel.style.top = position.top + 'px';
                phasePanel.style.left = 'auto';
                phasePanel.style.bottom = 'auto';
            }
        } catch (e) {
            // 如果解析失败，使用重置函数设置的默认位置
            resetPhasePanelPosition();
        }
    } else {
        // 如果没有保存位置，使用重置函数设置的默认位置
        resetPhasePanelPosition();
    }
    
    phaseHeader.addEventListener('mousedown', function(e) {
        isPhaseDragging = true;
        phaseStartX = e.clientX;
        phaseStartY = e.clientY;
        const rect = phasePanel.getBoundingClientRect();
        phaseInitialX = rect.left;
        phaseInitialY = rect.top;
        phasePanel.classList.add('dragging');
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isPhaseDragging) {
            e.preventDefault();
            const dx = e.clientX - phaseStartX;
            const dy = e.clientY - phaseStartY;
            const newX = Math.max(0, Math.min(window.innerWidth - 280, phaseInitialX + dx));
            const newY = Math.max(0, Math.min(window.innerHeight - 150, phaseInitialY + dy));
            
            phasePanel.style.left = newX + 'px';
            phasePanel.style.top = newY + 'px';
            phasePanel.style.right = 'auto';
            phasePanel.style.bottom = 'auto';
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isPhaseDragging) {
            isPhaseDragging = false;
            phasePanel.classList.remove('dragging');
            
            // 保存位置（保存left和top）
            const rect = phasePanel.getBoundingClientRect();
            const position = {
                left: rect.left,
                top: rect.top
            };
            localStorage.setItem('phasePanelPosition', JSON.stringify(position));
        }
    });
}
