// 更新公告管理器
class ChangelogManager {
    constructor() {
        this.changelog = {
            "v0.5.3.250726": {
                title: "v0.5.3.250726",
                date: "2024年7月26日",
                features: [
                    "新增倒计时器，默认不渲染，在【工具设置】中启用，倒计时长固定为2分钟"
                ]
            },
            "v0.5.2.250725": {
                title: "v0.5.2.250725",
                date: "2024年7月25日",
                features: [
                    "新增功能，如果郝经存活，复制第1天的结算信息时，询问是否模糊经济"
                ]
            },
            "v0.5.1.250724": {
                title: "v0.5.1.250724",
                date: "2024年7月24日",
                features: [
                    "修改阔端的屯田点操作按钮为-1~-6",
                    "新增功能，在流程标志窗中显示【发言顺/逆序】",
                    "修复天数消息导出错误的漏洞",
                    "新增功能，可以复制单条历史记录，复制时不包含玩家身份，用于播报",
                    "删除复制票型和复制历史记录的确认步骤，新增复制内容到剪贴板时的提示消息",
                    "新增功能，若经济低于10点，则经济点在历史记录中显示为红色",
                    "修复重置时流程标志窗和座位抽取器位置未重置的漏洞",
                    "修复座位抽取器的历史记录格式错误的漏洞",
                    "修复流程标志窗的位置信息未保存的漏洞",
                    "新增蒲寿庚的+5屯田点操作按钮，用于返还屯田点<br><span class='changelog-comment'>会显示蒲寿庚【屯田】，待解决</span>",
                    "新增流程标志窗中，正在结算的身份的效果说明，区分首夜、非首夜、任一夜晚的效果",
                    "模块化单网页项目，便于后续维护；添加构建项目为单一html文件的命令",
                    "修改选中座位逻辑，仅在松开Ctrl并单击座位后取消选中。Ctrl+左键选择座位时，即使点击名牌，也会选中座位",
                    "新增功能，页面打开后2s静默检查是否存在新版本，也可手动检查",
                    "新增身份信息框，鼠标经过座位时，更新显示内容为该座位身份的信息<br><span class='changelog-comment'>身份的详细效果介绍待添加</span>",
                    "整合部分按钮功能至工具面板，点击原【身份筛选】按钮位置的【工具设计】进入工具面板",
                    "新增页内查看更新公告的功能"
                ]
            },
            "v0.5.0.250708": {
                title: "v0.5.0.250708",
                date: "2024年7月8日",
                features: [
                    "新增结算流程的步骤提示框，每次进入白天时更新历史记录",
                    "新增座位抽取器，点击抽取存活的座位之一"
                ]
            },
            "v0.4.4.250706": {
                title: "v0.4.4.250706",
                date: "2024年7月6日",
                features: [
                    "修复屯田点变化历史记录文本与样式错误的漏洞",
                    "新增在座位名牌上按住Alt时，显示完整角色列表的功能"
                ]
            },
            "v0.4.3.250706": {
                title: "v0.4.3.250706",
                date: "2024年7月6日",
                features: [
                    "新增身份高稼、丁大全、赵彦呐（蜀阃）",
                    "修改被选中座位的颜色",
                    "修改输入框弹窗的样式",
                    "新增发动技能历史记录的备注功能，点击预设按钮添加预设文本，无备注输入则不输出备注",
                    "修改弹窗的确认快捷键为回车，输入框不可换行，移除确认与取消按钮（例：选中座位后直接按两次回车，输出无备注记录）",
                    "新增历史记录框的调节功能"
                ]
            },
            "v0.4.2.250702": {
                title: "v0.4.2.250702",
                date: "2024年7月2日",
                features: [
                    "新增经济点历史记录，在经济点框内按回车，添加历史并取消选中",
                    "修复初始化网页时屯田点为0的漏洞",
                    "删除删除历史记录时的确认步骤",
                    "新增发动技能历史记录。Ctrl+左键选中若干座位，按回车在历史记录中添加首选座位角色对剩余角色发动技能的历史",
                    "修改历史记录的文本颜色"
                ]
            },
            "v0.4.1.250701": {
                title: "v0.4.1.250701",
                date: "2024年7月1日",
                features: [
                    "修复票出角色的票牌未隐藏的漏洞",
                    "新增删除单条历史记录的功能",
                    "新增翻牌、叛变、自爆标记",
                    "修改标记图标，统一风格",
                    "修复出局座位的身份列表被在场座位遮挡的漏洞",
                    "新增身份吕文焕（荆阃）、阔端、耶律楚材"
                ]
            },
            "v0.4.0.250630": {
                title: "v0.4.0.250630",
                date: "2024年6月30日",
                features: [
                    "新增角色谢道清",
                    "修改屯田点操作按钮，绑定指定身份的座位。点击齿轮按钮展开屯田点修改按钮的列表，点击其他位置收起。文官屯田加成用阃帅座位的+8按钮表示",
                    "修改初始屯田点为20",
                    "新增身份筛选列表置底的【清空】选项，点击清空该座位的身份文本。在搜索无结果时不显示",
                    "新增历史记录功能。记录玩家被杀死/票出、屯田点变化，在复制票型时记录票型。在重置或点击【清空】按钮时清空。点击【导出】按钮复制所有历史记录到剪贴板。历史记录框可以被拖动，在重置时还原位置"
                ]
            },
            "v0.3.1.250622": {
                title: "v0.3.1.250622",
                date: "2024年6月22日",
                features: [
                    "新增身份（角色）列表筛选功能，输入以空格或换行分隔的角色关键词文本，重置时不清空，如果文本存在，角色列表仅显示包含至少一个角色关键词的角色名"
                ]
            },
            "v0.2.2.250620": {
                title: "v0.2.2.250620",
                date: "2024年6月20日",
                features: [
                    "修复角色旭烈兀未加入的漏洞"
                ]
            },
            "v0.2.1.250620": {
                title: "v0.2.1.250620",
                date: "2024年6月20日",
                features: [
                    "新增角色"
                ]
            },
            "v0.2.0.250602": {
                title: "v0.2.0.250602",
                date: "2024年6月2日",
                features: [
                    "本地存储数据，刷新或关闭页面不丢失记录，通过重置按钮还原初始状态",
                    "新增票牌，拖动票牌到座位上记录票型，拖出座位则放回票牌，点击按钮复制票型到剪贴板（死亡玩家的票不生成，玩家死亡时），高亮得票最多的座位，标记死亡的座位无法被上票",
                    "新增名牌输入时的筛选逻辑。设置名牌初始为空",
                    "允许被标记死亡的座位的名牌被编辑",
                    "新增票出标记",
                    "新增页脚链接到仓库"
                ]
            }
        };
    }

