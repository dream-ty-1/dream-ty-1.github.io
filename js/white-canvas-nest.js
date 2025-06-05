// 白色网状背景特效
(function() {
    // 确保脚本只执行一次
    if (window.whiteCanvasNestInitialized) return;
    window.whiteCanvasNestInitialized = true;
    
    console.log('白色网状背景初始化中...');
    
    // 移除之前的canvas-nest实例（如果存在）
    const oldCanvas = document.querySelector('canvas.canvas-nest');
    if (oldCanvas) {
        oldCanvas.remove();
    }
    
    // 创建canvas元素
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-2';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.className = 'custom-canvas-nest';
    document.body.appendChild(canvas);
    
    // 获取canvas上下文
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 创建粒子
    const particleCount = 120;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 0.5 - 0.25
        });
    }
    
    // 鼠标位置
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    // 监听鼠标移动
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 动画函数
    function animate() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新粒子位置
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界检查
            if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy;
            
            // 绘制粒子
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
        });
        
        // 绘制连接线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            
            // 连接附近的粒子
            for (let j = i + 1; j < particles.length; j++) {
                const particle2 = particles[j];
                const dx = particle.x - particle2.x;
                const dy = particle.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    // 根据距离设置透明度
                    ctx.globalAlpha = 1 - (distance / 100);
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.stroke();
                }
            }
            
            // 连接鼠标和粒子
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.globalAlpha = 1 - (distance / 150);
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
            }
        }
        
        // 重置透明度
        ctx.globalAlpha = 1;
        
        // 循环动画
        requestAnimationFrame(animate);
    }
    
    // 启动动画
    animate();
    
    console.log('白色网状背景已启用 - 自定义实现');
})(); 