// 打字机效果
(function() {
    // 创建打字机脚本
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12';
    document.head.appendChild(script);

    // 等待脚本加载完成后初始化
    script.onload = function() {
        // 确保DOM已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTyped);
        } else {
            initTyped();
        }
    };

    function initTyped() {
        // 查找首页标题元素
        const titleElement = document.querySelector('#home-head #home-info .info .wrap h1');
        if (!titleElement) return;

        // 保存原始文本
        const originalText = titleElement.textContent;
        // 清空文本以便打字效果
        titleElement.textContent = '';
        
        // 初始化打字机
        new Typed(titleElement, {
            strings: [originalText],
            typeSpeed: 100,
            backSpeed: 50,
            loop: false,
            showCursor: true,
            cursorChar: '|',
            onComplete: (self) => {
                // 打字完成后处理
                setTimeout(() => {
                    self.cursor.style.display = 'none';
                }, 1500);
            }
        });
    }
})(); 