    // 获取当前版本的更新公告
    getCurrentVersionChangelog() {
        const currentVersion = (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1.0.0').replace(/^v/, '');
        const versionKey = `v${currentVersion}`;
        return this.changelog[versionKey] || null;
    }

    // 获取所有版本的更新公告
    getAllChangelogs() {
        // 动态解析版本号并排序，最新版本在前
        const versions = Object.keys(this.changelog);
        
        // 解析版本号的函数
        const parseVersion = (versionStr) => {
            // 从 "v0.5.1.250724" 中提取版本号和日期
            const match = versionStr.match(/^v(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
            if (match) {
                const [, major, minor, patch, date] = match;
                return {
                    major: parseInt(major),
                    minor: parseInt(minor),
                    patch: parseInt(patch),
                    date: parseInt(date), // 日期格式 YYMMDD
                    original: versionStr
                };
            }
            return null;
        };
        
        // 排序函数：先按主版本号，再按次版本号，再按补丁版本号，最后按日期
        const sortVersions = (a, b) => {
            const versionA = parseVersion(a);
            const versionB = parseVersion(b);
            
            if (!versionA || !versionB) return 0;
            
            // 主版本号比较
            if (versionA.major !== versionB.major) {
                return versionB.major - versionA.major; // 降序
            }
            
            // 次版本号比较
            if (versionA.minor !== versionB.minor) {
                return versionB.minor - versionA.minor; // 降序
            }
            
            // 补丁版本号比较
            if (versionA.patch !== versionB.patch) {
                return versionB.patch - versionA.patch; // 降序
            }
            
            // 日期比较
            return versionB.date - versionA.date; // 降序
        };
        
        // 排序版本并返回对应的changelog
        return versions
            .sort(sortVersions)
            .map(version => this.changelog[version])
            .filter(Boolean);
    }

    // 显示更新公告弹窗
    showChangelogDialog(version = null) {
        const changelog = version ? this.changelog[version] : this.getCurrentVersionChangelog();
        
        if (!changelog) {
            this.showErrorDialog('未找到对应版本的更新公告');
            return;
        }

        const dialog = document.createElement('div');
        dialog.className = 'changelog-dialog-overlay';
        dialog.innerHTML = `
            <div class="changelog-dialog">
                <div class="changelog-header">
                    <h3>${changelog.title} 更新公告</h3>
                    <span class="changelog-date">${changelog.date}</span>
                    <button class="changelog-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="changelog-content">
                    <ul class="changelog-list">
                        ${changelog.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="changelog-footer">
                    <button class="changelog-btn changelog-btn-primary" onclick="changelogManager.showAllChangelogs()">查看所有版本</button>
                    <button class="changelog-btn changelog-btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // 点击背景关闭
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }

    // 显示所有版本的更新公告
    showAllChangelogs() {
        // 先移除当前弹窗
        const existingDialog = document.querySelector('.changelog-dialog-overlay');
        if (existingDialog) {
            existingDialog.remove();
        }

        const allChangelogs = this.getAllChangelogs();
        const dialog = document.createElement('div');
        dialog.className = 'changelog-dialog-overlay';
        dialog.innerHTML = `
            <div class="changelog-dialog changelog-dialog-large">
                <div class="changelog-header">
                    <h3>所有版本更新公告</h3>
                    <button class="changelog-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="changelog-content">
                    ${allChangelogs.map(changelog => `
                        <div class="changelog-version">
                            <div class="changelog-version-header">
                                <h4>${changelog.title}</h4>
                                <span class="changelog-date">${changelog.date}</span>
                            </div>
                            <ul class="changelog-list">
                                ${changelog.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                <div class="changelog-footer">
                    <button class="changelog-btn changelog-btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // 点击背景关闭
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }

    // 显示错误提示
    showErrorDialog(message) {
        const dialog = document.createElement('div');
        dialog.className = 'changelog-dialog-overlay';
        dialog.innerHTML = `
            <div class="changelog-dialog changelog-dialog-small">
                <div class="changelog-header">
                    <h3>提示</h3>
                    <button class="changelog-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="changelog-content">
                    <p style="text-align: center; color: #666; margin: 20px 0;">${message}</p>
                </div>
                <div class="changelog-footer">
                    <button class="changelog-btn changelog-btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // 点击背景关闭
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });

        // 3秒后自动关闭
        setTimeout(() => {
            if (dialog.parentElement) {
                dialog.remove();
            }
        }, 3000);
    }
}

// 创建全局更新公告管理器实例
const changelogManager = new ChangelogManager();
