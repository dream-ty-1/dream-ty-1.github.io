/**
 * 轻量级主脚本
 * 优化性能，减少不必要的操作
 */

document.addEventListener('DOMContentLoaded', function() {
    // 移除加载动画
    setTimeout(function() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }, 200);
    
    // 初始化背景图片
    initBackground();
    
    // 初始化图片预览
    initImagePreview();
    
    // 添加代码复制按钮
    addCodeCopyButtons();
    
    // 添加返回顶部按钮
    initBackToTop();
});

/**
 * 初始化背景图片
 */
function initBackground() {
    const background = document.getElementById('home-background');
    if (!background) return;
    
    const images = background.getAttribute('data-images');
    if (!images) return;
    
    // 解析图片列表
    const imageList = JSON.parse(images.replace(/&quot;/g, '"'));
    if (!imageList || !imageList.length) return;
    
    // 随机选择一张图片
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
    
    // 预加载图片
    const img = new Image();
    img.onload = function() {
        // 设置背景
        background.style.backgroundImage = `url(${randomImage})`;
        background.style.opacity = '1';
    };
    img.src = randomImage;
}

/**
 * 初始化图片预览
 */
function initImagePreview() {
    const preview = document.getElementById('preview');
    const previewContent = document.getElementById('preview-content');
    if (!preview || !previewContent) return;
    
    // 获取所有文章内容中的图片
    const contentImages = document.querySelectorAll('.content img');
    contentImages.forEach(img => {
        // 添加点击事件
        img.addEventListener('click', function() {
            previewContent.src = this.src;
            preview.style.display = 'flex';
        });
    });
    
    // 点击预览区域关闭预览
    preview.addEventListener('click', function() {
        this.style.display = 'none';
    });
}

/**
 * 添加代码复制按钮
 */
function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '复制';
        
        // 添加到代码块
        block.style.position = 'relative';
        block.appendChild(copyButton);
        
        // 添加点击事件
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = '已复制';
                setTimeout(() => {
                    copyButton.textContent = '复制';
                }, 2000);
            });
        });
    });
}

/**
 * 初始化返回顶部按钮
 */
function initBackToTop() {
    // 检查是否已存在
    if (document.querySelector('.back-to-top')) return;
    
    // 创建按钮
    const button = document.createElement('a');
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    button.href = 'javascript:void(0)';
    
    // 添加点击事件
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 添加到页面
    document.body.appendChild(button);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
} 