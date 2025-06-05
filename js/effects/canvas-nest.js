// 3D网状背景特效
(function() {
    // 加载canvas-nest.js脚本
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-nest.js@1.0.1';
    script.color = '64,157,245'; // 线条颜色
    script.opacity = '0.7'; // 透明度
    script.count = '99'; // 线条数量
    script.zIndex = '-2'; // 保证背景在底层
    document.head.appendChild(script);
})(); 