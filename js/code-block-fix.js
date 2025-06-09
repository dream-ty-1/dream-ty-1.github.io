document.addEventListener('DOMContentLoaded', function() {
    // 修复代码块的显示问题
    const codeBlocks = document.querySelectorAll('pre code');
    
    if (codeBlocks.length > 0) {
        codeBlocks.forEach(function(codeBlock) {
            // 确保代码块内容正确换行
            const codeText = codeBlock.innerHTML;
            const lines = codeText.split('\n');
            
            if (lines.length > 1) {
                codeBlock.innerHTML = '';
                
                lines.forEach(function(line, index) {
                    if (line.trim() !== '') {
                        const lineElement = document.createElement('div');
                        lineElement.className = 'code-line';
                        lineElement.innerHTML = line;
                        codeBlock.appendChild(lineElement);
                    } else if (index < lines.length - 1) {
                        // 添加空行，但不添加最后的空行
                        const emptyLine = document.createElement('div');
                        emptyLine.className = 'code-line';
                        emptyLine.innerHTML = '&nbsp;';
                        codeBlock.appendChild(emptyLine);
                    }
                });
            }
            
            // 重新应用高亮
            if (window.hljs) {
                window.hljs.highlightElement(codeBlock);
            }
        });
    }
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        pre {
            position: relative;
            overflow: auto;
            margin: 1em 0;
            padding: 1em;
            background-color: #282c34;
            border-radius: 5px;
        }
        
        pre code {
            display: block;
            overflow-x: auto;
            padding: 0;
            color: #abb2bf;
            font-family: 'Fira Code', Monaco, Consolas, 'Courier New', monospace;
            line-height: 1.5;
            white-space: pre;
        }
        
        .code-line {
            display: block;
            width: 100%;
            white-space: pre;
        }
    `;
    document.head.appendChild(style);
}); 