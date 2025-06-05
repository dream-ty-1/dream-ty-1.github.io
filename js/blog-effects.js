// 博客美化特效合集
document.addEventListener('DOMContentLoaded', function() {
    console.log('博客美化特效初始化中...');
    
    try {
        // 1. 添加打字机效果
        initTypedEffect();
        
        // 2. 添加点击特效
        initClickEffect();
        
        // 3. 添加3D网状背景
        initCanvasNest();
        
        // 4. 添加图片灯箱效果
        initFancyBox();
        
        // 5. 添加滚动动画
        initAOS();
        
        // 6. 添加图标动画
        initIconAnimations();
        
        // 7. 添加页面进度条
        initProgressBar();
        
        console.log('所有特效初始化完成！');
    } catch (error) {
        console.error('特效初始化失败:', error);
    }
});

// 1. 打字机效果
function initTypedEffect() {
    // 加载Typed.js库
    loadScript('https://cdn.jsdelivr.net/npm/typed.js@2.0.12', function() {
        // 查找首页标题元素
        const titleElement = document.querySelector('#home-head #home-info .info .wrap h1');
        if (!titleElement) return;
        
        // 保存原始文本
        const originalText = titleElement.textContent;
        // 清空文本以便打字效果
        titleElement.textContent = '';
        
        // 初始化打字机
        new Typed(titleElement, {
            strings: [originalText],
            typeSpeed: 100,
            backSpeed: 50,
            loop: false,
            showCursor: true,
            cursorChar: '|',
            onComplete: (self) => {
                // 打字完成后处理
                setTimeout(() => {
                    self.cursor.style.display = 'none';
                }, 1500);
            }
        });
        console.log('打字机效果已启用');
    });
}

