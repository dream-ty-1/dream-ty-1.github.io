// 加载所有美化效果
(function() {
    // 效果文件列表
    const effects = [
        '/js/effects/typed.js',           // 打字机效果
        '/js/effects/click-effect.js',    // 点击特效
        '/js/effects/canvas-nest.js',     // 3D网状背景
        '/js/effects/fancybox.js',        // 图片灯箱
        '/js/effects/aos.js',             // 滚动动画
        '/js/effects/icon-animation.js'   // 图标动画
    ];
    
    // 动态加载所有效果
    effects.forEach(effectPath => {
        const script = document.createElement('script');
        script.src = effectPath;
        document.body.appendChild(script);
    });
    
    // 添加页面加载动画
    const loadingTime = 1000; // 加载动画持续时间（毫秒）
    setTimeout(() => {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.opacity = '0';
            setTimeout(() => {
                loadingElement.style.display = 'none';
            }, 500);
        }
    }, loadingTime);
    
    // 添加页面滚动进度条
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
    
    // 更新滚动进度条
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
})(); 