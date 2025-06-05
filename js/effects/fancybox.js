// 图片灯箱效果
(function() {
    // 加载FancyBox CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css';
    document.head.appendChild(css);
    
    // 加载FancyBox JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js';
    document.head.appendChild(script);
    
    // 等待脚本加载完成后初始化
    script.onload = function() {
        // 确保DOM已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFancyBox);
        } else {
            initFancyBox();
        }
    };
    
    function initFancyBox() {
        // 获取文章内容区域内的所有图片
        const contentImages = document.querySelectorAll('.content img');
        
        // 为每个图片添加灯箱效果
        contentImages.forEach(img => {
            // 不处理已有父链接的图片
            if (img.parentNode.tagName !== 'A') {
                // 创建链接包装图片
                const link = document.createElement('a');
                link.href = img.src;
                link.dataset.fancybox = 'gallery';
                link.dataset.caption = img.alt || '图片查看';
                
                // 替换图片为包装后的图片
                img.parentNode.insertBefore(link, img);
                link.appendChild(img);
            }
        });
        
        // 初始化FancyBox
        Fancybox.bind('[data-fancybox="gallery"]', {
            // 配置选项
            animationEffect: "zoom",
            transitionEffect: "fade",
            loop: true,
            buttons: [
                "zoom",
                "slideShow",
                "fullScreen",
                "thumbs",
                "close"
            ]
        });
    }
})(); 