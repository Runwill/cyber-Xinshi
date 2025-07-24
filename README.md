# 赛博心史 (cyber-Xinshi) - 狼人杀游戏辅助工具

一个现代化的狼人杀游戏辅助工具，提供座位管理、身份筛选、投票统计、历史记录等功能。

## 主要功能

- 🎯 **座位管理**：圆桌布局，拖拽标记（死亡、出局、自爆、翻牌、叛变）
- 🗳️ **投票系统**：可视化投票统计，支持票型复制
- 📋 **历史记录**：完整游戏记录，支持导出
- 🕐 **流程管理**：昼夜切换、天数计数
- 🔍 **身份筛选**：实时关键词筛选
- 🔄 **版本检查**：自动检查更新
- 📰 **更新公告**：页内查看版本更新内容
- 💾 **数据持久化**：本地存储游戏状态

## 快速开始

### 直接使用

1. 下载项目，打开 `index.html` 即可使用
2. 在线版本：[GitHub Pages](https://runwill.github.io/cyber-Xinshi/)

### 开发环境

```bash
npm install          # 安装依赖
npm run build        # 构建单文件HTML
npm run dev          # 启动开发服务器
```

## 使用指南

### 基础操作

1. **座位管理**：点击"增加/减少座位"调整数量，点击座位设置身份
2. **工具面板**：点击"工具设置"打开面板，输入关键词筛选身份
3. **投票系统**：拖拽座位到投票区域，点击"复制票型"复制结果
4. **历史记录**：操作自动记录，支持导出和清空

### 高级功能

- 右侧流程面板控制游戏昼夜和天数
- 座位抽取器随机选择座位
- 右键座位添加技能备注

## 技术说明

### 项目结构

```
cyber-Xinshi/
├── index.html                   # 主页面
├── css/                        # 样式文件
│   ├── base.css               # 基础样式
│   ├── seat.css               # 座位样式
│   ├── vote.css               # 投票样式
│   ├── tools-panel.css        # 工具面板
│   └── ...                    # 其他样式
├── js/                         # 脚本文件
│   ├── main.js                # 主程序
│   ├── seat-manager.js        # 座位管理
│   ├── vote-manager.js        # 投票管理
│   ├── role-filter.js         # 身份筛选
│   └── ...                    # 其他脚本
└── dist/                       # 构建输出
```

### 构建系统

`build.js` 自动将所有CSS和JS文件内联到单个HTML文件中：

```bash
npm run build        # 生成 dist/index.html
```

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 链接

- [项目地址](https://github.com/Runwill/cyber-Xinshi)
- [问题反馈](https://github.com/Runwill/cyber-Xinshi/issues)
- [版本说明](VERSION_CHECK_README.md)
