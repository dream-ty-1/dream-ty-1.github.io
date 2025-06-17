/**
 * 资源预加载与关键资源优先加载
 * 通过预加载用户可能即将访问的页面资源，提高浏览体验
 */
document.addEventListener("DOMContentLoaded", function() {
    // 预加载下一页内容（适用于分页浏览）
    function preloadNextPage() {
        const nextPageLink = document.querySelector('a.page-next');
        if (nextPageLink) {
            const nextPageUrl = nextPageLink.href;
            
            // 创建预加载链接
            const linkPreload = document.createElement('link');
            linkPreload.rel = 'prefetch';
            linkPreload.href = nextPageUrl;
            document.head.appendChild(linkPreload);
            
            console.log('Preloaded next page:', nextPageUrl);
        }
    }
    
    // 预加载文章详情页中的图片
    function preloadPostImages() {
        // 仅在文章列表页面执行
        if (document.querySelector('.post-list')) {
            const postLinks = document.querySelectorAll('.post-link');
            
            // 监听文章链接的hover事件
            postLinks.forEach(link => {
                link.addEventListener('mouseenter', function() {
                    // 获取文章链接
                    const postUrl = this.href;
                    
                    // 如果已经预加载过，不再重复
                    if (this.dataset.preloaded === 'true') return;
                    
                    // 使用fetch预加载文章页面
                    fetch(postUrl)
                        .then(response => response.text())
                        .then(html => {
                            // 创建DOM解析器
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            
                            // 提取文章中的图片
                            const images = doc.querySelectorAll('.post-content img');
                            
                            // 预加载前3张图片
                            let preloadCount = 0;
                            images.forEach(img => {
                                if (preloadCount < 3 && img.src) {
                                    const imgPreload = new Image();
                                    imgPreload.src = img.src;
                                    preloadCount++;
                                }
                            });
                            
                            // 标记为已预加载
                            this.dataset.preloaded = 'true';
                        })
                        .catch(err => {
                            console.error('Error preloading post:', err);
                        });
                });
            });
        }
    }
    
    // 预加载字体文件
    function preloadFonts() {
        // 预加载网站使用的字体
        const fontFiles = [
            '/fonts/main-font.woff2'
        ];
        
        // 检查是否首次访问（使用sessionStorage）
        if (!sessionStorage.getItem('fontsPreloaded')) {
            fontFiles.forEach(fontUrl => {
                // 创建预加载链接
                const linkPreload = document.createElement('link');
                linkPreload.rel = 'preload';
                linkPreload.href = fontUrl;
                linkPreload.as = 'font';
                linkPreload.type = 'font/woff2';
                linkPreload.crossOrigin = 'anonymous';
                document.head.appendChild(linkPreload);
            });
            
            // 标记字体已预加载
            sessionStorage.setItem('fontsPreloaded', 'true');
        }
    }
    
    // 在页面加载完成后，启动预加载逻辑
    window.addEventListener('load', function() {
        // 使用requestIdleCallback在浏览器空闲时执行预加载
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                preloadNextPage();
                preloadPostImages();
                preloadFonts();
            });
        } else {
            // 回退方案
            setTimeout(() => {
                preloadNextPage();
                preloadPostImages();
                preloadFonts();
            }, 2000); // 延迟2秒，等待页面主要内容加载完成
        }
    });
}); 