// 加载所有美化效果 - 性能优化版
(function() {
    // 性能配置
    const PERFORMANCE = {
        delayFirstEffect: 300,    // 第一个效果延迟加载毫秒数
        delayBetweenEffects: 300, // 效果之间的间隔毫秒数
        priorityEffects: true,    // 是否按优先级加载效果
        loadAfterContent: true,   // 是否等待内容加载后再加载特效
        disableOnMobile: {        // 在移动设备上禁用的特效
            'typed.js': false,    // 打字机效果保留
            'click-effect.js': false, // 点击特效保留
            'canvas-nest.js': true,   // 3D网状背景禁用
            'fancybox.js': false,     // 图片灯箱保留
            'aos.js': false,          // 滚动动画保留
            'icon-animation.js': true // 图标动画禁用
        }
    };
    
    // 检测是否为移动设备
    const isMobile = () => {
        return (window.innerWidth < 768) || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };
    
    // 效果文件列表（按优先级排序）
    const effects = [
        { name: 'typed.js', path: '/js/effects/typed.js', priority: 1 },           // 打字机效果（优先级高）
        { name: 'fancybox.js', path: '/js/effects/fancybox.js', priority: 2 },     // 图片灯箱（优先级中）
        { name: 'aos.js', path: '/js/effects/aos.js', priority: 2 },              // 滚动动画（优先级中）
        { name: 'click-effect.js', path: '/js/effects/click-effect.js', priority: 3 }, // 点击特效（优先级低）
        { name: 'icon-animation.js', path: '/js/effects/icon-animation.js', priority: 4 } // 图标动画（优先级很低）
    ];
    
    // 移除在移动设备上需要禁用的特效
    const effectsToLoad = isMobile() 
        ? effects.filter(effect => !PERFORMANCE.disableOnMobile[effect.name])
        : effects;
    
    // 按优先级排序
    if (PERFORMANCE.priorityEffects) {
        effectsToLoad.sort((a, b) => a.priority - b.priority);
    }
    
    // 页面加载完成后再加载特效
    const loadEffects = () => {
        let loadIndex = 0;
        
        const loadNextEffect = () => {
            if (loadIndex >= effectsToLoad.length) return;
            
            const effect = effectsToLoad[loadIndex++];
            const script = document.createElement('script');
            script.src = effect.path;
            script.async = true;
            
            // 脚本加载完成后加载下一个效果
            script.onload = () => {
                setTimeout(loadNextEffect, PERFORMANCE.delayBetweenEffects);
            };
            
            // 脚本加载失败时也继续加载下一个
            script.onerror = () => {
                console.error(`Failed to load effect: ${effect.name}`);
                setTimeout(loadNextEffect, PERFORMANCE.delayBetweenEffects);
            };
            
            document.body.appendChild(script);
        };
        
        // 开始加载第一个效果，带延迟
        setTimeout(loadNextEffect, PERFORMANCE.delayFirstEffect);
    };
    
    // 监听DOM内容加载完成事件
    if (PERFORMANCE.loadAfterContent) {
        window.addEventListener('DOMContentLoaded', () => {
            // 添加页面加载动画
            const loadingTime = 800; // 减少加载动画持续时间
            setTimeout(() => {
                const loadingElement = document.getElementById('loading');
                if (loadingElement) {
                    loadingElement.style.opacity = '0';
                    setTimeout(() => {
                        loadingElement.style.display = 'none';
                    }, 300);
                }
                
                // 开始加载特效
                loadEffects();
            }, loadingTime);
        });
    } else {
        // 立即加载特效（不推荐）
        loadEffects();
    }
    
    // 添加页面滚动进度条 - 立即执行，不需要等待
    const addProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.height = '3px';
        progressBar.style.backgroundColor = '#66afef';
        progressBar.style.zIndex = '10000';
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 0.2s ease';
        document.body.appendChild(progressBar);
        
        // 使用节流函数优化滚动事件
        let lastScrollTime = 0;
        const scrollThrottle = 100; // 100ms内只处理一次滚动事件
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime < scrollThrottle) return;
            lastScrollTime = now;
            
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };
    
    // 立即添加滚动进度条
    addProgressBar();
})(); 