// 2. 点击特效
function initClickEffect() {
    // 定义特效颜色数组 - 修改为白色系列颜色
    const colors = ['#FFFFFF', '#F0F0FF', '#E8E8FF', '#FFFFEE', '#F5F5F5', '#FAFAFA'];
    
    // 创建点击事件监听器
    document.addEventListener('click', function(event) {
        // 创建烟花特效
        createFirework(event.clientX, event.clientY);
    });
    
    function createFirework(x, y) {
        // 创建更多粒子 (从30个增加到45个)
        for (let i = 0; i < 45; i++) {
            createParticle(x, y);
        }
    }
    
    function createParticle(x, y) {
        // 创建粒子元素
        const particle = document.createElement('div');
        document.body.appendChild(particle);
        
        // 随机选择颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机粒子尺寸 (6-10px)
        const size = Math.floor(Math.random() * 5) + 6;
        
        // 设置粒子样式
        particle.style.position = 'fixed';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 6px ${color}, 0 0 12px ${color}`;
        particle.style.pointerEvents = 'none';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.zIndex = '10000';
        
        // 随机动画参数 - 增大扩散范围
        const destinationX = x + (Math.random() - 0.5) * 150;
        const destinationY = y + (Math.random() - 0.5) * 150;
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
            duration: 1200, // 增加动画时长
            delay: delay,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        }).onfinish = function() {
            // 动画结束后移除粒子
            particle.remove();
        };
    }
    console.log('点击特效已启用 - 白色粒子效果');
}

// 3. 3D网状背景
function initCanvasNest() {
    // 已被white-canvas-nest.js替代，不再加载原始版本
    // loadScript('https://cdn.jsdelivr.net/npm/canvas-nest.js@1.0.1', null, {
    //     color: '64,157,245',
    //     opacity: '0.7',
    //     count: '99',
    //     zIndex: '-2'
    // });
    console.log('原3D网状背景已禁用，使用白色版本替代');
}

// 4. 图片灯箱效果
function initFancyBox() {
    // 加载FancyBox CSS
    loadCSS('https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css');
    
    // 加载FancyBox JS
    loadScript('https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js', function() {
        // 获取文章内容区域内的所有图片
        const contentImages = document.querySelectorAll('.content img');
        
        // 为每个图片添加灯箱效果
        contentImages.forEach(img => {
            // 不处理已有父链接的图片
            if (img.parentNode.tagName !== 'A') {
                // 创建链接包装图片
                const link = document.createElement('a');
                link.href = img.src;
                link.dataset.fancybox = 'gallery';
                link.dataset.caption = img.alt || '图片查看';
                
                // 替换图片为包装后的图片
                img.parentNode.insertBefore(link, img);
                link.appendChild(img);
            }
        });
        
        // 初始化FancyBox
        if (typeof Fancybox !== 'undefined') {
            Fancybox.bind('[data-fancybox="gallery"]', {
                // 配置选项
                animationEffect: "zoom",
                transitionEffect: "fade",
                loop: true,
                buttons: [
                    "zoom",
                    "slideShow",
                    "fullScreen",
                    "thumbs",
                    "close"
                ]
            });
            console.log('图片灯箱效果已启用');
        } else {
            console.error('Fancybox未能正确加载');
        }
    });
}

// 5. 滚动动画
function initAOS() {
    // 加载AOS CSS
    loadCSS('https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css');
    
    // 加载AOS JS
    loadScript('https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js', function() {
        if (typeof AOS === 'undefined') {
            console.error('AOS未能正确加载');
            return;
        }
        
        // 为文章卡片添加动画属性
        const cards = document.querySelectorAll('#home-posts .post');
        cards.forEach((card, index) => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());
            card.setAttribute('data-aos-duration', '800');
        });
        
        // 为侧边栏卡片添加动画
        const sideCard = document.querySelector('#home-card #card-style');
        if (sideCard) {
            sideCard.setAttribute('data-aos', 'fade-left');
            sideCard.setAttribute('data-aos-duration', '800');
        }
        
        // 为文章内容添加动画
        const contentBlocks = document.querySelectorAll('.article .content > *');
        contentBlocks.forEach((block, index) => {
            block.setAttribute('data-aos', 'fade-up');
            block.setAttribute('data-aos-delay', (index * 50).toString());
            block.setAttribute('data-aos-duration', '600');
        });
        
        // 初始化AOS
        AOS.init({
            offset: 120,
            delay: 0,
            duration: 800,
            easing: 'ease',
            once: true
        });
        console.log('滚动动画已启用');
    });
}

// 6. 图标悬停动画
function initIconAnimations() {
    // 为侧边栏社交图标添加悬停动画
    const socialIcons = document.querySelectorAll('#home-card #card-div .icon-links a');
    
    socialIcons.forEach(icon => {
        // 添加过渡效果
        icon.style.transition = 'transform 0.3s ease, color 0.3s ease';
        
        // 添加鼠标悬停事件监听器
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.2)';
            this.style.color = '#66afef';
        });
        
        // 添加鼠标离开事件监听器
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.color = '';
        });
    });
    
    // 为菜单项添加悬停效果
    const menuItems = document.querySelectorAll('#menu #desktop-menu a, #menu #mobile-menu a');
    
    menuItems.forEach(item => {
        // 添加过渡效果
        item.style.transition = 'transform 0.3s ease, text-shadow 0.3s ease';
        
        // 添加鼠标悬停事件监听器
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.textShadow = '0 0 8px rgba(102, 175, 239, 0.8)';
        });
        
        // 添加鼠标离开事件监听器
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.textShadow = 'none';
        });
    });
    console.log('图标悬停动画已启用');
}

// 7. 页面进度条
function initProgressBar() {
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
    console.log('页面进度条已启用');
}

// 工具函数：加载外部JavaScript
function loadScript(src, callback, attributes) {
    const script = document.createElement('script');
    script.src = src;
    
    if (attributes) {
        Object.keys(attributes).forEach(key => {
            script[key] = attributes[key];
        });
    }
    
    if (callback) {
        script.onload = callback;
    }
    
    script.onerror = function() {
        console.error('加载脚本失败:', src);
    };
    
    document.head.appendChild(script);
    return script;
}

// 工具函数：加载外部CSS
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return link;
} 