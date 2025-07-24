// 历史记录管理模块

// 历史记录功能
function addHistoryRecord(seatIndex, action) {
    const seatNumber = seatIndex + 1;
    const characterName = seats[seatIndex].name.trim() || '未知身份';
    let actionText;
    
    switch(action) {
        case 'death':
            actionText = '被杀死';
            break;
        case 'out':
            actionText = '被票出';
            break;
        case 'suicide':
            actionText = '自爆';
            break;
        case 'flip':
            actionText = '翻牌';
            break;
        case 'surrender':
            actionText = '叛变';
            break;
        default:
            actionText = '状态变更';
    }
    
    const record = {
        timestamp: new Date().toLocaleTimeString(),
        seatNumber: seatNumber,
        characterName: characterName,
        action: action,
        actionText: actionText,
        type: 'status'
    };
    
    history.push(record); // 添加到数组末尾，最新的在下面
   
    renderHistory();
    saveState();
}

function addCounterHistoryRecord(delta, oldValue, newValue, seatIndex = null) {
    let operatorSeat = seatIndex;
    
    // 如果没有指定座位，尝试找到当前得票最多且未死亡的座位作为操作者
    if (operatorSeat === null) {
        let maxVotes = 0;
        
        for (let i = 0; i < seats.length; i++) {
            const votes = (voteMap[i] || []).length;
            if (!seats[i].dead && !seats[i].out && !seats[i].suicide && votes > maxVotes) {
                maxVotes = votes;
                operatorSeat = i;
            }
        }
        
        // 如果还是没有找到，就不记录历史
        if (operatorSeat === null) return;
    }

    const seatNumber = operatorSeat + 1;
    const characterName = seats[operatorSeat].name.trim() || '未知身份';

    const record = {
        timestamp: new Date().toLocaleTimeString(),
        seatNumber: seatNumber,
        characterName: characterName,
        action: delta < 0 ? 'counter_decrease' : 'counter_increase',
        actionText: delta < 0 ? `发动技能 ${delta} =${newValue}` : `屯田 +${delta} =${newValue}`,
        economicChange: delta,
        remaining: newValue,
        type: 'counter'
    };
    
    history.push(record);
    renderHistory();
    saveState();
}

function addSkillHistoryRecord(selectedSeatIndexes, skillDetail = '') {
    if (selectedSeatIndexes.length === 0) return;
    
    let skillText = '';
    let seatNumbers = [];
    let characterNames = [];
    
    if (selectedSeatIndexes.length === 1) {
        // 只选中一个座位
        const seatIndex = selectedSeatIndexes[0];
        const seatNumber = seatIndex + 1;
        const characterName = seats[seatIndex].name.trim() || '未知身份';
        skillText = `<span class="seat-number">${seatNumber}</span><span class="character-name">${characterName}</span><span class="action">发动技能</span>`;
    } else {
        // 选中多个座位
        const firstSeatIndex = selectedSeatIndexes[0];
        const firstSeatNumber = firstSeatIndex + 1;
        const firstCharacterName = seats[firstSeatIndex].name.trim() || '未知身份';
        
        // 构建目标列表
        const targets = selectedSeatIndexes.slice(1).map(index => {
            const seatNumber = index + 1;
            const characterName = seats[index].name.trim() || '未知身份';
            return `<span class="seat-number">${seatNumber}</span><span class="character-name">${characterName}</span>`;
        }).join('');
        
        skillText = `<span class="seat-number">${firstSeatNumber}</span><span class="character-name">${firstCharacterName}</span>对${targets}<span class="action">发动技能</span>`;
    }
    
    const record = {
        timestamp: new Date().toLocaleTimeString(),
        action: 'skill',
        actionText: skillText,
        skillDetail: skillDetail || '', // 单独存储技能详情
        type: 'skill'
    };
    
    history.push(record);
    
    renderHistory();
    saveState();
}

// 添加经济记录
function addEconomyHistoryRecord(economyValue) {
    const record = {
        timestamp: new Date().toLocaleTimeString(),
        action: 'economy',
        actionText: '经济',
        economyValue: economyValue,
        type: 'economy'
    };
    
    history.push(record);
    
    renderHistory();
    saveState();
}

function addVoteHistoryRecord(voteText) {
    const record = {
        timestamp: new Date().toLocaleTimeString(),
        action: 'vote_summary',
        actionText: '投票',
        voteContent: voteText,
        type: 'vote'
    };
    
    history.push(record);
    
    renderHistory();
    saveState();
}

