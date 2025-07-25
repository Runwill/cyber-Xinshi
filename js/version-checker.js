// 版本检查器
class VersionChecker {
    constructor() {
        // 从config.js中获取当前版本，如果不存在则使用默认值
        this.currentVersion = (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1.0.0').replace(/^v/, '');
        this.githubRepo = 'Runwill/cyber-Xinshi'; // GitHub仓库
    }

    // 带动画的移除通知框
    removeNotificationWithAnimation(notification) {
        if (!notification || !notification.parentElement) return;
        
        notification.classList.add('slide-out');
        
        // 等待动画完成后移除元素
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300); // 与CSS动画时间保持一致
    }

    // 比较版本号
    compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(n => parseInt(n));
        const parts2 = v2.split('.').map(n => parseInt(n));
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;
            
            if (part1 < part2) return -1;
            if (part1 > part2) return 1;
        }
        return 0;
    }

    // 从GitHub获取最新版本
    async fetchLatestVersion() {
        try {
            // 直接获取所有releases，这样可以获取到最新版本（包括预发布版本）
            let response = await fetch(`https://api.github.com/repos/${this.githubRepo}/releases`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.status === 404 || !response.ok) {
                // 如果404，说明没有任何releases
                console.warn('GitHub仓库还没有任何Release，请先在GitHub上创建Release');
                return {
                    noReleases: true,
                    repoUrl: `https://github.com/${this.githubRepo}`
                };
            }
            
            const releases = await response.json();
            if (!releases || releases.length === 0) {
                return {
                    noReleases: true,
                    repoUrl: `https://github.com/${this.githubRepo}`
                };
            }
            
            // 获取最新的release（GitHub API返回的releases按发布时间降序排列，第一个就是最新的）
            const latestRelease = releases[0];
            return {
                version: latestRelease.tag_name.replace(/^v/, ''),
                name: latestRelease.name,
                body: latestRelease.body,
                url: latestRelease.html_url,
                publishedAt: latestRelease.published_at,
                isPrerelease: latestRelease.prerelease
            };
        } catch (error) {
            console.error('获取版本信息失败:', error);
            return null;
        }
    }

    // 检查是否需要更新
    async checkForUpdate() {
        const latestInfo = await this.fetchLatestVersion();
        if (!latestInfo) {
            return null;
        }

        // 如果没有releases，返回特殊状态
        if (latestInfo.noReleases) {
            return {
                noReleases: true,
                currentVersion: this.currentVersion,
                repoUrl: latestInfo.repoUrl
            };
        }

        const comparison = this.compareVersions(this.currentVersion, latestInfo.version);
        
        return {
            hasUpdate: comparison < 0,
            currentVersion: this.currentVersion,
            latestVersion: latestInfo.version,
            latestInfo: latestInfo,
            isUpToDate: comparison >= 0
        };
    }

    // 显示更新通知
    showUpdateNotification(updateInfo) {
        if (!updateInfo) return;

        const notification = document.createElement('div');
        notification.className = 'version-notification';
        
        if (updateInfo.noReleases) {
            // 没有releases的特殊提示
            notification.innerHTML = `
                <div class="version-notification-content">
                    <div class="version-notification-header">
                        <span class="version-notification-title">📋 需要配置版本发布</span>
                        <button class="version-notification-close" onclick="versionChecker.removeNotificationWithAnimation(this.parentElement.parentElement.parentElement)">×</button>
                    </div>
                    <div class="version-notification-body">
                        <p>当前版本: v${updateInfo.currentVersion}</p>
                        <p>GitHub仓库还没有任何Release</p>
                        <p class="version-setup-needed">请在GitHub上创建第一个Release以启用版本检查功能</p>
                        <div class="version-notification-actions">
                            <a href="${updateInfo.repoUrl}/releases/new" target="_blank" class="version-btn version-btn-primary">
                                创建Release
                            </a>
                            <button class="version-btn version-btn-secondary" onclick="versionChecker.removeNotificationWithAnimation(this.parentElement.parentElement.parentElement.parentElement)">
                                稍后配置
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const versionTypeText = updateInfo.latestInfo.isPrerelease ? ' (预发布版本)' : '';
            notification.innerHTML = `
                <div class="version-notification-content">
                    <div class="version-notification-header">
                        <span class="version-notification-title">
                            ${updateInfo.hasUpdate ? '🎉 发现新版本' : '✅ 已是最新版本'}
                        </span>
                        <button class="version-notification-close" onclick="versionChecker.removeNotificationWithAnimation(this.parentElement.parentElement.parentElement)">×</button>
                    </div>
                    <div class="version-notification-body">
                        <p>当前版本: v${updateInfo.currentVersion}</p>
                        <p>最新版本: v${updateInfo.latestVersion}${versionTypeText}</p>
                        ${updateInfo.hasUpdate ? `
                            <p class="version-update-available">有新版本可用！${updateInfo.latestInfo.isPrerelease ? '<br><small style="color: #888;">注意：这是预发布版本，可能包含实验性功能</small>' : ''}</p>
                            <div class="version-notification-actions">
                                <a href="${updateInfo.latestInfo.url}" target="_blank" class="version-btn version-btn-primary">
                                    查看更新
                                </a>
                                <button class="version-btn version-btn-secondary" onclick="versionChecker.removeNotificationWithAnimation(this.parentElement.parentElement.parentElement.parentElement)">
                                    稍后提醒
                                </button>
                            </div>
                        ` : `
                            <p class="version-up-to-date">您使用的是最新版本${versionTypeText}</p>
                        `}
                    </div>
                </div>
            `;
        }

        document.body.appendChild(notification);

        // 3秒后自动消失（仅对已是最新版本的通知）
        if (!updateInfo.noReleases && !updateInfo.hasUpdate) {
            setTimeout(() => {
                this.removeNotificationWithAnimation(notification);
            }, 3000);
        }
    }

    // 自动检查更新（页面加载时调用）
    async autoCheck() {
        try {
            const updateInfo = await this.checkForUpdate();
            if (updateInfo && updateInfo.hasUpdate) {
                this.showUpdateNotification(updateInfo);
            }
        } catch (error) {
            // 静默处理自动检查的错误，避免影响用户体验
            console.warn('自动检查更新失败:', error);
        }
    }

    // 手动检查更新
    async manualCheck() {
        // 显示检查中的提示
        const checkingNotification = document.createElement('div');
        checkingNotification.className = 'version-notification checking';
        checkingNotification.innerHTML = `
            <div class="version-notification-content">
                <div class="version-notification-body">
                    <p>🔄 正在检查更新...</p>
                </div>
            </div>
        `;
        document.body.appendChild(checkingNotification);

        const updateInfo = await this.checkForUpdate();
        
        // 移除检查中的提示
        checkingNotification.remove();
        
        if (updateInfo) {
            this.showUpdateNotification(updateInfo);
        } else {
            // 检查失败的提示
            const errorNotification = document.createElement('div');
            errorNotification.className = 'version-notification error';
            errorNotification.innerHTML = `
                <div class="version-notification-content">
                    <div class="version-notification-header">
                        <span class="version-notification-title">❌ 检查更新失败</span>
                        <button class="version-notification-close" onclick="versionChecker.removeNotificationWithAnimation(this.parentElement.parentElement.parentElement)">×</button>
                    </div>
                    <div class="version-notification-body">
                        <p>无法连接到GitHub，请检查网络连接</p>
                    </div>
                </div>
            `;
            document.body.appendChild(errorNotification);
            
            setTimeout(() => {
                this.removeNotificationWithAnimation(errorNotification);
            }, 3000);
        }
    }
}

// 创建全局版本检查器实例
const versionChecker = new VersionChecker();

// 页面加载完成后自动检查更新
document.addEventListener('DOMContentLoaded', () => {
    // 延迟2秒后自动检查，避免影响页面加载
    setTimeout(() => {
        versionChecker.autoCheck();
    }, 2000);
});
