// 身份信息面板管理模块
class RoleInfoPanelManager {
    constructor() {
        this.panel = null;
        this.currentSeatIndex = -1;
        this.initialized = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
    }

    init() {
        if (this.initialized) return;
        
        console.log('初始化身份信息面板...');
        
        // 创建面板元素
        this.panel = document.createElement('div');
        this.panel.className = 'role-info-panel';
        this.panel.innerHTML = `
            <div class="role-info-header">
                <span>身份信息</span>
            </div>
            <div class="role-info-content">
                <div class="role-info-empty">鼠标悬停在座位上查看身份信息</div>
            </div>
        `;
        document.body.appendChild(this.panel);
        
        // 加载保存的位置
        this.loadSavedPosition();
        
        // 添加拖拽功能
        this.initDragFunctionality();
        
        console.log('身份信息面板已创建并添加到DOM');
        this.initialized = true;
    }

    // 加载保存的位置
    loadSavedPosition() {
        const savedPosition = localStorage.getItem('roleInfoPanelPosition');
        if (savedPosition) {
            try {
                const position = JSON.parse(savedPosition);
                if (position.left !== undefined) {
                    this.panel.style.left = position.left + 'px';
                    this.panel.style.top = position.top + 'px';
                    this.panel.style.right = 'auto';
                    this.panel.style.bottom = 'auto';
                } else {
                    this.panel.style.right = position.right + 'px';
                    this.panel.style.top = position.top + 'px';
                    this.panel.style.left = 'auto';
                    this.panel.style.bottom = 'auto';
                }
            } catch (e) {
                // 如果解析失败，使用默认位置
                console.log('解析保存的身份信息面板位置失败，使用默认位置');
            }
        }
    }

    // 初始化拖拽功能
    initDragFunctionality() {
        const header = this.panel.querySelector('.role-info-header');
        
        header.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.panel.classList.add('dragging');
            
            const rect = this.panel.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            document.addEventListener('mousemove', this.handleDragMove);
            document.addEventListener('mouseup', this.handleDragEnd);
            
            e.preventDefault();
        });
    }

    handleDragMove = (e) => {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        // 确保面板不会被拖出视窗
        const maxX = window.innerWidth - this.panel.offsetWidth;
        const maxY = window.innerHeight - this.panel.offsetHeight;
        
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));
        
        this.panel.style.left = `${boundedX}px`;
        this.panel.style.top = `${boundedY}px`;
        this.panel.style.right = 'auto'; // 移除右侧定位
    };

    handleDragEnd = () => {
        this.isDragging = false;
        this.panel.classList.remove('dragging');
        
        document.removeEventListener('mousemove', this.handleDragMove);
        document.removeEventListener('mouseup', this.handleDragEnd);
        
        // 保存位置
        this.savePosition();
    };

    // 保存当前位置到localStorage
    savePosition() {
        const rect = this.panel.getBoundingClientRect();
        const position = {
            left: rect.left,
            top: rect.top
        };
        localStorage.setItem('roleInfoPanelPosition', JSON.stringify(position));
    }

    // 显示身份信息
    show(seatIndex) {
        if (!this.initialized) {
            this.init();
        }
        
        console.log(`显示身份信息 - 座位${seatIndex + 1}`);
        
        this.currentSeatIndex = seatIndex;
        
        // 获取座位信息
        if (!seats[seatIndex]) {
            console.log('座位数据不存在');
            this.showEmpty();
            return;
        }

        const seatName = seats[seatIndex].name.trim();
        const content = this.panel.querySelector('.role-info-content');

        console.log(`座位名称: "${seatName}"`);

        // 清除所有阵营类名
        this.panel.classList.remove('song', 'outsider', 'mongolia', 'third', 'unknown');

        if (seatName && charactersDict[seatName]) {
            // 身份已知
            const roleInfo = charactersDict[seatName];
            
            content.innerHTML = `
                <div class="role-info-name">${seatName}</div>
                <div class="role-info-faction">${roleInfo.faction}</div>
                <div class="role-info-seat">${seatIndex + 1}号位</div>
            `;
            
            console.log(`身份信息: ${seatName} - ${roleInfo.faction} (${roleInfo.class})`);
            
            // 添加对应的阵营类名
            this.panel.classList.add(roleInfo.class);
        } else {
            // 身份未知或空白
            const displayName = seatName || '空白';
            const displayInfo = seatName ? '未知身份' : '空白座位';
            
            content.innerHTML = `
                <div class="role-info-name">${displayName}</div>
                <div class="role-info-faction">${displayInfo}</div>
                <div class="role-info-seat">${seatIndex + 1}号位</div>
            `;
            
            this.panel.classList.add('unknown');
            
            console.log(`未知身份: ${displayName} - ${displayInfo}`);
        }
    }

    // 显示空状态
    showEmpty() {
        const content = this.panel.querySelector('.role-info-content');
        content.innerHTML = `
            <div class="role-info-empty">鼠标悬停在座位上查看身份信息</div>
        `;
        
        // 清除所有阵营类名
        this.panel.classList.remove('song', 'outsider', 'mongolia', 'third', 'unknown');
        this.currentSeatIndex = -1;
    }

    // 更新当前显示的身份信息内容
    update() {
        if (this.currentSeatIndex >= 0) {
            this.show(this.currentSeatIndex);
        }
    }
}

