/**
 * 图片优化工具
 * 优化图片加载和处理，减少页面加载时间
 */
(function() {
    // 图片加载错误处理
    function setupImageErrorHandling() {
        // 获取所有图片
        const images = document.querySelectorAll('img');
        
        // 为每个图片添加错误处理
        images.forEach(img => {
            // 避免重复绑定
            if (img.dataset.errorHandled) return;
            
            // 添加错误处理
            img.onerror = function() {
                // 替换为默认图片
                this.src = '/images/image-placeholder.svg';
                this.alt = '图片加载失败';
                this.classList.add('img-error');
                
                // 移除可能的srcset属性
                this.removeAttribute('srcset');
            };
            
            // 标记已处理
            img.dataset.errorHandled = 'true';
        });
    }
    
    // 响应式图片处理
    function setupResponsiveImages() {
        // 获取所有图片容器
        const imageContainers = document.querySelectorAll('.post-content figure, .post-content p:has(img)');
        
        imageContainers.forEach(container => {
            const images = container.querySelectorAll('img:not(.no-responsive)');
            
            images.forEach(img => {
                // 已处理的图片跳过
                if (img.dataset.responsiveHandled) return;
                
                // 创建picture元素
                const picture = document.createElement('picture');
                
                // 创建不同尺寸的source元素
                if (img.src.match(/\.(jpg|jpeg|png)$/i)) {
                    // WebP格式source
                    const webpSource = document.createElement('source');
                    webpSource.srcset = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    webpSource.type = 'image/webp';
                    picture.appendChild(webpSource);
                    
                    // 原始格式source
                    const originalSource = document.createElement('source');
                    originalSource.srcset = img.src;
                    originalSource.type = img.src.toLowerCase().endsWith('png') ? 'image/png' : 'image/jpeg';
                    picture.appendChild(originalSource);
                }
                
                // 保存原始图片属性
                const imgClone = img.cloneNode(true);
                
                // 将原始图片替换为picture元素
                img.parentNode.insertBefore(picture, img);
                picture.appendChild(imgClone);
                img.remove();
                
                // 标记已处理
                imgClone.dataset.responsiveHandled = 'true';
            });
        });
    }
    
    // 图片加载完成后的处理
    function handleImageLoad() {
        // 获取所有图片
        const images = document.querySelectorAll('img');
        
        // 为每个图片添加加载完成处理
        images.forEach(img => {
            // 避免重复绑定
            if (img.dataset.loadHandled) return;
            
            // 如果图片已经加载完成
            if (img.complete) {
                img.classList.add('img-loaded');
            } else {
                // 添加加载完成事件
                img.onload = function() {
                    this.classList.add('img-loaded');
                };
            }
            
            // 标记已处理
            img.dataset.loadHandled = 'true';
        });
    }
    
    // 添加图片渐进式加载效果
    function setupProgressiveImageLoading() {
        // 获取所有图片容器
        const imageContainers = document.querySelectorAll('.post-content figure, .post-content p:has(img)');
        
        imageContainers.forEach(container => {
            const images = container.querySelectorAll('img:not(.no-progressive)');
            
            images.forEach(img => {
                // 已处理的图片跳过
                if (img.dataset.progressiveHandled) return;
                
                // 创建低质量图片的数据URL（模拟缩略图）
                // 在实际应用中，应该由服务器提供真实的缩略图
                const thumbnail = img.dataset.thumbnail || img.src;
                
                // 保存原始图片源
                const originalSrc = img.src;
                
                // 设置为缩略图
                img.src = thumbnail;
                
                // 创建包装容器
                const wrapper = document.createElement('div');
                wrapper.className = 'progressive-image-container';
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
                
                // 创建加载动画
                const loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'progressive-image-loading';
                wrapper.appendChild(loadingIndicator);
                
                // 预加载原始图片
                const fullImage = new Image();
                fullImage.src = originalSrc;
                fullImage.onload = function() {
                    // 渐变切换到完整图片
                    img.src = originalSrc;
                    img.classList.add('progressive-image-loaded');
                    loadingIndicator.style.display = 'none';
                };
                
                // 标记已处理
                img.dataset.progressiveHandled = 'true';
            });
        });
    }
    
    // 修复图片尺寸和布局偏移
    function fixImageLayouts() {
        // 获取所有文章图片
        const articleImages = document.querySelectorAll('.post-content img');
        
        articleImages.forEach(img => {
            // 已处理的图片跳过
            if (img.dataset.layoutFixed) return;
            
            // 设置图片占位符，避免加载过程中的布局偏移
            if (!img.getAttribute('width') || !img.getAttribute('height')) {
                // 设置默认的宽高比例，避免布局偏移
                img.style.aspectRatio = '16/9';
            }
            
            // 确保图片容器具有合适的样式
            let parent = img.parentElement;
            if (parent.tagName.toLowerCase() === 'p') {
                parent.style.margin = '0';
                parent.style.lineHeight = '0';
            }
            
            // 标记已处理
            img.dataset.layoutFixed = 'true';
        });
    }
    
    // 初始化函数
    function init() {
        // 设置图片错误处理
        setupImageErrorHandling();
        
        // 处理响应式图片
        if (document.readyState === 'complete') {
            setupResponsiveImages();
            handleImageLoad();
            setupProgressiveImageLoading();
            fixImageLayouts();
        } else {
            window.addEventListener('load', function() {
                setupResponsiveImages();
                handleImageLoad();
                setupProgressiveImageLoading();
                fixImageLayouts();
            });
        }
    }
    
    // 添加图片相关的CSS
    function addImageStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 图片渐进式加载样式 */
            .progressive-image-container {
                position: relative;
                overflow: hidden;
                background-color: #f0f0f0;
            }
            
            .progressive-image-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                margin: -20px 0 0 -20px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: 1;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .post-content img {
                transition: opacity 0.3s ease-in-out;
                max-width: 100%;
                height: auto;
            }
            
            .progressive-image-loaded {
                opacity: 1;
            }
            
            /* 图片错误样式 */
            img.img-error {
                border: 1px dashed #ff6b6b;
                padding: 10px;
                opacity: 0.7;
            }
            
            /* 图片加载完成样式 */
            img.img-loaded {
                animation: fadeIn 0.5s;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加样式并初始化
    addImageStyles();
    init();
})(); 