// 粒子连线背景效果 - 性能优化版
(function() {
    // 性能配置选项
    const CONFIG = {
        particleCount: 30,           // 减少粒子数量从100到30
        particleMaxDistance: 100,    // 减少连线最大距离从150到100
        particleSpeed: 0.3,          // 降低粒子速度
        drawConnections: true,       // 是否绘制连线（可设为false进一步提高性能）
        animationFrameLimit: 30,     // 限制帧率，每秒30帧
        disableOnMobile: true,       // 在移动设备上禁用粒子效果
        opacityReduction: 0.7        // 降低整体透明度以减轻视觉负担
    };

    // 检测是否为移动设备
    const isMobileDevice = () => {
        return (window.innerWidth < 768) || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };

    // 如果是移动设备且设置为在移动设备上禁用，则直接返回
    if (CONFIG.disableOnMobile && isMobileDevice()) {
        console.log('粒子效果在移动设备上已禁用');
        return;
    }

    // 创建canvas元素
    function createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-background';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: ${CONFIG.opacityReduction};
        `;
        document.body.appendChild(canvas);
        return canvas;
    }

    // 设置canvas尺寸
    function setupCanvas(canvas) {
        const ctx = canvas.getContext('2d', { alpha: true });
        const dpr = 1; // 固定为1，不使用devicePixelRatio以提高性能
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        return ctx;
    }

    // 重设canvas尺寸 - 优化版本，节流处理
    let resizeTimeout;
    function resizeCanvas(canvas, ctx) {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            const dpr = 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
        }, 200);
    }

    // 简化的粒子类
    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.init();
        }
        
        init() {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed;
            this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed;
            this.radius = Math.random() * 1.5 + 0.5; // 减小粒子大小
            this.color = '#64B5F6'; // 使用单一颜色提高性能
        }
        
        update() {
            // 更新位置
            this.x += this.vx;
            this.y += this.vy;
            
            // 边界检测 - 简化为环绕边界
            if (this.x < 0) this.x = this.canvas.width;
            else if (this.x > this.canvas.width) this.x = 0;
            
            if (this.y < 0) this.y = this.canvas.height;
            else if (this.y > this.canvas.height) this.y = 0;
        }
    }

    // 主函数
    function init() {
        // 使用延迟初始化，避免影响页面首次加载
        setTimeout(() => {
            const canvas = createCanvas();
            const ctx = setupCanvas(canvas);
            
            // 创建粒子
            const particles = [];
            for (let i = 0; i < CONFIG.particleCount; i++) {
                particles.push(new Particle(canvas));
            }
            
            // 最后一次动画帧时间戳
            let lastFrameTime = 0;
            const frameInterval = 1000 / CONFIG.animationFrameLimit;
            
            // 窗口大小变化时重设canvas - 使用节流函数
            window.addEventListener('resize', () => resizeCanvas(canvas, ctx));
            
            // 优化的动画循环，使用RAF时间戳控制帧率
            function animate(timestamp) {
                // 帧率限制
                if (timestamp - lastFrameTime < frameInterval) {
                    requestAnimationFrame(animate);
                    return;
                }
                lastFrameTime = timestamp;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // 使用批处理减少状态更改
                ctx.fillStyle = '#64B5F6';
                ctx.strokeStyle = 'rgba(100, 181, 246, 0.3)';
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 0.6;
                
                // 更新和绘制所有粒子
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    p.update();
                    
                    // 绘制粒子
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 绘制连线 - 仅在开启时执行
                    if (CONFIG.drawConnections) {
                        for (let j = i + 1; j < particles.length; j++) {
                            const p2 = particles[j];
                            const dx = p.x - p2.x;
                            const dy = p.y - p2.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < CONFIG.particleMaxDistance) {
                                ctx.beginPath();
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.stroke();
                            }
                        }
                    }
                }
                
                requestAnimationFrame(animate);
            }
            
            // 启动动画
            animate(0);
            
        }, 1000); // 延迟1秒后初始化粒子效果
    }

    // 仅在页面完全加载后才初始化粒子效果
    window.addEventListener('load', init);
})(); 