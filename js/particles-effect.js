// 粒子连线背景效果
(function() {
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
            opacity: 0.6;
        `;
        document.body.appendChild(canvas);
        return canvas;
    }

    // 设置canvas尺寸
    function setupCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        return ctx;
    }

    // 重设canvas尺寸
    function resizeCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
    }

    // 粒子类
    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.init();
        }
        
        init() {
            this.x = Math.random() * this.canvas.width / window.devicePixelRatio;
            this.y = Math.random() * this.canvas.height / window.devicePixelRatio;
            this.vx = (Math.random() - 0.5) * 0.5; // x轴速度
            this.vy = (Math.random() - 0.5) * 0.5; // y轴速度
            this.radius = Math.random() * 2 + 1;   // 粒子大小
            this.initialRadius = this.radius;
            this.opacity = Math.random() * 0.5 + 0.3; // 初始透明度
            
            // 彩色渐变粒子（蓝色基调）
            const blueShades = [
                '#64B5F6', // 浅蓝
                '#2196F3', // 蓝
                '#1976D2', // 深蓝
                '#90CAF9', // 更浅的蓝
                '#42A5F5', // 中蓝
                '#E3F2FD'  // 非常浅的蓝
            ];
            
            // 随机从蓝色调中选择一种
            this.color = blueShades[Math.floor(Math.random() * blueShades.length)];
        }
        
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        
        update() {
            // 边界检测
            if (this.x + this.radius > this.canvas.width / window.devicePixelRatio) {
                this.vx = -Math.abs(this.vx);
            } else if (this.x - this.radius < 0) {
                this.vx = Math.abs(this.vx);
            }
            
            if (this.y + this.radius > this.canvas.height / window.devicePixelRatio) {
                this.vy = -Math.abs(this.vy);
            } else if (this.y - this.radius < 0) {
                this.vy = Math.abs(this.vy);
            }
            
            // 更新位置
            this.x += this.vx;
            this.y += this.vy;
            
            // 呼吸效果
            this.radius = this.initialRadius * (1 + 0.1 * Math.sin(Date.now() * 0.001));
            
            // 轻微变化透明度
            this.opacity = Math.max(0.3, Math.min(0.8, this.opacity + (Math.random() - 0.5) * 0.02));
        }
    }

    // 主函数
    function init() {
        const canvas = createCanvas();
        const ctx = setupCanvas(canvas);
        
        // 创建粒子
        const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000));
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(canvas));
        }
        
        // 连线最大距离
        const maxDistance = 150;
        
        // 鼠标交互
        let mouse = {
            x: null,
            y: null,
            radius: 100
        };
        
        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        
        window.addEventListener('mouseout', function() {
            mouse.x = null;
            mouse.y = null;
        });
        
        // 窗口大小变化时重设canvas
        window.addEventListener('resize', function() {
            resizeCanvas(canvas);
        });
        
        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
            
            // 更新和绘制所有粒子
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(ctx);
                
                // 鼠标交互 - 当鼠标靠近时粒子会被吸引
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        
                        // 施加一个微弱的力
                        particles[i].vx += forceDirectionX * force * 0.2;
                        particles[i].vy += forceDirectionY * force * 0.2;
                    }
                }
                
                // 粒子连线
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        // 线条透明度基于距离
                        const opacity = 1 - (distance / maxDistance);
                        
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 181, 246, ${opacity * 0.5})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // DOM加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})(); 