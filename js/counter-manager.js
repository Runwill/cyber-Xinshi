// 计数器管理模块
// 计数器功能
let counter = 20;

function updateCounterDisplay() {
    document.getElementById('counterInput').value = counter;
}

function changeCounter(delta, seatIndex = null) {
    const oldCounter = counter;
    counter += delta;
    updateCounterDisplay();
    
    // 添加计数器变化的历史记录
    addCounterHistoryRecord(delta, oldCounter, counter, seatIndex);
    
    saveState();
}

function setCounter(val) {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    counter = num;
    updateCounterDisplay();
    saveState();
}

// 处理计数器输入框的键盘事件
function handleCounterKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        // 取消输入框选中状态
        event.target.blur();
        // 记录当前计数器数值到历史记录
        addEconomyHistoryRecord(counter);
    }
}
