# 本穴世界 - 狼人杀游戏辅助工具

## 项目简介

本穴世界是一个基于HTML/CSS/JavaScript的狼人杀游戏辅助工具，提供座位管理、投票统计、历史记录等功能。

## 文件结构

```
血染html/
├── index.html                   # 主页面文件
├── build.js                     # 构建脚本
├── build.bat                    # Windows批处理构建脚本
├── package.json                 # 项目配置文件
├── css/                        # CSS 样式文件夹
│   ├── base.css               # 基础样式
│   ├── seat.css               # 座位相关样式
│   ├── vote.css               # 投票相关样式
│   ├── history.css            # 历史记录相关样式
│   ├── phase.css              # 流程标志相关样式
│   ├── seat-picker.css        # 座位抽取器样式
│   └── markers.css            # 标记器样式
├── js/                         # JavaScript 文件夹
│   ├── config.js              # 配置文件
│   ├── main.js                # 主程序文件
│   ├── seat-manager.js        # 座位管理器
│   ├── vote-manager.js        # 投票管理器
│   ├── history-manager.js     # 历史记录管理器
│   ├── phase-manager.js       # 流程管理器
│   └── ...                    # 其他模块文件
├── dist/                       # 构建输出目录
│   └── index.html             # 单文件版本
└── README.md                  # 说明文件
```

## 快速开始

### 方法1：使用批处理文件（推荐Windows用户）

1. 双击 `build.bat` 文件
2. 按照提示选择操作：
   - `build.bat build` - 构建单文件HTML
   - `build.bat clean` - 清理构建目录
   - `build.bat rebuild` - 清理并重新构建
   - `build.bat dev` - 启动开发服务器

### 方法2：使用终端命令

```bash
# 构建单文件HTML
node build.js build

# 清理构建目录
node build.js clean

# 重新构建
node build.js rebuild

# 使用npm脚本
npm run build
npm run clean
npm run rebuild
npm run dev
```

## 构建说明

### 单文件导出功能

构建脚本 `build.js` 会自动：
1. 读取 `index.html` 文件
2. 自动检测并读取所有CSS文件（`css/` 目录）
3. 自动检测并读取所有JS文件（`js/` 目录）
4. 将CSS内容内联到 `<style>` 标签中
5. 将JS内容内联到 `<script>` 标签中
6. 生成完整的单文件HTML到 `dist/index.html`

### 特性

- **智能检测**：自动检测HTML中引用的CSS和JS文件
- **动态路径**：支持任意数量的文件和路径结构
- **错误处理**：自动处理缺失文件的情况
- **文件信息**：显示构建过程和文件大小信息
- **跨平台**：支持Windows、macOS和Linux

## 开发服务器

使用内置的开发服务器可以在本地测试项目：

```bash
npm run dev
```

然后在浏览器中打开 `http://localhost:3000`

## CSS 文件说明

### 1. base.css
- 基础样式，包含页面的通用样式
- 包含：body、controls、counter-container、circle-container、通用按钮样式

### 2. seat.css
- 座位相关的所有样式
- 包含：座位外观、下拉菜单、座位状态、身份计数按钮等

### 3. vote.css
- 投票相关样式
- 包含：投票区域、投票卡片、投票按钮等

### 4. history.css
- 历史记录面板样式
- 包含：历史记录容器、历史记录项、滚动条样式等

### 5. phase.css
- 流程标志窗样式
- 包含：流程面板、时间显示、天数计数器等

### 6. seat-picker.css
- 座位抽取器样式
- 包含：抽取器面板、结果显示、抽取按钮等

### 7. markers.css
- 标记器样式
- 包含：死亡、出局、自杀、翻牌、投降等标记器

## 优势

1. **模块化管理**：每个功能模块的样式独立管理，便于维护
2. **代码复用**：基础样式可以被其他模块复用
3. **团队协作**：不同开发者可以独立修改不同模块的样式
4. **性能优化**：可以根据需要选择性加载CSS文件
5. **版本控制**：便于跟踪不同模块的样式变更

## 使用说明

1. 直接打开 `index.html` 文件即可使用
2. 所有CSS文件都会被自动加载
3. 如需修改特定功能的样式，只需编辑对应的CSS文件
4. 原始文件 `本穴世界v0.5.1.250709.html` 保留作为备份

## 注意事项

- 确保CSS文件夹结构完整
- 修改CSS文件时注意样式的依赖关系
- 建议在修改前备份相关文件
