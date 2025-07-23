// 座位管理模块
// 座位管理功能常量
const minSeats = 5;
const maxSeats = 20;

// 座位相关数据
let seats = [];
let selectedSeats = [];

// 初始化座位
function initSeats(count) {
    seats = [];
    for (let i = 0; i < count; i++) {
        seats.push({ name: "", dead: false, out: false, suicide: false, flipped: false, surrendered: false }); // 初始名牌内容为空
    }
    // 初始化投票
    voteMap = [];
    for (let i = 0; i < count; i++) voteMap.push([]);
}

// 渲染座位
function renderSeats() {
    const container = document.getElementById('circleContainer');
    container.innerHTML = '';
    const n = seats.length;
    const radius = 250;
    const centerX = 300;
    const centerY = 300;

    // 统计每个座位的得票数，找出最大值
    let maxVotes = 0;
    let votesArr = [];
    for (let i = 0; i < n; i++) {
        votesArr[i] = (voteMap[i] || []).length;
        if (!seats[i].dead && votesArr[i] > maxVotes) {
            maxVotes = votesArr[i];
        }
    }

    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI / n) * i - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - 50;
        const y = centerY + radius * Math.sin(angle) - 30;
        // 判断是否为得票最多且未死亡的座位
        let highlight = (!seats[i].dead && votesArr[i] === maxVotes && maxVotes > 0) ? ' highlight' : '';
        
        // 判断座位选中状态
        let selectedClass = '';
        if (selectedSeats.includes(i)) {
            if (selectedSeats[0] === i) {
                selectedClass = ' selected-first';
            } else {
                selectedClass = ' selected-other';
            }
        }
        
        const seatDiv = document.createElement('div');
        seatDiv.className = 'seat' + (seats[i].dead ? ' death' : '') + (seats[i].out ? ' out' : '') + (seats[i].suicide ? ' suicide' : '') + (seats[i].flipped ? ' flipped' : '') + (seats[i].surrendered ? ' surrendered' : '') + highlight + selectedClass;
        seatDiv.style.left = `${x}px`;
        seatDiv.style.top = `${y}px`;
        seatDiv.setAttribute('data-index', i);

        // 检查当前座位的身份是否有专属计数按钮（死亡、票出或自爆的座位不显示）
        const currentName = seats[i].name.trim();
        const hasRoleCounters = roleCounterDict.hasOwnProperty(currentName) && !seats[i].dead && !seats[i].out && !seats[i].suicide;

        // 使用通用函数生成下拉菜单内容
        const inputValue = seats[i].name.trim();
        const dropdownHtml = generateDropdownHtml(i, inputValue);

        // 构建角色计数按钮HTML
        const roleCounterHtml = hasRoleCounters ? 
            `<button class="role-counter-toggle" onclick="toggleRoleCounters(${i})" title="展开专属计数">⚙</button>
             <div class="role-counter-buttons" id="roleCounters-${i}">
                 ${roleCounterDict[currentName].map(value => 
                     `<button class="role-counter-btn ${value < 0 ? 'negative' : 'positive'}" 
                         onclick="changeCounter(${value}, ${i})">${value > 0 ? '+' + value : value}</button>`
                 ).join('')}
             </div>` : '';

        // 构建状态图标HTML
        const statusIcons = [
            seats[i].dead ? `<div class="death-icon" draggable="true" ondragstart="onSeatDeathDragStart(event, ${i})" title="死亡"></div>` : '',
            seats[i].out ? `<div class="out-icon" draggable="true" ondragstart="onSeatOutDragStart(event, ${i})" title="票出"></div>` : '',
            seats[i].suicide ? `<div class="suicide-icon" draggable="true" ondragstart="onSeatSuicideDragStart(event, ${i})" title="自爆"></div>` : '',
            seats[i].flipped ? `<div class="flip-icon" draggable="true" ondragstart="onSeatFlipDragStart(event, ${i})" title="翻牌">翻</div>` : '',
            seats[i].surrendered ? `<div class="surrender-icon" draggable="true" ondragstart="onSeatSurrenderDragStart(event, ${i})" title="叛变">叛</div>` : ''
        ].filter(icon => icon).join('');

        seatDiv.innerHTML = `
            <div class="seat-number">${i + 1}</div>
            <div class="name-edit-wrap" style="position:relative;">
                <input class="name-edit" type="text" value="${seats[i].name}" 
                    onfocus="showDropdown(${i})" onclick="event.stopPropagation();showDropdown(${i})" 
                    oninput="updateName(${i}, this.value);updateDropdown(${i})" 
                    onkeydown="handleNameEditKeyDown(event, ${i})"
                    onkeyup="handleNameEditKeyUp(event, ${i})"
                    autocomplete="off" />
                <div class="dropdown-list" id="dropdown-${i}">
                    ${dropdownHtml}
                </div>
            </div>
            ${roleCounterHtml}
            ${statusIcons}
        `;
        container.appendChild(seatDiv);

        // Alt键显示完整角色列表功能
        const nameInput = seatDiv.querySelector('.name-edit');
        let altListenerAdded = false;
        let lastAltState = false;
        function updateDropdownAlt(forceShowAll) {
            const inputValue = seats[i].name.trim();
            const dropdownHtml = window.generateDropdownHtml(i, inputValue, forceShowAll);
            const dropdown = document.getElementById('dropdown-' + i);
            if (dropdown) dropdown.innerHTML = dropdownHtml;
        }
        function altKeyHandler(e) {
            if (e.altKey && !lastAltState) {
                e.preventDefault(); // 阻止Alt键的默认行为，避免失去焦点
                lastAltState = true;
                updateDropdownAlt(true);
            } else if (!e.altKey && lastAltState) {
                lastAltState = false;
                updateDropdownAlt(false);
            }
        }
        function keyupHandler(e) {
            if (e.key === 'Alt' && lastAltState) {
                e.preventDefault(); // 阻止Alt键的默认行为，避免失去焦点
                lastAltState = false;
                updateDropdownAlt(false);
            }
        }
        nameInput.addEventListener('focus', function() {
            if (!altListenerAdded) {
                document.addEventListener('keydown', altKeyHandler);
                document.addEventListener('keyup', keyupHandler);
                altListenerAdded = true;
            }
        });
        nameInput.addEventListener('blur', function() {
            if (altListenerAdded) {
                document.removeEventListener('keydown', altKeyHandler);
                document.removeEventListener('keyup', keyupHandler);
                altListenerAdded = false;
                lastAltState = false;
                updateDropdownAlt(false);
            }
        });
        
        // 为名牌输入框添加特殊的点击事件处理
        nameInput.addEventListener('click', function(e) {
            if (e.ctrlKey || e.metaKey) {
                // 按住Ctrl时点击名牌，阻止默认行为并选中座位
                e.preventDefault();
                e.stopPropagation();
                toggleSeatSelection(i);
            }
        });
        // 座位点击事件处理
        seatDiv.addEventListener('click', function(e) {
            // 阻止事件冒泡，避免触发关闭下拉列表
            e.stopPropagation();
            
            if (e.ctrlKey || e.metaKey) {
                // 按住Ctrl时进行多选操作，即使点击到名牌也选中座位
                e.preventDefault(); // 阻止默认行为（如聚焦到输入框）
                toggleSeatSelection(i);
            } else {
                // 普通点击时清除所有选中状态
                if (selectedSeats.length > 0) {
                    clearSeatSelection();
                }
            }
        });

        // 拖放事件
        seatDiv.ondragover = (e) => {
            if (e.dataTransfer.types.includes('vote-card')) e.preventDefault();
            if (e.dataTransfer.types.includes('text/plain') && e.dataTransfer.getData('text/plain') === 'death') e.preventDefault();
            if (e.dataTransfer.types.includes('text/plain') && e.dataTransfer.getData('text/plain') === 'out') e.preventDefault();
            if (e.dataTransfer.types.includes('text/plain') && e.dataTransfer.getData('text/plain') === 'suicide') e.preventDefault();
            if (e.dataTransfer.types.includes('text/plain') && e.dataTransfer.getData('text/plain') === 'flip') e.preventDefault();
            if (e.dataTransfer.types.includes('text/plain') && e.dataTransfer.getData('text/plain') === 'surrender') e.preventDefault();
        };
        seatDiv.ondrop = (e) => {
            e.preventDefault();
            // 死亡标记
            if (e.dataTransfer.getData('text/plain') === 'death') {
                markDead(i, true);
                return;
            }
            // 票出标记
            if (e.dataTransfer.getData('text/plain') === 'out') {
                markOut(i, !seats[i].out);
                return;
            }
            // 自爆标记
            if (e.dataTransfer.getData('text/plain') === 'suicide') {
                markSuicide(i, !seats[i].suicide);
                return;
            }
            // 翻牌标记
            if (e.dataTransfer.getData('text/plain') === 'flip') {
                markFlipped(i, !seats[i].flipped);
                return;
            }
            // 叛变标记
            if (e.dataTransfer.getData('text/plain') === 'surrender') {
                markSurrendered(i, !seats[i].surrendered);
                return;
            }
            // 投票牌拖放
            const voteFrom = parseInt(e.dataTransfer.getData('vote-card'), 10);
            if (!isNaN(voteFrom) && !seats[i].dead && !seats[i].suicide && !seats[voteFrom].dead && !seats[voteFrom].suicide) {
                // 先移除原有投票
                for (let j = 0; j < voteMap.length; j++) {
                    voteMap[j] = voteMap[j].filter(idx => idx !== voteFrom);
                }
                voteMap[i].push(voteFrom);
                saveState();
                renderSeats();
                renderVoteArea();
            }
        };
        seatDiv.ondragenter = (e) => { e.preventDefault(); };
        seatDiv.ondragleave = (e) => {};

        // 投票牌显示（座位下方，绝对定位，不影响原有布局）
        const seatVotes = document.createElement('div');
        seatVotes.className = 'seat-votes';
        // 排序：按投票人座位号升序
        const votes = (voteMap[i] || []).slice().sort((a, b) => a - b);
        for (const voterIdx of votes) {
            const card = document.createElement('div');
            card.className = 'seat-vote-card';
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-voter', voterIdx);
            card.setAttribute('data-target', i);
            card.textContent = voterIdx + 1;
            // 拖动投票牌离开座位
            card.ondragstart = function (e) {
                e.dataTransfer.setData('vote-card', voterIdx);
                setTimeout(() => card.classList.add('dragging'), 0);
            };
            card.ondragend = function () {
                card.classList.remove('dragging');
            };
            seatVotes.appendChild(card);
        }
        seatDiv.appendChild(seatVotes);
    }
    document.getElementById('seatCount').textContent = `座位数：${n}`;
    
    // 初始化身份悬浮框监听器
    if (typeof initRoleTooltip === 'function') {
        initRoleTooltip();
    }
}

