# 版本检查功能说明

## 功能概述

本项目新增了版本检查功能，可以自动检查GitHub上的最新版本并提示用户是否需要更新。

## 初始配置

### 在GitHub上创建Release

要让版本检查功能正常工作，你需要在GitHub仓库中创建Release：

1. **访问仓库**：打开 https://github.com/Runwill/cyber-Xinshi
2. **进入Releases**：点击页面右侧的 "Releases" 链接
3. **创建新Release**：点击 "Create a new release" 按钮
4. **填写信息**：
   - **Tag version**: `v0.5.1.250709` (与config.js中的APP_VERSION保持一致)
   - **Release title**: `本穴世界 v0.5.1.250709`
   - **Description**: 
     ```
     ## 新增功能
     - 添加版本检查功能
     - 自动检查GitHub最新版本
     - 友好的更新通知界面
     - 本地缓存减少网络请求
     
     ## 使用说明
     - 页面会自动检查更新
     - 点击"检查更新"按钮手动检查
     - 发现新版本时会显示更新通知
     ```
5. **发布Release**：点击 "Publish release" 按钮

### API地址说明

- **API地址**：`https://api.github.com/repos/Runwill/cyber-Xinshi/releases/latest`
- **访问限制**：GitHub API有速率限制（每小时60次请求）
- **无需认证**：公开仓库的Release信息无需API Token

## 功能特点

### 1. 自动检查
- 页面加载后2秒自动检查更新（避免影响页面加载）
- 每24小时自动检查一次，避免频繁请求
- 使用localStorage保存上次检查时间

### 2. 手动检查
- 在页面顶部的控制栏中添加了"检查更新"按钮
- 点击按钮可以强制检查最新版本
- 显示检查进度和结果

### 3. 智能通知
- 发现新版本时显示更新通知，包含版本信息和更新链接
- 已是最新版本时显示确认信息，3秒后自动消失
- 检查失败时显示错误提示

### 4. 版本同步
- 自动从config.js中读取当前版本号
- 与GitHub Releases进行版本比较
- 支持语义化版本号比较

## 文件结构

```
js/
├── version-checker.js    # 版本检查核心逻辑
└── config.js            # 应用配置（包含版本号）

css/
└── version.css          # 版本通知样式

index.html               # 主页面（已添加相关引用和按钮）
```

## 技术实现

### 1. GitHub API集成
- 使用GitHub API获取最新Release信息
- API地址：`https://api.github.com/repos/Runwill/cyber-Xinshi/releases/latest`
- 无需认证，但有速率限制

### 2. 版本号比较
- 支持语义化版本号格式 (x.y.z)
- 智能处理版本号前缀（如v1.0.0）
- 数字逐位比较确保准确性

### 3. 本地存储
- 使用localStorage保存检查时间戳
- 避免频繁的网络请求
- 提升用户体验

## 使用方法

### 用户使用
1. 正常打开页面，系统会自动检查更新
2. 如需手动检查，点击"检查更新"按钮
3. 如有新版本，点击通知中的"查看更新"链接跳转到GitHub

### 开发者维护
1. 在config.js中更新APP_VERSION常量
2. 在GitHub上创建新的Release
3. 用户访问页面时会自动获得更新提示

## 样式定制

可以通过修改`css/version.css`来自定义通知样式：

- `.version-notification` - 通知容器
- `.version-btn-primary` - 主要按钮样式
- `.version-btn-secondary` - 次要按钮样式

## 注意事项

1. **网络依赖**：功能需要访问GitHub API，在无网络环境下会失败
2. **跨域限制**：某些环境可能存在跨域访问限制
3. **速率限制**：GitHub API有访问频率限制（每小时60次请求），建议不要过于频繁检查
4. **版本格式**：请确保GitHub Release的tag格式与config.js中的版本号格式一致
5. **User-Agent要求**：GitHub API要求请求包含User-Agent头，已在代码中处理
6. **首次使用**：如果GitHub仓库还没有Release，会显示"需要配置版本发布"的提示

## 配置步骤总结

### 第一次使用时：
1. 打开页面，如果看到"需要配置版本发布"提示，点击"创建Release"
2. 在GitHub上按照提示创建第一个Release
3. 刷新页面，版本检查功能即可正常工作

### 后续版本更新时：
1. 修改 `js/config.js` 中的 `APP_VERSION`
2. 在GitHub上创建新的Release，tag版本号要与APP_VERSION一致
3. 用户访问页面时会自动收到更新提示

## 错误排除

### 常见问题
1. **检查失败**：检查网络连接和GitHub访问
2. **版本显示异常**：确认config.js中的APP_VERSION格式
3. **样式异常**：检查version.css是否正确加载

### 调试方法
- 打开浏览器开发者工具查看Network请求
- 检查Console中的错误信息
- 验证localStorage中的lastVersionCheck数据

## 更新日志

- v0.5.1.250709：添加版本检查功能
  - 自动检查GitHub最新版本
  - 友好的更新通知界面
  - 本地缓存减少网络请求