function addDayHistoryRecord(currentDay) {
    // 统计存活的玩家
    const alivePlayers = [];
    for (let i = 0; i < seats.length; i++) {
        if (!seats[i].dead && !seats[i].out && !seats[i].suicide) {
            const seatNumber = i + 1;
            const characterName = seats[i].name.trim() || '未知身份';
            alivePlayers.push(`${seatNumber}${characterName}`);
        }
    }
    
    const record = {
        timestamp: new Date().toLocaleTimeString(),
        action: 'day_start',
        actionText: `第${currentDay}天`,
        dayCount: currentDay,
        economyValue: counter,
        alivePlayers: alivePlayers,
        type: 'day'
    };
    
    history.push(record);
    
    renderHistory();
    saveState();
}

function addSeatPickHistoryRecord(seatNumber) {
    const record = {
        timestamp: new Date().toLocaleTimeString(),
        seatNumber: seatNumber,
        type: 'seat_pick',
        actionText: `抽取到 ${seatNumber}号`
    };
    
    history.push(record);
    renderHistory();
    saveState();
}

// 复制单个历史记录
function copyHistoryRecord(index) {
    if (index < 0 || index >= history.length) return;
    
    const record = history[index];
    let copyText = '';
    
    if (record.type === 'counter') {
        // 计数器相关记录：去掉身份，保留座位号和动作
        copyText = `${record.seatNumber}号${record.actionText}`;
    } else if (record.type === 'vote') {
        // 票型记录：保留票型内容
        copyText = `${record.actionText}\n${record.voteContent}`;
    } else if (record.type === 'economy') {
        // 经济记录：保留经济信息
        copyText = `${record.actionText}${record.economyValue}`;
    } else if (record.type === 'skill') {
        // 技能发动记录：去除HTML标签和身份，只保留座位号和技能详情
        let skillText = record.actionText.replace(/<[^>]*>/g, '').replace(/[^\d号对发动技能]/g, match => {
            // 保留数字、"号"、"对"、"发动技能"等关键词，移除身份名称
            return ['号', '对', '发', '动', '技', '能'].includes(match) ? match : '';
        });
        // 简化处理：提取座位号并重构文本
        const seatNumbers = record.actionText.match(/\d+/g) || [];
        if (seatNumbers.length === 1) {
            skillText = `${seatNumbers[0]}号发动技能`;
        } else if (seatNumbers.length > 1) {
            const [first, ...targets] = seatNumbers;
            skillText = `${first}号对${targets.join('号、')}号发动技能`;
        }
        if (record.skillDetail) {
            skillText += ' ' + record.skillDetail;
        }
        copyText = skillText;
    } else if (record.type === 'seat_pick') {
        // 座位抽取记录：保留抽取结果
        copyText = record.actionText;
    } else if (record.type === 'day') {
        // 日数记录：去掉身份，只保留座位号
        const aliveSeats = record.alivePlayers ? record.alivePlayers.map(player => {
            // 提取座位号（数字部分）
            const match = player.match(/^(\d+)/);
            return match ? match[1] + '号' : '';
        }).filter(seat => seat).join('、') : '';
        const economyInfo = record.economyValue !== undefined ? record.economyValue : '';
        copyText = `${record.actionText} 经济：${economyInfo} 存活：${aliveSeats}`;
    } else {
        // 状态变化记录：去掉身份，保留座位号和动作
        copyText = `${record.seatNumber}号${record.actionText}`;
    }
    
    // 复制到剪贴板
    copyToClipboard(copyText, '记录已复制到剪贴板（不含身份）');
}