// 增加座位
function addSeat() {
    if (seats.length < maxSeats) {
        seats.push({ name: "", dead: false, out: false, suicide: false, flipped: false, surrendered: false }); // 新增座位名牌内容为空
        voteMap.push([]);
        renderSeats();
        renderVoteArea();
        saveState();
    }
}

// 移除座位
function removeSeat() {
    if (seats.length > minSeats) {
        seats.pop();
        voteMap.pop();
        // 移除所有投给这个座位的票
        for (let i = 0; i < voteMap.length; i++) {
            voteMap[i] = voteMap[i].filter(idx => idx < seats.length);
        }
        renderSeats();
        renderVoteArea();
        saveState();
    }
}

// 更新座位名称
function updateName(index, value) {
    seats[index].name = value;
    updatePhaseDisplay(); // 更新流程标志窗显示
    
    // 更新身份悬浮框内容
    if (typeof onSeatNameChanged === 'function') {
        onSeatNameChanged();
    }
    
    saveState();
}

// 选择座位名称
function selectName(index, value) {
    seats[index].name = value;
    renderSeats();
    renderVoteArea();
    updatePhaseDisplay(); // 更新流程标志窗显示
    
    // 更新身份悬浮框内容
    if (typeof onSeatNameChanged === 'function') {
        onSeatNameChanged();
    }
    
    saveState();
}

