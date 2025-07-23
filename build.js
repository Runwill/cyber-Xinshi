const fs = require('fs');
const path = require('path');

/**
 * 构建单文件HTML
 * @param {boolean} minify - 是否压缩CSS和JS
 */
function buildSingleFile(minify = false) {
    const projectRoot = __dirname;
    const indexPath = path.join(projectRoot, 'index.html');
    const configPath = path.join(projectRoot, 'js', 'config.js');
    
    // 读取index.html
    console.log('正在读取 index.html...');
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // 从config.js中提取APP_NAME和APP_VERSION
    let fileName = 'index';
    if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const appNameMatch = configContent.match(/const\s+APP_NAME\s*=\s*["']([^"']+)["']/);
        const appVersionMatch = configContent.match(/const\s+APP_VERSION\s*=\s*["']([^"']+)["']/);
        
        if (appNameMatch && appVersionMatch) {
            const appName = appNameMatch[1];
            const appVersion = appVersionMatch[1];
            fileName = `${appName}${appVersion}`;
            if (minify) {
                fileName += '.min';
            }
            console.log(`检测到应用名称: ${appName}`);
            console.log(`检测到应用版本: ${appVersion}`);
            console.log(`生成文件名: ${fileName}`);
        } else {
            console.log('未能从config.js中提取完整的应用信息，使用默认文件名');
            if (minify) {
                fileName = 'index.min';
            }
        }
    } else {
        console.log('未找到config.js文件，使用默认文件名');
        if (minify) {
            fileName = 'index.min';
        }
    }
    
    const outputPath = path.join(projectRoot, 'dist', `${fileName}.html`);
    
    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 处理CSS文件
    console.log('正在处理CSS文件...');
    const cssRegex = /<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*>/g;
    let cssMatch;
    const cssContents = [];
    
    while ((cssMatch = cssRegex.exec(htmlContent)) !== null) {
        const cssPath = cssMatch[1];
        const fullCssPath = path.join(projectRoot, cssPath);
        
        if (fs.existsSync(fullCssPath)) {
            console.log(`  - 读取 ${cssPath}`);
            let cssContent = fs.readFileSync(fullCssPath, 'utf8');
            
            // 如果需要压缩，对CSS进行压缩
            if (minify) {
                cssContent = cssContent
                    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
                    .replace(/\s+/g, ' ') // 压缩空白
                    .replace(/;\s*}/g, '}') // 移除最后一个分号
                    .replace(/\s*{\s*/g, '{') // 压缩大括号
                    .replace(/\s*}\s*/g, '}')
                    .replace(/\s*;\s*/g, ';')
                    .replace(/\s*:\s*/g, ':')
                    .replace(/\s*,\s*/g, ',')
                    .trim();
            }
            
            cssContents.push(cssContent);
        } else {
            console.warn(`  - 警告: 找不到CSS文件 ${cssPath}`);
        }
    }
    
    // 处理JS文件
    console.log('正在处理JS文件...');
    const jsRegex = /<script\s+src=["']([^"']+)["']\s*><\/script>/g;
    let jsMatch;
    const jsContents = [];
    
    while ((jsMatch = jsRegex.exec(htmlContent)) !== null) {
        const jsPath = jsMatch[1];
        const fullJsPath = path.join(projectRoot, jsPath);
        
        if (fs.existsSync(fullJsPath)) {
            console.log(`  - 读取 ${jsPath}`);
            let jsContent = fs.readFileSync(fullJsPath, 'utf8');
            
            // 如果需要压缩，对JS进行简单压缩（只移除注释和多余空白）
            if (minify) {
                jsContent = jsContent
                    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行注释
                    .replace(/\/\/.*$/gm, '') // 移除单行注释
                    .replace(/\s+/g, ' ') // 压缩空白
                    .replace(/\s*([{}();,:])\s*/g, '$1') // 压缩操作符周围的空白
                    .trim();
            }
            
            jsContents.push(jsContent);
        } else {
            console.warn(`  - 警告: 找不到JS文件 ${jsPath}`);
        }
    }
    
    // 移除原有的CSS和JS引用
    htmlContent = htmlContent.replace(cssRegex, '');
    htmlContent = htmlContent.replace(jsRegex, '');
    
    // 构建内联CSS
    let inlineCSS = '';
    if (cssContents.length > 0) {
        const cssContent = cssContents.join(minify ? '' : '\n');
        inlineCSS = `    <style>\n${cssContent}\n    </style>\n`;
    }
    
    // 构建内联JS
    let inlineJS = '';
    if (jsContents.length > 0) {
        const jsContent = jsContents.join(minify ? '' : '\n');
        inlineJS = `    <script>\n${jsContent}\n    </script>\n`;
    }
    
    // 插入内联CSS和JS
    // 在</head>之前插入CSS
    htmlContent = htmlContent.replace('</head>', inlineCSS + '</head>');
    
    // 在</body>之前插入JS
    htmlContent = htmlContent.replace('</body>', inlineJS + '</body>');
    
    // 清理多余的空行和空白（统一在最后处理）- 但不破坏HTML结构
    htmlContent = htmlContent.replace(/\n\s*\n\s*\n/g, '\n\n'); // 将多个连续空行替换为单个空行
    htmlContent = htmlContent.replace(/(\n\s*){3,}/g, '\n\n'); // 更彻底地清理连续空行
    htmlContent = htmlContent.replace(/\n\s*\n\s*(<\/head>)/g, '\n$1'); // 清理</head>前的空行
    htmlContent = htmlContent.replace(/(<head>)\s*\n\s*\n/g, '$1\n'); // 清理<head>后的空行
    
    // 写入输出文件
    console.log(`正在写入输出文件${minify ? '（压缩版）' : ''}...`);
    fs.writeFileSync(outputPath, htmlContent, 'utf8');
    
    console.log(`构建完成！输出文件: ${outputPath}`);
    
    // 显示文件大小信息
    const stats = fs.statSync(outputPath);
    console.log(`文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
}

/**
 * 清理构建目录
 */
function clean() {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
        console.log('正在清理构建目录...');
        try {
            // 先尝试删除文件
            const files = fs.readdirSync(distPath);
            files.forEach(file => {
                const filePath = path.join(distPath, file);
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.warn(`无法删除文件 ${file}: ${err.message}`);
                }
            });
            
            // 再尝试删除目录
            fs.rmdirSync(distPath);
            console.log('构建目录已清理');
        } catch (err) {
            console.warn(`清理构建目录时出现警告: ${err.message}`);
            // 如果删除失败，确保目录存在以便后续构建
            if (!fs.existsSync(distPath)) {
                fs.mkdirSync(distPath, { recursive: true });
            }
        }
    }
}

// 命令行参数处理
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'build':
        buildSingleFile(false);
        break;
    case 'build-min':
        buildSingleFile(true);
        break;
    case 'clean':
        clean();
        break;
    case 'rebuild':
        clean();
        buildSingleFile(false);
        break;
    case 'rebuild-min':
        clean();
        buildSingleFile(true);
        break;
    default:
        console.log('用法:');
        console.log('  node build.js build      - 构建单文件HTML');
        console.log('  node build.js build-min  - 构建压缩版单文件HTML');
        console.log('  node build.js clean      - 清理构建目录');
        console.log('  node build.js rebuild    - 清理并重新构建');
        console.log('  node build.js rebuild-min - 清理并重新构建压缩版');
        break;
}
