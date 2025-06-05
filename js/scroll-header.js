// 标题栏滚动效果
(function() {
    // 变量初始化
    let lastScrollTop = 0;
    let ticking = false;
    const menu = document.getElementById('menu');
    
    // 如果没有找到菜单元素，直接返回
    if (!menu) return;
    
    // 添加一些平滑过渡效果
    menu.style.transition = 'transform 0.4s ease';
    
    // 滚动处理函数
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 滚动方向判断（向上或向下）
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // 向下滚动且不在顶部，隐藏菜单
            menu.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动或在顶部，显示菜单
            menu.style.transform = 'translateY(0)';
        }
        
        // 保存当前滚动位置
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    // 滚动事件监听器 (使用requestAnimationFrame优化性能)
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
            });
            ticking = true;
        }
    }, { passive: true });
    
    // 页面加载时确保菜单可见
    window.addEventListener('load', function() {
        menu.style.transform = 'translateY(0)';
    });
})(); 