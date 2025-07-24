// 身份筛选和下拉菜单管理模块
// 身份筛选功能
let roleFilter = "";

// 工具面板管理函数
function showToolsPanel() {
    document.getElementById('toolsPanel').style.display = 'flex';
    const input = document.getElementById('toolsRoleFilterInput');
    input.value = roleFilter;
    setTimeout(() => input.focus(), 100);
}

function closeToolsPanel() {
    document.getElementById('toolsPanel').style.display = 'none';
}

function applyToolsRoleFilter() {
    const input = document.getElementById('toolsRoleFilterInput');
    roleFilter = input.value.trim();
    renderSeats();
    renderVoteArea();
    // 不关闭面板，让用户可以继续使用其他功能
}

// 实时应用身份筛选
function onToolsRoleFilterInput() {
    const input = document.getElementById('toolsRoleFilterInput');
    roleFilter = input.value.trim();
    renderSeats();
    renderVoteArea();
}

// 通用函数：生成下拉菜单内容
function generateDropdownHtml(seatIndex, inputValue = '', forceShowAll = false) {
    let dropdownHtml = '';
    let filterText = roleFilter;
    
    if (inputValue === '' || forceShowAll) {
        // 没有输入，显示全部或筛选
        dropdownHtml = nameGroups.map(group => {
            let names = group.names;
            if (filterText) {
                names = names.filter(name => filterText.split(/\s+/).some(f => f && name.includes(f)));
            }
            if (names.length === 0) return '';
            return `
                <div class="dropdown-group-title">${group.title}</div>
                ${names.map(name =>
                    `<div class="dropdown-item ${group.class}" onmousedown="event.stopPropagation(); selectName(${seatIndex}, '${name}')">${name}</div>`
                ).join('')}
            `;
        }).join('');
        if (dropdownHtml.replace(/\s/g, '') === '') {
            dropdownHtml = `<div style="padding:8px 12px;color:#888;">无匹配结果</div>`;
        } else {
            dropdownHtml += `<div class="dropdown-item" onmousedown="event.stopPropagation(); clearName(${seatIndex})">清空</div>`;
        }
    } else {
        // 有输入，筛选
        let hasResult = false;
        dropdownHtml = nameGroups.map(group => {
            let filteredNames = group.names.filter(name => name.includes(inputValue));
            if (filterText) {
                filteredNames = filteredNames.filter(name => filterText.split(/\s+/).some(f => f && name.includes(f)));
            }
            if (filteredNames.length === 0) return '';
            hasResult = true;
            return `
                <div class="dropdown-group-title">${group.title}</div>
                ${filteredNames.map(name =>
                    `<div class="dropdown-item ${group.class}" onmousedown="event.stopPropagation(); selectName(${seatIndex}, '${name}')">${name}</div>`
                ).join('')}
            `;
        }).join('');
        if (!hasResult) {
            dropdownHtml = `<div style="padding:8px 12px;color:#888;">无匹配结果</div>`;
        } else {
            dropdownHtml += `<div class="dropdown-item" onmousedown="event.stopPropagation(); clearName(${seatIndex})">清空</div>`;
        }
    }
    
    return dropdownHtml;
}

function showRoleFilterDialog() {
    document.getElementById('roleFilterDialog').style.display = 'flex';
    const input = document.getElementById('roleFilterDialogInput');
    input.value = roleFilter;
    setTimeout(() => input.focus(), 100);
}

function closeRoleFilterDialog() {
    document.getElementById('roleFilterDialog').style.display = 'none';
}

function applyRoleFilter() {
    const input = document.getElementById('roleFilterDialogInput');
    roleFilter = input.value.trim();
    closeRoleFilterDialog();
    renderSeats();
    renderVoteArea();
}

// 根据输入内容刷新下拉列表
function updateDropdown(index) {
    const inputValue = seats[index].name.trim();
    const dropdownHtml = generateDropdownHtml(index, inputValue);
    const dropdown = document.getElementById('dropdown-' + index);
    if (dropdown) dropdown.innerHTML = dropdownHtml;
}

// 下拉显示/隐藏逻辑
function showDropdown(index) {
    // 先移除所有座位的dropdown-active类
    document.querySelectorAll('.seat').forEach(seat => seat.classList.remove('dropdown-active'));
    document.querySelectorAll('.dropdown-list').forEach(el => el.classList.remove('show'));
    
    const dropdown = document.getElementById('dropdown-' + index);
    if (dropdown) {
        dropdown.classList.add('show');
        // 为当前座位添加dropdown-active类，提升z-index
        const seat = dropdown.closest('.seat');
        if (seat) seat.classList.add('dropdown-active');
    }
    // 每次显示时刷新一次下拉内容（以防输入内容变化）
    updateDropdown(index);
}

// 初始化身份筛选和技能弹窗的键盘事件
function initRoleFilterEvents() {
    // 工具面板的键盘事件和实时输入监听
    const toolsInput = document.getElementById('toolsRoleFilterInput');
    
    // 实时监听输入变化
    toolsInput.addEventListener('input', onToolsRoleFilterInput);
    
    // 键盘事件
    toolsInput.addEventListener('keydown', function(e){
        if(e.key === 'Escape') closeToolsPanel();
    });
    
    // 点击工具面板外关闭
    document.getElementById('toolsPanel').addEventListener('mousedown', function(e){
        if(e.target === this) closeToolsPanel();
    });

    // 支持回车确认、ESC关闭身份筛选弹窗
    document.getElementById('roleFilterDialogInput').addEventListener('keydown', function(e){
        if(e.key === 'Enter') {
            // 回车：确认筛选
            e.preventDefault();
            applyRoleFilter();
        }
        if(e.key === 'Escape') closeRoleFilterDialog();
    });
    // 点击弹窗外关闭
    document.getElementById('roleFilterDialog').addEventListener('mousedown', function(e){
        if(e.target === this) closeRoleFilterDialog();
    });

    // 支持回车确认、ESC关闭技能弹窗
    document.getElementById('skillDialogInput').addEventListener('keydown', function(e){
        if(e.key === 'Enter') {
            // 回车：确认技能
            e.preventDefault();
            confirmSkill();
        }
        if(e.key === 'Escape') closeSkillDialog();
    });
    // 点击弹窗外关闭技能弹窗
    document.getElementById('skillDialog').addEventListener('mousedown', function(e){
        if(e.target === this) closeSkillDialog();
    });

    // 添加全局点击事件处理下拉菜单
    document.addEventListener('click', function(e) {
        // 如果点击的不是输入框或者下拉菜单，则关闭所有下拉菜单
        if (!e.target.matches('.name-edit') && !e.target.closest('.dropdown-list')) {
            hideAllDropdowns();
        }
    });
}

// 隐藏所有下拉菜单
function hideAllDropdowns() {
    document.querySelectorAll('.seat').forEach(seat => seat.classList.remove('dropdown-active'));
    document.querySelectorAll('.dropdown-list').forEach(el => el.classList.remove('show'));
}