function renderHistory() {
    const historyContent = document.getElementById('historyContent');
    if (history.length === 0) {
        historyContent.innerHTML = '<div style="color:#888;text-align:center;padding:20px;">暂无记录</div>';
        return;
    }
    
    historyContent.innerHTML = history.map((record, index) => {
        if (record.type === 'counter') {
            // 计数器相关记录
            const isDecrease = record.economicChange < 0;
            const cssClass = isDecrease ? 'economy_loss' : 'economy_gain';
            const economyValueColor = record.remaining < 10 ? 'color: #ff4444;' : '';
            // 分离actionText中的经济值部分
            const actionTextParts = record.actionText.split('=');
            const baseText = actionTextParts[0] + '=';
            const economyValue = actionTextParts[1] || '';
            return `
                <div class="history-item ${cssClass}">
                    <span class="seat-number">${record.seatNumber}</span><span class="character-name">${record.characterName}</span><span class="action">${baseText}<span style="${economyValueColor}">${economyValue}</span></span>
                    <div style="font-size:12px;color:#aaa;margin-top:2px;">${record.timestamp}</div>
                    <button class="copy-btn" onclick="copyHistoryRecord(${index})" title="复制此记录">📋</button>
                    <button class="delete-btn" onclick="deleteHistoryRecord(${index})" title="删除此记录">×</button>
                </div>
            `;
        } else if (record.type === 'vote') {
            // 票型记录
            return `
                <div class="history-item vote_summary">
                    <span class="action">${record.actionText}</span>
                    <div style="font-size:13px;color:#ccc;margin-top:4px;line-height:1.3;white-space:pre-line;">${record.voteContent}</div>
                    <div style="font-size:12px;color:#aaa;margin-top:2px;">${record.timestamp}</div>
                    <button class="copy-btn" onclick="copyHistoryRecord(${index})" title="复制此记录">📋</button>
                    <button class="delete-btn" onclick="deleteHistoryRecord(${index})" title="删除此记录">×</button>
                </div>
            `;
        } else if (record.type === 'economy') {
            // 经济记录
            const economyValueColor = record.economyValue < 10 ? 'color: #ff4444;' : 'color:#fff;';
            return `
                <div class="history-item economy">
                    <span class="action" style="color:#fff;">${record.actionText}<span style="${economyValueColor}">${record.economyValue}</span></span>
                    <div style="font-size:12px;color:#aaa;margin-top:2px;">${record.timestamp}</div>
                    <button class="copy-btn" onclick="copyHistoryRecord(${index})" title="复制此记录">📋</button>
                    <button class="delete-btn" onclick="deleteHistoryRecord(${index})" title="删除此记录">×</button>
                </div>
            `;
        } else if (record.type === 'day') {
            // 日数记录
            const economyValueColor = record.economyValue < 10 ? 'color: #ff4444;' : 'color:#fff;';
            return `
                <div class="history-item day_start">
                    <span class="action" style="color:#4fc3f7;font-weight:bold;">${record.actionText}</span>
                    <div style="font-size:13px;margin-top:4px;">
                        <span style="color:#fff;">经济：</span><span style="${economyValueColor}">${record.economyValue}</span> | <span style="color:#fff;">存活：${record.alivePlayers.join('、')}</span>
                    </div>
                    <div style="font-size:12px;color:#aaa;margin-top:2px;">${record.timestamp}</div>
                    <button class="copy-btn" onclick="copyHistoryRecord(${index})" title="复制此记录">📋</button>
                    <button class="delete-btn" onclick="deleteHistoryRecord(${index})" title="删除此记录">×</button>
                </div>
            `;
        } else if (record.type === 'skill') {
            // 技能发动记录
            let skillDetailDisplay = '';
            if (record.skillDetail) {
                skillDetailDisplay = `<div style="font-size:13px;color:#fff;margin-top:4px;background:rgba(52,152,219,0.3);padding:4px 8px;border-radius:4px;">${record.skillDetail}</div>`;
            }
            return `
                <div class="history-item skill">
                    <span class="action">${record.actionText}</span>
                    ${skillDetailDisplay}
                    <div style="font-size:12px;color:#aaa;margin-top:2px;">${record.timestamp}</div>
                    <button class="copy-btn" onclick="copyHistoryRecord(${index})" title="复制此记录">📋</button>
                    <button class="delete-btn" onclick="deleteHistoryRecord(${index})" title="删除此记录">×</button>
                </div>
            `;
        } else if (record.type === 'seat_pick') {
            // 座位抽取记录
            return `
                <div class="history-item seat_pick" style="border-left-color: #9b59b6;">
                    <span class="action">${record.actionText}</span>
                    <div style="font-size:12px;color:#aaa;margin-top:2px;">${record.timestamp}</div>
                    <button class="copy-btn" onclick="copyHistoryRecord(${index})" title="复制此记录">📋</button>
                    <button class="delete-btn" onclick="deleteHistoryRecord(${index})" title="删除此记录">×</button>
                </div>
            `;
        } else if (record.type === 'general') {
            // 通用记录（计时器等）
            let detailDisplay = '';
            if (record.detail) {
                detailDisplay = `<div style="font-size:13px;color:#ccc;margin-top:4px;">${record.detail}</div>`;
            }
            return `
                <div class="history-item general" style="border-left-color: #16a085;">
                    <span class="action">${record.actionText}</span>
                    ${detailDisplay}
                    <div style="font-size:12px;color:#aaa;margin-top:2px;">${record.timestamp}</div>
                    <button class="copy-btn" onclick="copyHistoryRecord(${index})" title="复制此记录">📋</button>
                    <button class="delete-btn" onclick="deleteHistoryRecord(${index})" title="删除此记录">×</button>
                </div>
            `;
        } else {
            // 状态变化记录（死亡/票出）
            return `
                <div class="history-item ${record.action}">
                    <span class="seat-number">${record.seatNumber}</span><span class="character-name">${record.characterName}</span><span class="action">${record.actionText}</span>
                    <div style="font-size:12px;color:#aaa;margin-top:2px;">${record.timestamp}</div>
                    <button class="copy-btn" onclick="copyHistoryRecord(${index})" title="复制此记录">📋</button>
                    <button class="delete-btn" onclick="deleteHistoryRecord(${index})" title="删除此记录">×</button>
                </div>
            `;
        }
    }).join('');
    
    // 自动滚动到底部显示最新记录
    setTimeout(() => {
        historyContent.scrollTop = historyContent.scrollHeight;
    }, 0);
}

