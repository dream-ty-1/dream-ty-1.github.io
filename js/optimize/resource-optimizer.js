/**
 * 资源加载优化器
 * 优化CSS和JavaScript文件的加载顺序和方式，提高页面加载速度
 */
(function() {
    // 动态加载CSS文件
    function loadStylesheet(url, isNonCritical = false) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        
        // 非关键CSS使用preload和onload技术加载
        if (isNonCritical) {
            link.rel = 'preload';
            link.as = 'style';
            link.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
            };
            link.setAttribute('media', 'print');
            link.addEventListener('load', function() {
                this.removeAttribute('media');
            });
        }
        
        document.head.appendChild(link);
        return link;
    }
    
    // 动态加载JavaScript文件
    function loadScript(url, async = true, defer = false) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = async;
            script.defer = defer;
            
            script.onload = function() {
                resolve(url);
            };
            
            script.onerror = function() {
                reject(new Error(`Script load error: ${url}`));
            };
            
            document.body.appendChild(script);
        });
    }
    
    // 延迟加载非关键JavaScript
    function deferNonCriticalJS() {
        // 获取所有带有defer-load属性的脚本
        const scripts = document.querySelectorAll('script[defer-load]');
        
        // 移除这些脚本并收集它们的URL
        const scriptUrls = Array.from(scripts).map(script => {
            const url = script.src;
            script.parentNode.removeChild(script);
            return url;
        });
        
        // 在页面加载完成后加载这些脚本
        window.addEventListener('load', function() {
            // 使用requestIdleCallback在浏览器空闲时加载
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    scriptUrls.forEach(url => {
                        loadScript(url, true, true)
                            .catch(err => console.error('Error loading deferred script:', err));
                    });
                });
            } else {
                // 回退方案
                setTimeout(() => {
                    scriptUrls.forEach(url => {
                        loadScript(url, true, true)
                            .catch(err => console.error('Error loading deferred script:', err));
                    });
                }, 1000);
            }
        });
    }
    
    // 按需加载样式
    function loadStylesOnDemand() {
        // 根据用户行为加载额外样式
        // 例如，仅当用户打开评论区时加载评论相关样式
        const commentToggle = document.querySelector('.comment-toggle');
        if (commentToggle) {
            commentToggle.addEventListener('click', function() {
                if (!document.querySelector('link[href*="comment.css"]')) {
                    loadStylesheet('/css/comment.css', true);
                }
            });
        }
        
        // 检测页面类型，按需加载样式
        if (document.querySelector('.archive-container')) {
            loadStylesheet('/css/archive.css', true);
        }
        
        if (document.querySelector('.tag-cloud')) {
            loadStylesheet('/css/tag-cloud.css', true);
        }
    }
    
    // 初始化资源优化
    function init() {
        // 延迟加载非关键JavaScript
        deferNonCriticalJS();
        
        // 按需加载样式
        if (document.readyState === 'complete') {
            loadStylesOnDemand();
        } else {
            window.addEventListener('load', loadStylesOnDemand);
        }
        
        // 使用字体显示交换提高性能
        document.documentElement.style.fontDisplay = 'swap';
    }
    
    // 启动资源优化
    init();
})(); 