// 创建全局实例
const roleInfoPanelManager = new RoleInfoPanelManager();

// 为座位添加鼠标事件监听器的函数
function addRoleInfoListeners() {
    console.log('开始添加身份信息面板事件监听器...');
    
    const seats = document.querySelectorAll('.seat');
    console.log(`找到 ${seats.length} 个座位元素`);
    
    seats.forEach((seat, index) => {
        const seatIndex = seat.getAttribute('data-index');
        console.log(`为座位 ${seatIndex} 添加事件监听器`);
        
        // 移除旧的事件监听器（如果存在）
        seat.removeEventListener('mouseenter', handleSeatMouseEnter);
        seat.removeEventListener('mouseleave', handleSeatMouseLeave);
        
        // 添加新的事件监听器
        seat.addEventListener('mouseenter', handleSeatMouseEnter);
        seat.addEventListener('mouseleave', handleSeatMouseLeave);
    });
    
    console.log('身份信息面板事件监听器添加完成');
}

// 座位鼠标进入事件处理
function handleSeatMouseEnter(event) {
    const seatElement = event.currentTarget;
    const seatIndex = parseInt(seatElement.getAttribute('data-index'));
    
    console.log(`鼠标进入座位 ${seatIndex + 1}`);
    
    roleInfoPanelManager.show(seatIndex);
}

// 座位鼠标离开事件处理
function handleSeatMouseLeave(event) {
    // 鼠标离开座位时不做任何操作，保持面板显示最后悬停的座位信息
    console.log('鼠标离开座位，保持面板显示');
}

// 重置身份信息面板位置
function resetRoleInfoPanelPosition() {
    if (roleInfoPanelManager.panel) {
        roleInfoPanelManager.panel.style.right = '20px';
        roleInfoPanelManager.panel.style.top = '280px';
        roleInfoPanelManager.panel.style.left = 'auto';
        roleInfoPanelManager.panel.style.bottom = 'auto';
        
        // 清除保存的位置
        localStorage.removeItem('roleInfoPanelPosition');
    }
}

// 在座位渲染后调用此函数来添加事件监听器
// 在座位渲染后调用此函数来添加事件监听器
function initRoleTooltip() {
    console.log('初始化身份信息面板...');
    
    // 确保管理器已初始化
    if (!roleInfoPanelManager.initialized) {
        roleInfoPanelManager.init();
    }
    
    // 延迟执行以确保座位已经渲染完成
    setTimeout(() => {
        addRoleInfoListeners();
    }, 100);
}

// 监听座位名称变化，更新身份信息面板内容
function onSeatNameChanged() {
    roleInfoPanelManager.update();
}