function clearHistory() {
    if (confirm('确定要清空历史记录吗？')) {
        history = [];
        renderHistory();
        saveState();
    }
}

function deleteHistoryRecord(index) {
    if (index >= 0 && index < history.length) {
        history.splice(index, 1);
        renderHistory();
        saveState();
    }
}

function exportHistory() {
    if (history.length === 0) {
        alert('没有历史记录可以导出');
        return;
    }

    // 提取除时间外的历史消息
    const exportText = history.map(record => {
        if (record.type === 'counter') {
            // 计数器相关记录：座位号+角色名+动作
            return `${record.seatNumber}${record.characterName}${record.actionText}`;
        } else if (record.type === 'vote') {
            // 票型记录：票型记录+内容
            return `${record.actionText}\n${record.voteContent}`;
        } else if (record.type === 'economy') {
            // 经济记录：经济+数值
            return `${record.actionText}${record.economyValue}`;
        } else if (record.type === 'skill') {
            // 技能发动记录：去除HTML标签，只保留纯文本，并包含技能详情
            let skillText = record.actionText.replace(/<[^>]*>/g, '');
            if (record.skillDetail) {
                skillText += ' ' + record.skillDetail;
            }
            return skillText;
        } else if (record.type === 'seat_pick') {
            // 座位抽取记录：抽取结果
            return record.actionText;
        } else if (record.type === 'day') {
            // 日数记录：包含天数、经济和存活玩家信息
            const aliveInfo = record.alivePlayers ? record.alivePlayers.join('、') : '';
            const economyInfo = record.economyValue !== undefined ? record.economyValue : '';
            return `${record.actionText} 经济：${economyInfo} 存活：${aliveInfo}`;
        } else {
            // 状态变化记录：座位号+角色名+动作
            return `${record.seatNumber}${record.characterName}${record.actionText}`;
        }
    }).join('\n');

    // 复制到剪贴板
    copyToClipboard(exportText, '历史记录已复制到剪贴板');
}

// 添加通用历史记录 - 用于计时器等非座位相关的操作
function addGeneralHistoryRecord(title, action, detail = '') {
    const record = {
        timestamp: new Date().toLocaleTimeString(),
        action: 'general',
        actionText: `${title} ${action}`,
        detail: detail,
        type: 'general'
    };
    
    history.push(record);
    renderHistory();
    saveState();
}

// 创建历史管理器对象以便其他模块使用
const historyManager = {
    addEntry: addGeneralHistoryRecord,
    addSeatRecord: addHistoryRecord,
    addCounterRecord: addCounterHistoryRecord,
    addSkillRecord: addSkillHistoryRecord,
    addEconomyRecord: addEconomyHistoryRecord,
    addVoteRecord: addVoteHistoryRecord,
    addDayRecord: addDayHistoryRecord,
    addSeatPickRecord: addSeatPickHistoryRecord
};