// 清空座位名称
function clearName(index) {
    seats[index].name = "";
    renderSeats();
    renderVoteArea();
    updatePhaseDisplay(); // 更新流程标志窗显示
    saveState();
}

// 标记座位死亡
function markDead(index, dead) {
    const wasAlive = !seats[index].dead;
    seats[index].dead = dead;
    
    if (dead) {
        // 只有从活着变为死亡时才记录历史
        if (wasAlive) {
            addHistoryRecord(index, 'death');
        }
        // 死亡则移除该座位的投票牌和投给该座位的票
        for (let i = 0; i < voteMap.length; i++) {
            voteMap[i] = voteMap[i].filter(idx => idx !== index);
        }
        voteMap[index] = [];
    }
    renderSeats();
    renderVoteArea();
    updatePhaseDisplay(); // 更新流程标志窗显示
    saveState();
}

// 标记座位票出
function markOut(index, out) {
    const wasIn = !seats[index].out;
    seats[index].out = out;
    
    if (out) {
        // 只有从正常状态变为票出时才记录历史
        if (wasIn) {
            addHistoryRecord(index, 'out');
        }
        // 票出则移除该座位的投票牌和投给该座位的票
        for (let i = 0; i < voteMap.length; i++) {
            voteMap[i] = voteMap[i].filter(idx => idx !== index);
        }
        voteMap[index] = [];
    }
    renderSeats();
    renderVoteArea();
    updatePhaseDisplay(); // 更新流程标志窗显示
    saveState();
}

