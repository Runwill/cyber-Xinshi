// seat-picker-manager.js - 座位抽取器管理器

// 座位抽取器功能
function pickRandomSeat() {
    // 获取所有未出局的座位（未死亡、未票出、未自爆）
    const availableSeats = [];
    for (let i = 0; i < seats.length; i++) {
        if (!seats[i].dead && !seats[i].out && !seats[i].suicide) {
            availableSeats.push(i);
        }
    }
    
    const resultDiv = document.getElementById('seatPickerResult');
    
    // 如果没有可用座位，显示提示
    if (availableSeats.length === 0) {
        resultDiv.textContent = '无可用座位';
        resultDiv.className = 'seat-picker-result';
        return;
    }
    
    // 直接抽取结果
    const randomIndex = Math.floor(Math.random() * availableSeats.length);
    const pickedSeatIndex = availableSeats[randomIndex];
    
    // 显示结果
    resultDiv.textContent = `${pickedSeatIndex + 1}号`;
    resultDiv.className = 'seat-picker-result highlight';
    
    // 添加抽取记录到历史
    addSeatPickHistoryRecord(pickedSeatIndex + 1);
    
    // 3秒后移除高亮效果
    setTimeout(() => {
        resultDiv.className = 'seat-picker-result';
    }, 3000);
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

// 座位抽取器拖拽功能
function initSeatPickerDrag() {
    let isPickerDragging = false;
    let pickerStartX, pickerStartY, pickerInitialX, pickerInitialY;
    
    const pickerPanel = document.getElementById('seatPicker');
    const pickerHeader = pickerPanel.querySelector('.seat-picker-header');
    
    // 加载保存的位置
    const savedPickerPosition = localStorage.getItem('seatPickerPosition');
    if (savedPickerPosition) {
        try {
            const position = JSON.parse(savedPickerPosition);
            if (position.left !== undefined) {
                pickerPanel.style.left = position.left + 'px';
                pickerPanel.style.top = position.top + 'px';
                pickerPanel.style.right = 'auto';
                pickerPanel.style.bottom = 'auto';
                pickerPanel.style.transform = 'none';
            } else {
                pickerPanel.style.right = position.right + 'px';
                pickerPanel.style.bottom = position.bottom + 'px';
                pickerPanel.style.left = 'auto';
                pickerPanel.style.top = 'auto';
                pickerPanel.style.transform = 'none';
            }
        } catch (e) {
            // 如果解析失败，使用重置函数设置的默认位置
            resetSeatPickerPosition();
        }
    } else {
        // 如果没有保存位置，使用重置函数设置的默认位置
        resetSeatPickerPosition();
    }
    
    pickerHeader.addEventListener('mousedown', function(e) {
        isPickerDragging = true;
        pickerStartX = e.clientX;
        pickerStartY = e.clientY;
        const rect = pickerPanel.getBoundingClientRect();
        pickerInitialX = rect.left;
        pickerInitialY = rect.top;
        pickerPanel.classList.add('dragging');
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isPickerDragging) {
            e.preventDefault();
            const dx = e.clientX - pickerStartX;
            const dy = e.clientY - pickerStartY;
            const newX = Math.max(0, Math.min(window.innerWidth - 200, pickerInitialX + dx));
            const newY = Math.max(0, Math.min(window.innerHeight - 150, pickerInitialY + dy));
            
            pickerPanel.style.left = newX + 'px';
            pickerPanel.style.top = newY + 'px';
            pickerPanel.style.right = 'auto';
            pickerPanel.style.bottom = 'auto';
            pickerPanel.style.transform = 'none';
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isPickerDragging) {
            isPickerDragging = false;
            pickerPanel.classList.remove('dragging');
            
            // 保存位置（保存left和top）
            const rect = pickerPanel.getBoundingClientRect();
            const position = {
                left: rect.left,
                top: rect.top
            };
            localStorage.setItem('seatPickerPosition', JSON.stringify(position));
        }
    });
}
