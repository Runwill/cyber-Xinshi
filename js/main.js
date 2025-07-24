// main.js - 主初始化模块

// 初始化流程
function initializeApplication() {
    // 设置页面标题
    document.getElementById('pageTitle').textContent = `${APP_NAME}${APP_VERSION}`;
    document.title = `${APP_NAME}${APP_VERSION}`;
    
    // 加载状态
    loadState();
    
    // 初始化座位
    if (seats.length === 0) {
        initSeats(12);
    }
    
    // 初始化投票映射
    if (voteMap.length !== seats.length) {
        voteMap = [];
        for (let i = 0; i < seats.length; i++) voteMap.push([]);
    }
    
    // 渲染界面
    renderSeats();
    renderVoteArea();
    renderHistory();
    updateCounterDisplay();
    updatePhaseDisplay();
    
    // 初始化各种功能
    initHistoryPanelDrag();
    initSeatPickerDrag();
    initPhasePanelDrag();
    initRoleFilterEvents();
    initDragHandlers();
    initGlobalKeyEvents();
    initTimer();
    
    // 暴露全局函数
    exposeGlobalFunctions();
}

// 暴露全局函数
function exposeGlobalFunctions() {
    window.updateName = updateName;
    window.selectName = selectName;
    window.clearName = clearName;
    window.setCounter = setCounter;
    window.changeCounter = changeCounter;
    window.handleCounterKeydown = handleCounterKeydown;
    window.showDropdown = showDropdown;
    window.showRoleFilterDialog = showRoleFilterDialog;
    window.resetAll = resetAll;
    window.copyVotes = copyVotes;
    window.resetVotes = resetVotes;
    window.onVoteAreaDrop = onVoteAreaDrop;
    window.toggleRoleCounters = toggleRoleCounters;
    window.clearHistory = clearHistory;
    window.deleteHistoryRecord = deleteHistoryRecord;
    window.copyHistoryRecord = copyHistoryRecord;
    window.exportHistory = exportHistory;
    window.handleNameEditKeyDown = handleNameEditKeyDown;
    window.handleNameEditKeyUp = handleNameEditKeyUp;
    window.toggleDayNight = toggleDayNight;
    window.changeDayCount = changeDayCount;
    window.prevPhaseStep = prevPhaseStep;
    window.nextPhaseStep = nextPhaseStep;
    window.pickRandomSeat = pickRandomSeat;
    window.setSkillPreset = setSkillPreset;
    window.toggleTimer = toggleTimer;
    window.resetTimer = resetTimer;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
});

// 暴露初始化函数
window.initializeApplication = initializeApplication;
