// 鼠标点击特效
(function() {
    // 定义特效颜色数组
    const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C', '#FF85E4', '#00E4FF'];
    
    // 创建点击事件监听器
    document.addEventListener('click', function(event) {
        // 创建烟花特效
        createFirework(event.clientX, event.clientY);
    });
    
    function createFirework(x, y) {
        // 创建30个粒子
        for (let i = 0; i < 30; i++) {
            createParticle(x, y);
        }
    }
    
    function createParticle(x, y) {
        // 创建粒子元素
        const particle = document.createElement('div');
        document.body.appendChild(particle);
        
        // 随机选择颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 设置粒子样式
        particle.style.position = 'fixed';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.zIndex = '10000';
        
        // 随机动画参数
        const destinationX = x + (Math.random() - 0.5) * 100;
        const destinationY = y + (Math.random() - 0.5) * 100;
        const rotation = Math.random() * 520;
        const delay = Math.random() * 200;
        
        // 设置动画
        particle.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${destinationX - x}px, ${destinationY - y}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: 1000,
            delay: delay,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        }).onfinish = function() {
            // 动画结束后移除粒子
            particle.remove();
        };
    }
})(); 