// 加载自定义CSS文件
(function() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/custom.css';
    document.head.appendChild(link);
})(); 