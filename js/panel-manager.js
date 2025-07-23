// panel-manager.js - 面板管理器

// 历史记录框拖动和调节功能
let isDragging = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
let resizeStartPos = { x: 0, y: 0 };
let resizeStartSize = { width: 0, height: 0 };
const defaultPosition = { left: 20, bottom: 20 };
const defaultSize = { width: 360, height: 240 };

function initHistoryPanelDrag() {
    const historyPanel = document.getElementById('historyPanel');
    const historyHeader = historyPanel.querySelector('.history-header');
    const resizeHandle = document.getElementById('historyResizeHandle');
    
    // 加载保存的位置和大小
    const savedPosition = localStorage.getItem('historyPanelPosition');
    const savedSize = localStorage.getItem('historyPanelSize');
    
    if (savedPosition) {
        try {
            const position = JSON.parse(savedPosition);
            historyPanel.style.left = position.left + 'px';
            historyPanel.style.bottom = position.bottom + 'px';
        } catch (e) {
            // 如果解析失败，使用默认位置
            resetHistoryPanelPosition();
        }
    }
    
    if (savedSize) {
        try {
            const size = JSON.parse(savedSize);
            historyPanel.style.width = size.width + 'px';
            historyPanel.style.maxHeight = size.height + 'px';
        } catch (e) {
            // 如果解析失败，使用默认大小
            resetHistoryPanelSize();
        }
    } else {
        // 如果没有保存的大小，使用默认大小
        resetHistoryPanelSize();
    }

    // 拖动功能
    historyHeader.addEventListener('mousedown', function(e) {
        if (e.target === resizeHandle) return; // 避免与调节功能冲突
        isDragging = true;
        historyPanel.classList.add('dragging');
        
        const rect = historyPanel.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        // 防止文本选择
        e.preventDefault();
    });

    // 调节大小功能
    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        resizeStartPos.x = e.clientX;
        resizeStartPos.y = e.clientY;
        
        const rect = historyPanel.getBoundingClientRect();
        resizeStartSize.width = rect.width;
        resizeStartSize.height = rect.height;
        
        historyPanel.classList.add('dragging'); // 复用拖拽样式
        
        // 防止文本选择和事件冒泡
        e.preventDefault();
        e.stopPropagation();
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging && !isResizing) {
            // 拖动面板
            e.preventDefault();
            
            // 计算新位置
            let newLeft = e.clientX - dragOffset.x;
            let newTop = e.clientY - dragOffset.y;
            
            // 限制在视窗范围内
            const panelRect = historyPanel.getBoundingClientRect();
            const maxLeft = window.innerWidth - panelRect.width;
            const maxTop = window.innerHeight - panelRect.height;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            // 设置位置（使用left和top而不是bottom）
            historyPanel.style.left = newLeft + 'px';
            historyPanel.style.top = newTop + 'px';
            historyPanel.style.bottom = 'auto';
        } else if (isResizing) {
            // 调节面板大小
            e.preventDefault();
            
            const deltaX = e.clientX - resizeStartPos.x;
            const deltaY = e.clientY - resizeStartPos.y;
            
            let newWidth = resizeStartSize.width + deltaX;
            let newHeight = resizeStartSize.height + deltaY;
            
            // 设置最小和最大尺寸
            newWidth = Math.max(280, Math.min(newWidth, window.innerWidth - 40));
            newHeight = Math.max(200, Math.min(newHeight, window.innerHeight - 40));
            
            historyPanel.style.width = newWidth + 'px';
            historyPanel.style.maxHeight = newHeight + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging || isResizing) {
            historyPanel.classList.remove('dragging');
            
            if (isDragging) {
                // 保存位置
                const rect = historyPanel.getBoundingClientRect();
                const position = {
                    left: rect.left,
                    bottom: window.innerHeight - rect.bottom
                };
                localStorage.setItem('historyPanelPosition', JSON.stringify(position));
            }
            
            if (isResizing) {
                // 保存大小
                const rect = historyPanel.getBoundingClientRect();
                const size = {
                    width: rect.width,
                    height: rect.height
                };
                localStorage.setItem('historyPanelSize', JSON.stringify(size));
            }
            
            isDragging = false;
            isResizing = false;
        }
    });
}

function resetHistoryPanelPosition() {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.style.left = defaultPosition.left + 'px';
    historyPanel.style.bottom = defaultPosition.bottom + 'px';
    historyPanel.style.top = 'auto';
    
    // 清除保存的位置
    localStorage.removeItem('historyPanelPosition');
}

function resetHistoryPanelSize() {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.style.width = defaultSize.width + 'px';
    historyPanel.style.maxHeight = defaultSize.height + 'px';
    
    // 清除保存的大小
    localStorage.removeItem('historyPanelSize');
}

function resetSeatPickerPosition() {
    const seatPicker = document.getElementById('seatPicker');
    // 重置到流程标志框的左侧位置
    seatPicker.style.right = '320px'; // 流程标志框宽度280px + 间距40px
    seatPicker.style.top = '20px';
    seatPicker.style.left = 'auto';
    seatPicker.style.bottom = 'auto';
    seatPicker.style.transform = 'none';
    
    // 清除保存的位置
    localStorage.removeItem('seatPickerPosition');
}
