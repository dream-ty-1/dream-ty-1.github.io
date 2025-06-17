// 代码块增强功能 - 优化版本，减少DOM操作

// 使用立即执行函数封装，避免全局污染
(function() {
    // 在DOMContentLoaded事件触发后执行一次，避免多次处理
    let hasProcessed = false;
    
    document.addEventListener('DOMContentLoaded', function() {
        // 避免重复处理
        if (hasProcessed) return;
        hasProcessed = true;
        
        // 延迟处理代码块，等待页面其他内容渲染完成
        setTimeout(() => {
            enhanceCodeBlocks();
        }, 100);
    });
    
    // 主要的代码块增强函数
    function enhanceCodeBlocks() {
        // 获取所有代码块 - 同时处理 pre code 和 .highlight .code 结构
        const codeBlocks = document.querySelectorAll('pre code, .highlight .code');
        
        // 如果没有代码块，直接返回
        if (codeBlocks.length === 0) return;
        
        // 只处理尚未增强的代码块，减少重复操作
        codeBlocks.forEach(function(codeBlock) {
            // 获取父元素 - 可能是 pre 或 .highlight
            const pre = codeBlock.closest('pre') || codeBlock.closest('.highlight');
            
            if (!pre || pre.hasAttribute('data-enhanced')) return;
            
            // 标记为已增强，避免重复处理
            pre.setAttribute('data-enhanced', 'true');
            
            // 获取代码语言
            const language = getLanguageFromElement(codeBlock, pre);
            
            if (language) {
                // 设置语言属性
                pre.setAttribute('data-lang', language);
                
                // 如果是pre元素，添加语言类
                if (pre.tagName.toLowerCase() === 'pre') {
                    pre.classList.add(`language-${language}`);
                }
            }
            
            // 添加复制按钮 - 这是必要功能
            addCopyButton(codeBlock, pre);
            
            // 不强制添加行号，利用主题自带的行号功能
            // 只在没有行号时才添加
            const existingLineNumbers = pre.querySelector('.gutter, .line-numbers');
            if (!existingLineNumbers && !pre.classList.contains('no-line-numbers')) {
                addLineNumbers(codeBlock, pre);
            }
        });
    }
    
    // 从元素中获取语言
    function getLanguageFromElement(codeBlock, pre) {
        // 尝试从类名中获取语言
        let language = null;
        
        // 检查代码块的类名
        if (codeBlock.className) {
            const match = codeBlock.className.match(/language-(\w+)/);
            if (match) language = match[1];
        }
        
        // 检查父元素的类名
        if (!language && pre.className) {
            const match = pre.className.match(/language-(\w+)/);
            if (match) language = match[1];
            
            // 检查是否有highlight-<语言>类
            if (!language) {
                const highlightMatch = pre.className.match(/highlight-(\w+)/);
                if (highlightMatch) language = highlightMatch[1];
            }
        }
        
        // 检查是否有data-lang属性
        if (!language && pre.hasAttribute('data-lang')) {
            language = pre.getAttribute('data-lang');
        }
        
        // 如果找不到语言，默认为text
        return language || 'text';
    }
    
    // 添加行号 - 优化版本
    function addLineNumbers(codeBlock, pre) {
        // 获取代码内容
        const content = codeBlock.textContent;
        
        // 如果内容为空，不添加行号
        if (!content) return;
        
        // 计算行数（至少1行）
        const lines = content.split('\n').length || 1;
        
        // 创建行号容器
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        
        // 使用DocumentFragment来减少DOM操作
        const fragment = document.createDocumentFragment();
        
        // 生成行号
        for (let i = 1; i <= lines; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            fragment.appendChild(span);
            // 添加换行符，不使用innerHTML
            if (i < lines) {
                fragment.appendChild(document.createTextNode('\n'));
            }
        }
        
        // 一次性添加所有行号
        lineNumbers.appendChild(fragment);
        pre.appendChild(lineNumbers);
    }
    
    // 添加复制按钮 - 优化版本
    function addCopyButton(codeBlock, pre) {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.textContent = '复制';
        copyButton.setAttribute('title', '复制代码');
        
        // 添加复制功能
        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 获取代码内容
            const code = codeBlock.textContent;
            
            // 复制到剪贴板
            copyToClipboard(code, copyButton);
        });
        
        // 添加到代码块
        pre.appendChild(copyButton);
    }
    
    // 复制到剪贴板 - 现代版本
    function copyToClipboard(text, button) {
        // 优先使用现代Clipboard API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    // 复制成功，更改按钮文本
                    updateButtonText(button, '已复制!');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    updateButtonText(button, '复制失败');
                });
        } else {
            // 后备方法，使用execCommand
            try {
                // 创建临时textarea
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                const successful = document.execCommand('copy');
                if (successful) {
                    updateButtonText(button, '已复制!');
                } else {
                    updateButtonText(button, '复制失败');
                }
                
                // 移除临时textarea
                document.body.removeChild(textarea);
            } catch (err) {
                console.error('复制失败:', err);
                updateButtonText(button, '复制失败');
            }
        }
    }
    
    // 更新按钮文本
    function updateButtonText(button, text) {
        const originalText = button.textContent;
        button.textContent = text;
        
        // 2秒后恢复
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }
})(); 