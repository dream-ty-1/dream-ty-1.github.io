// 图片弹出查看效果
(function() {
    // 创建弹出层
    function createLightbox() {
        // 创建容器
        const lightbox = document.createElement('div');
        lightbox.className = 'img-lightbox';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.className = 'lightbox-img';
        lightbox.appendChild(img);
        
        // 创建关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', function() {
            hideLightbox(lightbox);
        });
        lightbox.appendChild(closeBtn);
        
        // 点击空白区域关闭
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                hideLightbox(lightbox);
            }
        });
        
        // 键盘事件监听(ESC关闭)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                hideLightbox(lightbox);
            }
        });
        
        // 添加到页面
        document.body.appendChild(lightbox);
        return lightbox;
    }
    
    // 显示弹出层
    function showLightbox(lightbox, imgSrc) {
        // 设置图片源
        const img = lightbox.querySelector('.lightbox-img');
        
        // 添加加载监听
        img.onload = function() {
            // 图片加载完成后显示
            setTimeout(function() {
                lightbox.classList.add('active');
            }, 50);
        };
        
        // 设置图片源
        img.src = imgSrc;
        
        // 阻止页面滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 隐藏弹出层
    function hideLightbox(lightbox) {
        lightbox.classList.remove('active');
        
        // 恢复页面滚动
        document.body.style.overflow = '';
    }
    
    // 初始化函数 - 处理文章中的所有图片
    function initLightbox() {
        // 创建弹出层
        const lightbox = createLightbox();
        
        // 查找文章内容区域的所有图片
        const articleContainers = document.querySelectorAll('.article .content');
        
        articleContainers.forEach(function(container) {
            // 查找所有非特定类别的图片（排除不需要点击放大的图片）
            const images = container.querySelectorAll('img:not(.no-lightbox)');
            
            // 为每个图片添加点击事件
            images.forEach(function(img) {
                img.style.cursor = 'zoom-in';
                
                img.addEventListener('click', function() {
                    // 使用原始图片地址或data-src属性
                    const imgSrc = img.getAttribute('data-src') || img.getAttribute('src');
                    showLightbox(lightbox, imgSrc);
                });
            });
        });
    }
    
    // 延迟初始化，确保DOM已完全加载
    function delayedInit() {
        // 检查DOM是否包含文章内容区域
        if (document.querySelector('.article .content')) {
            initLightbox();
        } else {
            // 如果页面上没有文章内容，可能是在首页或其他页面
            // 这里可以做一些其他处理或直接返回
            return;
        }
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        delayedInit();
    } else {
        window.addEventListener('load', delayedInit);
    }
})(); 