// 标记座位翻牌
function markFlipped(index, flipped) {
    const wasNotFlipped = !seats[index].flipped;
    seats[index].flipped = flipped;
    
    if (flipped) {
        // 只有从正常状态变为翻牌时才记录历史
        if (wasNotFlipped) {
            addHistoryRecord(index, 'flip');
        }
    }
    renderSeats();
    renderVoteArea();
    saveState();
}

// 标记座位叛变
function markSurrendered(index, surrendered) {
    const wasNotSurrendered = !seats[index].surrendered;
    seats[index].surrendered = surrendered;
    
    if (surrendered) {
        // 只有从正常状态变为叛变时才记录历史
        if (wasNotSurrendered) {
            addHistoryRecord(index, 'surrender');
        }
    }
    renderSeats();
    renderVoteArea();
    saveState();
}

// 标记座位自爆
function markSuicide(index, suicide) {
    const wasAlive = !seats[index].suicide;
    seats[index].suicide = suicide;
    
    if (suicide) {
        // 只有从正常状态变为自爆时才记录历史
        if (wasAlive) {
            addHistoryRecord(index, 'suicide');
        }
        // 自爆则移除该座位的投票牌和投给该座位的票（和死亡、票出一样的效果）
        for (let i = 0; i < voteMap.length; i++) {
            voteMap[i] = voteMap[i].filter(idx => idx !== index);
        }
        voteMap[index] = [];
    }
    renderSeats();
    renderVoteArea();
    updatePhaseDisplay(); // 更新流程标志窗显示
    saveState();
}

// 座位选中功能
function selectSingleSeat(seatIndex) {
    // 单选模式：清除所有选中，然后选中当前座位（保留函数以防其他地方使用）
    selectedSeats = [seatIndex];
    renderSeats();
}

function toggleSeatSelection(seatIndex) {
    // 多选模式：切换座位选中状态
    const index = selectedSeats.indexOf(seatIndex);
    if (index > -1) {
        // 已选中，取消选中
        selectedSeats.splice(index, 1);
    } else {
        // 未选中，添加选中
        selectedSeats.push(seatIndex);
    }
    renderSeats();
}

function clearSeatSelection() {
    selectedSeats = [];
    renderSeats();
}

// 身份专属计数按钮功能
function toggleRoleCounters(seatIndex) {
    // 先关闭所有其他的计数按钮面板
    document.querySelectorAll('.role-counter-buttons').forEach(panel => {
        if (panel.id !== `roleCounters-${seatIndex}`) {
            panel.classList.remove('show');
        }
    });
    
    // 切换当前面板
    const panel = document.getElementById(`roleCounters-${seatIndex}`);
    if (panel) {
        panel.classList.toggle('show');
    }
}

// 座位标记拖拽开始事件
function onSeatDeathDragStart(event, seatIndex) {
    event.dataTransfer.setData('seat-death', seatIndex);
}

function onSeatOutDragStart(event, seatIndex) {
    event.dataTransfer.setData('seat-out', seatIndex);
}

function onSeatSuicideDragStart(event, seatIndex) {
    event.dataTransfer.setData('seat-suicide', seatIndex);
}

function onSeatFlipDragStart(event, seatIndex) {
    event.dataTransfer.setData('seat-flip', seatIndex);
}

function onSeatSurrenderDragStart(event, seatIndex) {
    event.dataTransfer.setData('seat-surrender', seatIndex);
}
