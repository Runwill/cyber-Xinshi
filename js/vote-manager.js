// 投票管理模块

// 投票牌区域渲染
function renderVoteArea() {
    const voteArea = document.getElementById('voteArea');
    voteArea.innerHTML = '';
    let cardCount = 0;
    for (let i = 0; i < seats.length; i++) {
        if (seats[i].dead || seats[i].out || seats[i].suicide) continue;
        // 只要该座位没有投出去（即所有voteMap[x]都不包含i），则显示
        let used = false;
        for (let j = 0; j < voteMap.length; j++) {
            if (voteMap[j].includes(i)) used = true;
        }
        if (!used) {
            const card = document.createElement('div');
            card.className = 'vote-card';
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-voter', i);
            card.textContent = i + 1;
            card.ondragstart = function (e) {
                e.dataTransfer.setData('vote-card', i);
                setTimeout(() => card.classList.add('dragging'), 0);
            };
            card.ondragend = function () {
                card.classList.remove('dragging');
            };
            voteArea.appendChild(card);
            cardCount++;
        }
    }
    // 投票牌区宽度自适应，允许横向滚动
    voteArea.style.width = "auto";
    voteArea.style.minWidth = "100%";
    voteArea.style.maxWidth = "100%";
    voteArea.style.overflowX = "auto";
}

// 复制票型到剪贴板
function copyVotes() {
    // 统计每个目标座位收到的投票人
    let lines = [];
    for (let i = 0; i < voteMap.length; i++) {
        if (voteMap[i].length > 0) {
            // 投票人按座位号升序
            const voters = voteMap[i].slice().sort((a, b) => a - b).map(idx => (idx + 1)).join(' ');
            lines.push(`${voters}→${i + 1}`);
        }
    }
    // 统计弃票（未投票的座位）
    let allVoters = new Set();
    for (let i = 0; i < voteMap.length; i++) {
        for (const voter of voteMap[i]) {
            allVoters.add(voter);
        }
    }
    let unvoted = [];
    for (let i = 0; i < seats.length; i++) {
        if (seats[i].dead || seats[i].out || seats[i].suicide) continue;
        // 只统计未投票且未死亡且未票出且未自爆的座位
        let used = false;
        for (let j = 0; j < voteMap.length; j++) {
            if (voteMap[j].includes(i)) used = true;
        }
        if (!used) {
            unvoted.push(i + 1);
        }
    }
    if (unvoted.length > 0) {
        lines.push(`${unvoted.join(' ')}→弃票`);
    }
    const text = lines.join('\n');
    if (text) {
        // 添加到历史记录
        addVoteHistoryRecord(text);
        
        // 复制到剪贴板
        copyToClipboard(text, '票型已复制到剪贴板');
    } else {
        alert('当前没有投票数据');
    }
}

// 通用复制到剪贴板函数
function copyToClipboard(text, successMsg = '已复制到剪贴板') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg);
        }, () => {
            showToast('复制失败，请手动复制', 'error');
        });
    } else {
        // 兼容旧浏览器
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(successMsg);
        } catch {
            showToast('复制失败，请手动复制', 'error');
        }
        document.body.removeChild(textarea);
    }
}

// 显示提示消息的函数
function showToast(message, type = 'success') {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'error' ? 'rgba(231, 76, 60, 0.9)' : 'rgba(46, 204, 113, 0.9)'};
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: toastFadeIn 0.3s ease-out;
        pointer-events: none;
    `;
    
    // 添加动画样式
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            @keyframes toastFadeOut {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 2秒后开始消失动画
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.3s ease-in forwards';
        // 动画完成后移除元素
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 2000);
}

// 投票牌拖回投票区（移除投票）
function onVoteAreaDrop(e) {
    e.preventDefault();
    const voterIdx = parseInt(e.dataTransfer.getData('vote-card'), 10);
    if (!isNaN(voterIdx)) {
        // 移除所有投票
        for (let i = 0; i < voteMap.length; i++) {
            voteMap[i] = voteMap[i].filter(idx => idx !== voterIdx);
        }
        saveState();
        renderSeats();
        renderVoteArea();
    }
}

function resetVotes() {
    voteMap = [];
    for (let i = 0; i < seats.length; i++) voteMap.push([]);
    renderSeats();
    renderVoteArea();
    saveState();
}
