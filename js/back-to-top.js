// 回到顶部按钮功能
(function() {
    // 创建回到顶部按钮
    function createBackToTopButton() {
        const button = document.createElement('div');
        button.className = 'back-to-top';
        document.body.appendChild(button);
        return button;
    }
    
    // 平滑滚动到顶部
    function scrollToTop() {
        // 使用平滑滚动效果
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 检查滚动位置，决定是否显示按钮
    function checkScrollPosition(button) {
        // 当页面滚动超过300px时显示按钮
        if (window.pageYOffset > 300) {
            if (!button.classList.contains('visible')) {
                button.classList.add('visible');
                
                // 添加一个短暂的脉冲效果，提醒用户
                setTimeout(function() {
                    button.classList.add('pulsing');
                    setTimeout(function() {
                        button.classList.remove('pulsing');
                    }, 2000);
                }, 500);
            }
        } else {
            button.classList.remove('visible');
        }
    }
    
    // 初始化函数
    function init() {
        const backToTopButton = createBackToTopButton();
        
        // 添加点击事件监听器
        backToTopButton.addEventListener('click', scrollToTop);
        
        // 添加滚动事件监听器
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    checkScrollPosition(backToTopButton);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // 初始检查
        checkScrollPosition(backToTopButton);
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();