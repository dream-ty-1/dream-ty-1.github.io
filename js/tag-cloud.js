// 标签云动态效果
(function() {
    // 等待DOM加载完成
    function init() {
        // 标签云容器
        const container = document.querySelector('.categories-tags');
        if (!container) return;

        const items = container.querySelectorAll('span');
        if (!items.length) return;
        
        // 随机缩放和淡入动画
        items.forEach(item => {
            // 随机大小，范围从0.9到1.2
            const scale = 0.9 + Math.random() * 0.3;
            item.style.transform = `scale(${scale})`;
            
            // 鼠标悬停事件
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.zIndex = '10';
                
                // 将其他标签略微淡化
                items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.style.opacity = '0.7';
                    }
                });
            });
            
            // 鼠标离开事件
            item.addEventListener('mouseleave', function() {
                this.style.transform = `scale(${scale})`;
                this.style.zIndex = '1';
                
                // 恢复其他标签透明度
                items.forEach(otherItem => {
                    otherItem.style.opacity = '1';
                });
            });
        });
        
        // 如果标签数量超过10个，添加轻微的悬浮效果
        if (items.length > 10) {
            let timeouts = [];
            
            function animateTags() {
                items.forEach((item, index) => {
                    // 清除之前的定时器
                    if (timeouts[index]) clearTimeout(timeouts[index]);
                    
                    // 随机延迟时间
                    const delay = 2000 + Math.random() * 5000;
                    
                    // 设置新的定时器
                    timeouts[index] = setTimeout(() => {
                        // 检查元素是否存在且没有鼠标悬停
                        if (item && !item.matches(':hover')) {
                            // 添加轻微的动画
                            const y = -5 + Math.random() * 10; // -5px to 5px
                            item.style.transform = `translateY(${y}px) scale(${scale})`;
                            
                            // 过渡完成后恢复原位，创造漂浮效果
                            setTimeout(() => {
                                if (item && !item.matches(':hover')) {
                                    item.style.transform = `scale(${scale})`;
                                }
                            }, 1500);
                        }
                        
                        // 递归调用以继续动画
                        animateTags();
                    }, delay);
                });
            }
            
            // 开始动画
            animateTags();
            
            // 在页面卸载时清除所有定时器
            window.addEventListener('beforeunload', () => {
                timeouts.forEach(timeout => {
                    if (timeout) clearTimeout(timeout);
                });
            });
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})(); 