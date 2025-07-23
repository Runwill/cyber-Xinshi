// 技能发动弹窗模块
// 处理选中座位的技能发动
function handleSelectedSeatsSkill() {
    if (selectedSeats.length === 0) return;
    
    // 显示技能发动弹窗
    showSkillDialog();
}

// 座位名牌输入框键盘事件处理
function handleNameEditKeyDown(event, seatIndex) {
    // 名牌输入框只处理普通的输入事件，不处理技能发动
}

function handleNameEditKeyUp(event, seatIndex) {
    // 目前不需要特殊处理keyup事件
}

// 初始化全局回车键事件监听
function initGlobalKeyEvents() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // 检查是否在输入框中（避免干扰正常输入）
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            // 有选中座位时，触发技能发动
            if (selectedSeats.length > 0) {
                event.preventDefault();
                handleSelectedSeatsSkill();
            }
        }
    });
}

// 技能发动弹窗相关函数
function showSkillDialog() {
    document.getElementById('skillDialog').style.display = 'flex';
    const input = document.getElementById('skillDialogInput');
    input.value = '';
    setTimeout(() => input.focus(), 100);
}

function closeSkillDialog() {
    document.getElementById('skillDialog').style.display = 'none';
}

function setSkillPreset(presetText) {
    const input = document.getElementById('skillDialogInput');
    input.value = presetText;
    input.focus();
}

function confirmSkill() {
    if (selectedSeats.length === 0) {
        closeSkillDialog();
        return;
    }
    
    const skillDetail = document.getElementById('skillDialogInput').value.trim();
    
    // 创建技能发动历史记录，传入技能详情
    addSkillHistoryRecord(selectedSeats, skillDetail);
    
    // 清除选中状态
    clearSeatSelection();
    closeSkillDialog();
}
